'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkTimer = useCallback(async () => {
    try {
      const response = await fetch(`/api/games/${params.gameId}/timer`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      if (data.status === 'completed') {
        router.push(`/game/${params.gameId}/results`);
        return;
      }

      setTimeLeft(data.timeRemaining);

      if (currentQuestionId !== data.currentQuestion) {
        setCurrentQuestionId(data.currentQuestion);
        setSelectedAnswer(null);
        fetchGame();
      }
    } catch (error) {
      console.error('Error checking timer:', error);
    }
  }, [currentQuestionId, params.gameId, router]);

  const fetchGame = useCallback(async () => {
    try {
      const response = await fetch(`/api/games/${params.gameId}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);
      
      setGame(data);
      setCurrentQuestionId(data.currentQuestion);

      if (data.status === 'waiting') {
        router.push(`/game/${params.gameId}/lobby`);
        return;
      }
      if (data.status === 'completed') {
        router.push(`/game/${params.gameId}/results`);
        return;
      }

      const currentPlayer = data.players.find(p => p.userId === session?.user?.email);
      if (currentPlayer) {
        const currentAnswer = currentPlayer.answers.find(
          a => a.questionIndex === data.currentQuestion
        );
        setSelectedAnswer(currentAnswer?.answer ?? null);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch game');
      router.push('/lobby');
    } finally {
      setIsLoading(false);
    }
  }, [params.gameId, router, session?.user?.email]);

  useEffect(() => {
    if (session) {
      fetchGame();
      const timerInterval = setInterval(checkTimer, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [session, fetchGame, checkTimer]);

  const submitAnswer = async (answerIndex) => {
    if (!game || selectedAnswer !== null || isSubmitting) return;

    setIsSubmitting(true);
    setSelectedAnswer(answerIndex);

    try {
      const response = await fetch(`/api/games/${params.gameId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIndex: game.currentQuestion,
          answer: answerIndex,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      if (data.isCorrect) {
        toast.success(`Correct! +${data.points} points`);
      } else {
        toast.error('Incorrect answer');
      }

      await fetchGame();
    } catch (error) {
      toast.error(error.message || 'Failed to submit answer');
      setSelectedAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const currentQuestion = game.questions[game.currentQuestion];
  const hasAnswered = selectedAnswer !== null;
  const allPlayersAnswered = game.players.every(player => 
    player.answers.some(answer => answer.questionIndex === game.currentQuestion)
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Question {game.currentQuestion + 1} of {game.questions.length}
              </h3>
              <div className="text-sm font-medium text-gray-500">
                Time left: {timeLeft}s
              </div>
            </div>

            <div className="relative">
              <div className="space-y-4">
                <h4 className="text-xl font-medium text-gray-900 mb-4">
                  {currentQuestion.question}
                </h4>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => submitAnswer(index)}
                      disabled={hasAnswered || isSubmitting}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        selectedAnswer === index
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300 hover:border-indigo-500'
                      } ${(hasAnswered || isSubmitting) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {hasAnswered && !allPlayersAnswered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                      <div className="mt-4 text-lg font-medium text-gray-900">
                        Waiting for other players...
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {allPlayersAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-4"
                >
                  <h4 className="text-xl font-medium text-gray-900 mb-4">
                    Current Standings
                  </h4>

                  <div className="space-y-3">
                    {[...game.players]
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <motion.div
                          key={player.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <span className="text-lg font-medium mr-3">
                              #{index + 1}
                            </span>
                            <span>{player.username}</span>
                          </div>
                          <span className="font-medium">{player.score} pts</span>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 