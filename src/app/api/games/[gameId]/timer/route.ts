import { NextResponse } from 'next/server';
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

export async function GET(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    await connectDB();

    const game = await Game.findOne({ gameId: params.gameId });

    if (!game || game.status !== 'in-progress') {
      return NextResponse.json({
        status: game?.status || 'not-found',
        currentQuestion: game?.currentQuestion || 0
      });
    }

    const currentTime = new Date();
    
    // Initialize lastQuestionStartTime if not set
    if (!game.lastQuestionStartTime) {
      game.lastQuestionStartTime = game.startTime;
      await game.save();
    }

    const questionStartTime = new Date(game.lastQuestionStartTime);
    const timePerQuestion = game.settings.timePerQuestion * 1000; // Convert to milliseconds
    const elapsedTime = currentTime.getTime() - questionStartTime.getTime();

    // Check if time has expired for current question
    if (elapsedTime >= timePerQuestion) {
      // Process unanswered players for the current question
      const playersToUpdate = game.players.filter((p: Player) => 
        !p.answers.some((a: { questionIndex: number }) => a.questionIndex === game.currentQuestion)
      );

      // Record timeout answers for players who haven't answered
      for (const player of playersToUpdate) {
        player.answers.push({
          questionIndex: game.currentQuestion,
          answer: -1, // Indicate timeout
          isCorrect: false,
          timeSpent: game.settings.timePerQuestion,
          points: 0
        });
      }

      // Move to next question or end game
      if (game.currentQuestion + 1 < game.questions.length) {
        game.currentQuestion += 1;
        game.lastQuestionStartTime = currentTime;
      } else {
        game.status = 'completed';
        game.endTime = currentTime;
      }

      await game.save();
    }

    // Calculate time remaining for current question
    const timeRemaining = Math.max(0, timePerQuestion - elapsedTime);

    return NextResponse.json({
      status: game.status,
      currentQuestion: game.currentQuestion,
      timeRemaining: Math.ceil(timeRemaining / 1000), // Convert to seconds
      totalQuestions: game.questions.length
    });
  } catch (error) {
    console.error('Error checking game timer:', error);
    return NextResponse.json(
      { error: 'Failed to check game timer' },
      { status: 500 }
    );
  }
} 