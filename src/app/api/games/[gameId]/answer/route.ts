import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import { Game } from '@/lib/models/Game';

interface Player {
  userId: string;
  username: string;
  score: number;
  answers: Array<{
    questionIndex: number;
    answer: number;
    isCorrect: boolean;
    timeSpent: number;
    points: number;
  }>;
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    const { questionIndex, answer } = await req.json();

    await connectDB();

    const game = await Game.findOne({ gameId: params.gameId });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (game.status !== 'in-progress') {
      return NextResponse.json(
        { error: 'Game is not in progress' },
        { status: 400 }
      );
    }

    if (questionIndex !== game.currentQuestion) {
      return NextResponse.json(
        { error: 'Invalid question index' },
        { status: 400 }
      );
    }

    // Calculate time spent and check if the question time has expired
    const currentTime = new Date();
    const questionStartTime = new Date(game.startTime);
    const timePerQuestion = game.settings.timePerQuestion * 1000; // Convert to milliseconds
    const totalElapsedTime = currentTime.getTime() - questionStartTime.getTime();
    const currentQuestionStartTime = questionIndex * timePerQuestion;
    const currentQuestionElapsedTime = totalElapsedTime - currentQuestionStartTime;

    // If time has expired, don't accept new answers and move to next question
    if (currentQuestionElapsedTime >= timePerQuestion) {
      // Check if we need to process unanswered players
      const playersToUpdate = game.players.filter((p: Player) => 
        !p.answers.some((a: { questionIndex: number }) => a.questionIndex === questionIndex)
      );

      // Record timeout answers for players who haven't answered
      for (const player of playersToUpdate) {
        player.answers.push({
          questionIndex,
          answer: -1, // Indicate timeout
          isCorrect: false,
          timeSpent: game.settings.timePerQuestion,
          points: 0
        });
      }

      // Move to next question or end game if not already done
      if (game.currentQuestion === questionIndex) {
        if (game.currentQuestion + 1 < game.questions.length) {
          game.currentQuestion += 1;
        } else {
          game.status = 'completed';
          game.endTime = new Date();
        }
        await game.save();
      }

      return NextResponse.json({
        message: 'Question time expired',
        isCorrect: false,
        points: 0,
        timeSpent: game.settings.timePerQuestion,
        nextQuestion: game.currentQuestion
      });
    }

    // Find the player using email
    const playerIndex = game.players.findIndex(
      (player: Player) => player.userId === userEmail
    );

    if (playerIndex === -1) {
      return NextResponse.json(
        { error: 'Player not found in game' },
        { status: 404 }
      );
    }

    const player = game.players[playerIndex];
    const question = game.questions[questionIndex];

    // Check if player has already answered this question
    const hasAnswered = player.answers.some(
      (a: { questionIndex: number }) => a.questionIndex === questionIndex
    );

    if (hasAnswered) {
      return NextResponse.json(
        { error: 'Already answered this question' },
        { status: 400 }
      );
    }

    // Calculate points based on time spent
    const timeSpent = currentQuestionElapsedTime / 1000; // Convert to seconds
    const isCorrect = answer === question.correctAnswer;
    const timeBonus = Math.max(0, 1 - (timeSpent / game.settings.timePerQuestion));
    const points = isCorrect ? Math.ceil(question.points * (0.5 + 0.5 * timeBonus)) : 0;

    // Record the answer
    player.answers.push({
      questionIndex,
      answer,
      isCorrect,
      timeSpent,
      points
    });

    player.score += points;

    // Check if all players have answered
    const allPlayersAnswered = game.players.every((p: Player) =>
      p.answers.some((a: { questionIndex: number }) => a.questionIndex === questionIndex)
    );

    // Move to next question if all players have answered
    if (allPlayersAnswered) {
      if (game.currentQuestion + 1 < game.questions.length) {
        game.currentQuestion += 1;
        game.lastQuestionStartTime = new Date();
      } else {
        game.status = 'completed';
        game.endTime = new Date();
      }
    }

    await game.save();

    return NextResponse.json({
      message: 'Answer submitted successfully',
      isCorrect,
      points,
      timeSpent,
      nextQuestion: game.currentQuestion
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
} 