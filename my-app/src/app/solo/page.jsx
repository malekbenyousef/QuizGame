"use client"

import { act, useState } from "react";

export default function SinglePLayer() {
    const testQuizData = [
        {
          question: "What is the effect of the `will-change` CSS property?",
          options: [
            "Forces the element to render in a separate layer",
            "Prevents DOM repainting",
            "Changes the element’s stacking context",
            "Disables hardware acceleration"
          ],
          answer: 0
        },
        {
          question: "In HTML5, which tag is used to declare a set of fallback content when `<object>` fails to load?",
          options: [
            "<fallback>",
            "<backup>",
            "<noframe>",
            "<embed>"
          ],
          answer: 3
        },
        {
          question: "What will `console.log(0.1 + 0.2 === 0.3)` output in JavaScript?",
          options: [
            "true",
            "false",
            "undefined",
            "Throws TypeError"
          ],
          answer: 1
        },
        {
          question: "Which of the following CSS pseudo-classes targets an element that is the only child of its parent?",
          options: [
            ":nth-child(1)",
            ":only-child",
            ":first-of-type",
            ":single-child"
          ],
          answer: 1
        },
        {
          question: "What does the `defer` attribute on a `<script>` tag do?",
          options: [
            "Prevents script execution altogether",
            "Loads the script asynchronously and executes it immediately",
            "Loads script in order and delays execution until HTML parsing is complete",
            "Loads and executes script before the DOM is ready"
          ],
          answer: 2
        },
        {
          question: "In CSS Grid, what does `grid-auto-flow: dense;` do?",
          options: [
            "Automatically stretches items",
            "Places items as far apart as possible",
            "Fills holes in the grid layout",
            "Hides overflowing grid items"
          ],
          answer: 2
        },
        {
          question: "What is returned by `typeof NaN` in JavaScript?",
          options: [
            "number",
            "NaN",
            "undefined",
            "object"
          ],
          answer: 0
        }
    ];

    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    return(
    <div className="flex flex-col justify-center items-center h-screen before:bg-[url('/bg-join.jpg')] before:bg-no-repeat before:bg-cover before:content=[''] before:absolute before:inset-0 before:opacity-30">
        <div className="isolate bg-fuchsia-900 p-6 rounded-md">
          <h3 className="font-bold text-2xl">{activeQuestion + 1}. {testQuizData[activeQuestion].question}</h3>
          <div className="flex flex-col justify-start flex-wrap items-baseline m-2">
            {testQuizData[activeQuestion].options.map((opt, i) => (
              <button key={i} onClick={() => setSelectedAnswer(i)} style={selectedAnswer === i ? {backgroundColor: "white", color: "black"} : {}} className="text-left p-1.5 rounded-md">{opt}</button>
            ))}
          </div>

          <button onClick={() => {setActiveQuestion(activeQuestion => activeQuestion + 1), setSelectedAnswer(null)}} className="p-2.5 bg-white text-amber-500" >Next</button>
        </div>
    </div>
    );
}