'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, PenTool, Brain, Braces, Amphora, Link } from "lucide-react";

function Modal() {
  const router = useRouter();
  const [questionNum, setQuestionNum] = useState(1);
  const [active, setActive] = useState(null);

  const categories = [
    {name: "History", logo: Amphora, color: "#E6C642"},
    {name: "Art", logo: PenTool, color: "#307DE7"},
    {name: "Science", logo: Brain, color: "#E857ED"},
    {name: "Programming", logo: Braces, color: "#56CFEF"}
]

  return (
    <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center">
      <div style={{backgroundImage: 'url("/bg-gamemodes.svg")'}} className="relative p-6 border w-96 shadow-lg rounded-md">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Quiz Settings</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-lg text-gray-500">Questions</p>

            <div className="flex flex-row justify-evenly">
              <input 
                type="range"
                min={0}
                max={10}
                step={1}
                value={questionNum}
                onChange={(event) => {
                  setQuestionNum(event.target.valueAsNumber);
                }}
              />

              <p className="text-gray-900">{questionNum}</p>
            </div>

          <p className="text-lg mt-5 text-gray-500">Categories</p>
          
          <div className="flex flex-row justify-between">
            {categories.map((cat) => (
              <div key={cat.name}>
                <button title={cat.name} onClick={() => setActive(cat.name)} className={`cursor-pointer p-2.5 rounded-md`} style={{backgroundColor: active === cat.name ? cat.color : "transparent"}}>
                  <cat.logo className="w-10 h-10 " color= {active === cat.name ? "white" : cat.color}/>
                </button>
              </div>
            ))}


          </div>
          </div>

          <div>
            <button className="text-amber-50 bg-blue-500 p-3 rounded-md  hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
            <a href="/solo">
              New Game
            </a>
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={router.back}
              className="absolute top-0 right-0 px-4 py-2 bg-transparent text-blue-500 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <X />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;