'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function DirectJoinPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const gameId = params.gameId as string;

  useEffect(() => {
    const joinGame = async () => {
      try {
        const response = await fetch(`/api/games/${gameId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to join game');
        }

        toast.success('Joined game successfully!');
        router.push(`/game/${gameId}/lobby`);
      } catch (error: any) {
        toast.error(error.message || 'Failed to join game');
        router.push('/join');
      }
    };

    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      // Store game ID and redirect to login
      sessionStorage.setItem('pendingGameId', gameId);
      router.push('/register');
      return;
    }

    if (status === 'authenticated') {
      joinGame();
    }
  }, [gameId, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Joining Game...
          </h2>
          <p className="text-gray-600">
            {status === 'loading' && 'Loading...'}
            {status === 'unauthenticated' && 'Redirecting to login...'}
            {status === 'authenticated' && 'Connecting you to the game...'}
          </p>
        </div>
      </div>
    </div>
  );
} 