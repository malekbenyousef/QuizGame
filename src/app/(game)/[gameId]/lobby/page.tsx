'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

interface Player {
  userId: string;
  username: string;
  score: number;
}

interface Game {
  gameId: string;
  host: string;
  players: Player[];
  status: string;
}

export default function GameLobbyPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchGame = async () => {
      try {
        console.log('Fetching game:', params.gameId);
        const response = await fetch(`/api/games/${params.gameId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load game');
        }
        
        console.log('Game data:', data);
        setGame(data);

        // If game has started, redirect to play page
        if (data.status === 'in-progress') {
          router.push(`/game/${params.gameId}/play`);
        }
      } catch (error) {
        console.error('Error fetching game:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load game');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();

    // Poll for game updates
    const interval = setInterval(fetchGame, 3000);
    return () => clearInterval(interval);
  }, [params.gameId, session, sessionStatus, router]);

  const startGame = async () => {
    if (!game || !session?.user?.email) return;

    try {
      console.log('Starting game:', game.gameId);
      const response = await fetch(`/api/games/${params.gameId}/start`, {
        method: 'POST',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start game');
      }

      console.log('Game started successfully');
      router.push(`/game/${params.gameId}/play`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start game');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Game not found</p>
      </div>
    );
  }

  const isHost = game.host === session?.user?.email;
  // Create a direct URL that works with phone cameras
  const gameUrl = `${process.env.NEXT_PUBLIC_HOST || window.location.origin}/join/${game.gameId}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Game Lobby</h1>
            <p className="mt-2 text-gray-600">Game ID: {game.gameId}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Players ({game.players.length})</h2>
              <div className="space-y-2">
                {game.players.map((player) => (
                  <div
                    key={player.userId}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <span className="font-medium">
                      {player.username}
                      {player.userId === game.host && (
                        <span className="ml-2 text-sm text-indigo-600">(Host)</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="mb-4">
                <QRCodeSVG value={gameUrl} size={200} />
              </div>
              <p className="text-sm text-gray-500 mb-2">Scan with your phone camera to join</p>
              <p className="text-sm font-medium mb-4">or share the Game ID: {game.gameId}</p>
              
              {isHost && (
                <button
                  onClick={startGame}
                  disabled={game.players.length < 2}
                  className={`w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    game.players.length < 2
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {game.players.length < 2 ? 'Need at least 2 players' : 'Start Game'}
                </button>
              )}
              
              {!isHost && (
                <p className="text-sm text-gray-500">
                  Waiting for host to start the game...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 