'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Html5QrcodeScanner: typeof Html5QrcodeScanner;
  }
}

export default function ScanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isScanning, setIsScanning] = useState(true);
  const [scannedGameId, setScannedGameId] = useState<string | null>(null);

  // Check for gameId in URL parameters
  useEffect(() => {
    const gameId = searchParams.get('gameId');
    if (gameId) {
      setScannedGameId(gameId);
      setIsScanning(false);
    }
  }, [searchParams]);

  // Handle automatic game joining after login
  useEffect(() => {
    const joinGame = async (gameId: string) => {
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

    // If we have both a session and a scanned game ID, try to join
    if (status === 'authenticated' && scannedGameId) {
      joinGame(scannedGameId);
    } else if (status === 'unauthenticated' && scannedGameId) {
      // Store game ID in sessionStorage for after login
      sessionStorage.setItem('pendingGameId', scannedGameId);
      signIn();
    }
  }, [status, scannedGameId, router]);

  // Initialize QR scanner
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
        
        setScannedGameId(gameId);
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {scannedGameId ? 'Joining Game...' : 'Scan QR Code'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {scannedGameId 
              ? 'Please wait while we connect you to the game'
              : 'Point your camera at a game QR code to join'}
          </p>
        </div>

        {isScanning && (
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <div id="qr-reader" className="w-full"></div>
              
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => router.push('/join')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Enter Game ID Manually
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 