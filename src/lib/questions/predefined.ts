interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CategoryQuestions {
  [key: string]: Question[];
}

export const predefinedQuestions: CategoryQuestions = {
  "Computer Science": [
    {
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Utility"],
      correctAnswer: 0
    },
    {
      question: "Which data structure operates on a LIFO principle?",
      options: ["Queue", "Stack", "Array", "Tree"],
      correctAnswer: 1
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(n²)", "O(log n)", "O(1)"],
      correctAnswer: 2
    },
    {
      question: "Which programming paradigm treats computation as the evaluation of mathematical functions?",
      options: ["Object-Oriented", "Procedural", "Functional", "Imperative"],
      correctAnswer: 2
    },
    {
      question: "What is the purpose of HTTP status code 404?",
      options: ["Server Error", "Not Found", "Forbidden", "Bad Request"],
      correctAnswer: 1
    },
    {
      question: "Which of these is not a JavaScript data type?",
      options: ["String", "Boolean", "Integer", "Undefined"],
      correctAnswer: 2
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Language"],
      correctAnswer: 0
    },
    {
      question: "Which protocol is used for secure data transmission over the web?",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
      correctAnswer: 2
    },
    {
      question: "What is the primary function of an operating system?",
      options: ["Run applications", "Manage hardware and software resources", "Create documents", "Browse the internet"],
      correctAnswer: 1
    },
    {
      question: "Which sorting algorithm has the worst case time complexity of O(n log n)?",
      options: ["Bubble Sort", "Merge Sort", "Selection Sort", "Insertion Sort"],
      correctAnswer: 1
    }
  ],
  "Sports": [
    {
      question: "Which country won the FIFA World Cup 2022?",
      options: ["Brazil", "France", "Argentina", "Germany"],
      correctAnswer: 2
    },
    {
      question: "In which sport would you perform a slam dunk?",
      options: ["Volleyball", "Basketball", "Tennis", "Football"],
      correctAnswer: 1
    },
    {
      question: "How many players are there in a standard cricket team?",
      options: ["9", "10", "11", "12"],
      correctAnswer: 2
    },
    {
      question: "Which Grand Slam tennis tournament is played on grass?",
      options: ["US Open", "French Open", "Australian Open", "Wimbledon"],
      correctAnswer: 3
    },
    {
      question: "In which sport would you use a shuttlecock?",
      options: ["Table Tennis", "Badminton", "Tennis", "Squash"],
      correctAnswer: 1
    },
    {
      question: "How long is a marathon in kilometers?",
      options: ["40.2 km", "42.2 km", "38.2 km", "44.2 km"],
      correctAnswer: 1
    },
    {
      question: "Which country invented volleyball?",
      options: ["Brazil", "United States", "China", "Russia"],
      correctAnswer: 1
    },
    {
      question: "In Olympic swimming, what is the longest distance for freestyle?",
      options: ["800m", "1000m", "1500m", "2000m"],
      correctAnswer: 2
    },
    {
      question: "How many points is a touchdown worth in American football?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 2
    },
    {
      question: "Which sport is known as 'the beautiful game'?",
      options: ["Cricket", "Football", "Rugby", "Basketball"],
      correctAnswer: 1
    }
  ]
}; 