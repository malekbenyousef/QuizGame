import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db/mongodb';
import { Game } from '@/lib/models/Game';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - User email required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questions, timePerQuestion } = body;

    console.log('Creating game with:', { 
      userEmail: session.user.email,
      questionCount: questions?.length,
      timePerQuestion 
    });

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions are required and must be an array' },
        { status: 400 }
      );
    }

    await connectDB();

    const gameId = nanoid(6).toUpperCase();

    // Add initial host as first player
    const game = await Game.create({
      gameId,
      host: session.user.email,
      questions: questions.map(q => ({
        ...q,
        points: 10 // Default points per question
      })),
      settings: {
        timePerQuestion: timePerQuestion || 10,
        showLeaderboard: true
      },
      status: 'waiting',
      players: [{
        userId: session.user.email,
        username: session.user.name || 'Host',
        score: 0,
        answers: []
      }],
      currentQuestion: 0,
      startTime: null
    });

    console.log('Game created successfully:', { gameId: game.gameId });

    return NextResponse.json({
      gameId: game.gameId,
      message: 'Game created successfully'
    });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create game' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - User email required' },
        { status: 401 }
      );
    }

    await connectDB();

    const games = await Game.find({
      $or: [
        { host: session.user.email },
        { 'players.userId': session.user.email }
      ],
      status: { $ne: 'completed' }
    }).sort({ createdAt: -1 });

    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch games' },
      { status: 500 }
    );
  }
} 