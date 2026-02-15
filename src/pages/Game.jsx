import React, { useState, useEffect } from "react";
import "../styles/Game.css";
import emailjs from "@emailjs/browser";

const WORD = "HEART";
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const MAX_QUESTION_GUESSES = 5;
const QUESTION_WORD = "YES";
const QUESTION_LENGTH = 3;

export default function Game() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [giveUp, setGiveUp] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionGuesses, setQuestionGuesses] = useState([]);
  const [currentQuestionGuess, setCurrentQuestionGuess] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Initialize EmailJS with your public key
  useEffect(() => {
    emailjs.init("Cz9wbDaYZfnArjUBy");
  }, []);

  const handleKeyPress = (e) => {
    if (showQuestion && !questionSubmitted) {
      if (e.key === "Enter") {
        submitQuestion();
      } else if (e.key === "Backspace") {
        setCurrentQuestionGuess(currentQuestionGuess.slice(0, -1));
      } else if (
        currentQuestionGuess.length < QUESTION_LENGTH &&
        /^[a-zA-Z]$/.test(e.key)
      ) {
        setCurrentQuestionGuess(currentQuestionGuess + e.key.toUpperCase());
      }
    } else if (!gameOver && !giveUp) {
      if (e.key === "Enter") {
        submitGuess();
      } else if (e.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (
        currentGuess.length < WORD_LENGTH &&
        /^[a-zA-Z]$/.test(e.key)
      ) {
        setCurrentGuess(currentGuess + e.key.toUpperCase());
      }
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
      setMessage("Will you be my valentines?");
    }
  };

  const submitQuestion = () => {
    if (currentQuestionGuess.length !== QUESTION_LENGTH) return;
    const newQuestionGuesses = [...questionGuesses, currentQuestionGuess];
    setQuestionGuesses(newQuestionGuesses);
    setCurrentQuestionGuess("");

    if (currentQuestionGuess === QUESTION_WORD) {
      setQuestionSubmitted(true);
      setMessage("Yes! Happy Valentine's Day! ❤️<br />check your email babyyyy");
      // Send email after YES
      sendEmail();
    } else if (newQuestionGuesses.length === MAX_QUESTION_GUESSES) {
      setQuestionSubmitted(true);
      setMessage("Aww, maybe next time?");
    }
  };

  const sendEmail = () => {
    emailjs.send("service_a5uzilt", "template_zc8fnsb", {
      name: "Dale",
    }).then(
      (result) => {
        console.log("Email sent successfully:", result.text);
      },
      (error) => {
        console.error("Email send failed:", error.text);
      }
    );
  };

  const handleKeyboardClick = (key) => {
    if (showQuestion && !questionSubmitted) {
      if (key === "BACKSPACE") {
        setCurrentQuestionGuess(currentQuestionGuess.slice(0, -1));
      } else if (
        currentQuestionGuess.length < QUESTION_LENGTH &&
        /^[A-Z]$/.test(key)
      ) {
        setCurrentQuestionGuess(currentQuestionGuess + key);
      }
    } else if (!gameOver && !giveUp) {
      if (key === "BACKSPACE") {
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
        setCurrentGuess(currentGuess + key);
      }
    }
  };

  const tryAgain = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
    setGiveUp(false);
    setShowQuestion(false);
    setQuestionGuesses([]);
    setCurrentQuestionGuess("");
    setQuestionSubmitted(false);
  };

  const giveUpHandler = () => {
    setGiveUp(true);
    setMessage("Will you be my valentines?");
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentGuess,
    guesses,
    gameOver,
    giveUp,
    showQuestion,
    questionGuesses,
    currentQuestionGuess,
    questionSubmitted,
  ]);

  useEffect(() => {
    if (giveUp && !showQuestion) {
      const timer = setTimeout(() => {
        setShowQuestion(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [giveUp, showQuestion]);

  const getLetterStatus = (letter, index) => {
    if (WORD[index] === letter) return "correct";
    if (WORD.includes(letter)) return "present";
    return "absent";
  };

  // Determine keyboard letter status based on all guesses
  const getKeyboardStatus = (letter) => {
    let status = "";
    for (let guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          if (WORD[i] === letter) {
            return "correct"; // Prioritize correct
          } else if (WORD.includes(letter)) {
            status = "present"; // Set
          } else {
            if (!status) status = "absent";
          }
        }
      }
    }
    return status;
  };

  const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  // Function to get status for question keyboard
  const getQuestionKeyboardStatus = (key) => {
    if (key === "Y" || key === "E" || key === "S") return "present";
    if (key === "N" || key === "O") return "absent";
    return "";
  };

  const revealRows = ["Will", "you", "be", "my", "valentines"];

  return (
    <div className="main-container">
      <div className="game">
        <h2 className="header">{showQuestion ? message : "Guess The Word"}</h2>
        <div className="board">
          {showQuestion ? (
            <>
              {Array.from({ length: MAX_QUESTION_GUESSES }, (_, rowIndex) => (
                <div key={rowIndex} className="row">
                  {Array.from({ length: QUESTION_LENGTH }, (_, colIndex) => {
                    const letter =
                      questionGuesses[rowIndex]?.[colIndex] ||
                      (rowIndex === questionGuesses.length
                        ? currentQuestionGuess[colIndex]
                        : "");
                    const status = questionGuesses[rowIndex]
                      ? letter === QUESTION_WORD[colIndex]
                        ? "correct"
                        : "absent"
                      : "";
                    return (
                      <div key={colIndex} className={`tile ${status}`}>
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          ) : giveUp ? (
            revealRows.map((word, rowIndex) => (
              <div key={rowIndex} className="reveal-container">
                {word.split("").map((letter, colIndex) => (
                  <div
                    key={colIndex}
                    className="tile per-tile flip"
                    style={{
                      animationDelay: `${(rowIndex * word.length + colIndex) * 0.1}s`,
                    }}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <>
              {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => (
                <div key={rowIndex} className="row">
                  {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                    const letter =
                      guesses[rowIndex]?.[colIndex] ||
                      (rowIndex === guesses.length
                        ? currentGuess[colIndex]
                        : "");
                    const status = guesses[rowIndex]
                      ? getLetterStatus(letter, colIndex)
                      : "";
                    return (
                      <div key={colIndex} className={`tile ${status}`}>
                        {letter}
                      </div>
                    );
                  })}
                </div>
              ))}
            </>
          )}
        </div>

        {gameOver && !giveUp && (
          <div className="game-over-container">
            <button className="game-over-btn" onClick={tryAgain}>
              Try Again
            </button>
            <button className="game-over-btn" onClick={giveUpHandler}>
              Give Up
            </button>
          </div>
        )}

        {!gameOver && !giveUp && !showQuestion && (
          <div className="enter-container">
            <button
              className="enter-button"
              onClick={submitGuess}
              disabled={currentGuess.length !== WORD_LENGTH}
            >
              Enter
            </button>
          </div>
        )}

        {showQuestion && !questionSubmitted && (
          <div className="enter-container">
            <button
              className="enter-button"
              onClick={submitQuestion}
              disabled={currentQuestionGuess.length !== QUESTION_LENGTH}
            >
              Enter
            </button>
          </div>
        )}

        <div className="keyboard">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key) => {
                const status = showQuestion
                  ? getQuestionKeyboardStatus(key)
                  : /^[A-Z]$/.test(key)
                    ? getKeyboardStatus(key)
                    : "";
                return (
                  <button
                    key={key}
                    className={`key ${status} ${key === "BACKSPACE" ? "special" : ""}`}
                    onClick={() => handleKeyboardClick(key)}
                  >
                    {key === "BACKSPACE" ? "⌫" : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}