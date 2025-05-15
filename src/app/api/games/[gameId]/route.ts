import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import { Game } from '@/lib/models/Game';

interface GamePlayer {
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

export async function GET(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - User email required' },
        { status: 401 }
      );
    }

    const userEmail = session.user.email;
    console.log('Fetching game:', { gameId: params.gameId });

    await connectDB();

    const game = await Game.findOne({ gameId: params.gameId });

    if (!game) {
      console.log('Game not found:', { gameId: params.gameId });
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Check if user is part of the game
    const isPlayerInGame = game.players.some(
      (player: GamePlayer) => player.userId === userEmail
    );
    const isHost = game.host === userEmail;

    if (!isPlayerInGame && !isHost) {
      console.log('User not authorized for game:', {
        gameId: params.gameId,
        userEmail
      });
      return NextResponse.json(
        { error: 'You are not part of this game' },
        { status: 403 }
      );
    }

    console.log('Game fetched successfully:', {
      gameId: game.gameId,
      status: game.status,
      playerCount: game.players.length
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session?.user?.name) {
      return NextResponse.json(
        { error: 'Unauthorized - User information required' },
        { status: 401 }
      );
    }

    // Store user info after validation
    const userEmail = session.user.email;
    const userName = session.user.name;

    console.log('Joining game:', { 
      gameId: params.gameId,
      userEmail
    });

    await connectDB();

    const game = await Game.findOne({ gameId: params.gameId });

    if (!game) {
      console.log('Game not found:', { gameId: params.gameId });
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    if (game.status !== 'waiting') {
      console.log('Game already started:', { gameId: params.gameId });
      return NextResponse.json(
        { error: 'Game has already started' },
        { status: 400 }
      );
    }

    // Check if user is already in the game
    const isPlayerInGame = game.players.some(
      (player: GamePlayer) => player.userId === userEmail
    );

    if (isPlayerInGame) {
      console.log('Player already in game:', { 
        gameId: params.gameId,
        userEmail
      });
      return NextResponse.json(
        { error: 'You are already in this game' },
        { status: 400 }
      );
    }

    // Add player to game
    game.players.push({
      userId: userEmail,
      username: userName,
      score: 0,
      answers: []
    });

    await game.save();

    console.log('Player joined successfully:', {
      gameId: params.gameId,
      userEmail,
      playerCount: game.players.length
    });

    return NextResponse.json({
      message: 'Joined game successfully',
      game: {
        gameId: game.gameId,
        status: game.status,
        players: game.players
      }
    });
  } catch (error) {
    console.error('Error joining game:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to join game' },
      { status: 500 }
    );
  }
} 