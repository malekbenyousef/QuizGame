'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, PenTool, Brain, Braces, Amphora } from "lucide-react";

function Modal() {
  const router = useRouter();
  const [questionNum, setQuestionNum] = useState(1);
  const [active, setActive] = useState(null);

  const handleStartGame = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // ✅ Sends session cookie to backend
        body: JSON.stringify({

            
          gameConfig: {
            categories: active ? [active] : [], // ✅ Use selected category
            numQuestions: questionNum,
            timeLimit: 10, // hardcoded for now
          }
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Game started:", data);
        router.push(`/lobby`); // ✅ Redirect to game page
      } else {
        alert("Error starting game: " + data.error);
      }
    } catch (err) {
      console.error("Start game error:", err);
      alert("Failed to start game.");
    }
  };

  const categories = [
    { name: "History", logo: Amphora, color: "#E6C642" },
    { name: "Art", logo: PenTool, color: "#307DE7" },
    { name: "Science", logo: Brain, color: "#E857ED" },
    { name: "Programming", logo: Braces, color: "#56CFEF" }
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center">
      <div style={{ backgroundImage: 'url("/bg-gamemodes.svg")' }} className="relative p-6 border w-96 shadow-lg rounded-md">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Quiz Settings</h3>

          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Questions</p>
            <div className="flex flex-row justify-evenly items-center">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={questionNum}
                onChange={(e) => setQuestionNum(e.target.valueAsNumber)}
              />
              <p className="text-gray-900">{questionNum}</p>
            </div>

            <p className="text-lg mt-5 text-gray-500">Categories</p>
            <div className="flex flex-row justify-between">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  title={cat.name}
                  onClick={() => setActive(cat.name)}
                  className="cursor-pointer p-2.5 rounded-md"
                  style={{ backgroundColor: active === cat.name ? cat.color : "transparent" }}
                >
                  <cat.logo className="w-10 h-10" color={active === cat.name ? "white" : cat.color} />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="mt-4 text-amber-50 bg-blue-500 p-3 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            New Game
          </button>

          <button
            onClick={router.back}
            className="absolute top-0 right-0 px-4 py-2 bg-transparent text-blue-500 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <X />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
