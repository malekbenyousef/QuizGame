'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

// Add type declaration for Html5QrcodeScanner
declare global {
  interface Window {
    Html5QrcodeScanner: typeof Html5QrcodeScanner;
  }
}

export default function JoinGamePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [gameId, setGameId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: 250 },
        /* verbose= */ false
      );

      scanner.render((decodedText: string) => {
        // Extract game ID from URL or use the decoded text directly
        const gameId = decodedText.includes('/join/') 
          ? decodedText.split('/join/')[1]
          : decodedText;
        
        setGameId(gameId);
        setIsScanning(false);
        scanner?.clear();
      }, (errorMessage: string) => {
        console.error(errorMessage);
      });
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isScanning]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login first');
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Please login to join a game</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join a Game
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter the game ID or scan a QR code to join
          </p>
        </div>

        <div className="mt-8">
          {isScanning ? (
            <div className="space-y-4">
              <div id="qr-reader" className="w-full"></div>
              <button
                onClick={() => setIsScanning(false)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel Scanning
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="gameId" className="sr-only">
                  Game ID
                </label>
                <input
                  id="gameId"
                  name="gameId"
                  type="text"
                  required
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value.toUpperCase())}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter Game ID"
                />
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Joining...' : 'Join Game'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsScanning(true)}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Scan QR Code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 