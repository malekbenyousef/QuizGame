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
    timeSpent: number;
  }>;
}

interface SessionUser {
  email: string;
  name: string;
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = session.user as SessionUser;

    await connectDB();

    const game = await Game.findOne({ gameId: params.gameId });
    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (game.status !== 'waiting') {
      return NextResponse.json(
        { error: 'Game has already started' },
        { status: 400 }
      );
    }

    // Check if player is already in the game
    const isPlayerInGame = game.players.some(
      (player: Player) => player.userId === user.email
    );

    if (isPlayerInGame) {
      return NextResponse.json(
        { error: 'You are already in this game' },
        { status: 400 }
      );
    }

    // Add player to game
    game.players.push({
      userId: user.email,
      username: user.name,
      score: 0,
      answers: []
    });

    await game.save();

    return NextResponse.json({
      message: 'Joined game successfully',
      game: {
        gameId: game.gameId,
        status: game.status,
        currentQuestion: game.currentQuestion,
        players: game.players
      }
    });
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json(
      { error: 'Failed to join game' },
      { status: 500 }
    );
  }
} 