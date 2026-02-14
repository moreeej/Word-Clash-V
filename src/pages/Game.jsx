import React, { useState, useEffect } from "react";
import "../styles/Game.css";

const WORD = "HELLO";
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

export default function Game() {
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const handleKeyPress = (e) => {
    if (gameOver) return;

    if (e.key === "Enter") {
      submitGuess();
    } else if (e.key === "Backspace") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[a-zA-Z]$/.test(e.key)) {
      setCurrentGuess(currentGuess + e.key.toUpperCase());
    }
  };

  const submitGuess = () => {
    if (currentGuess.length !== WORD_LENGTH) return;
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === WORD) {
      setGameOver(true);
      setMessage("You win! 🎉");
    } else if (newGuesses.length === MAX_GUESSES) {
      setGameOver(true);
      setMessage(`Game over! The word was ${WORD}`);
    }
  };

  const handleKeyboardClick = (key) => {
    if (gameOver) return;
    if (key === "BACKSPACE") {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key) && !currentGuess.includes(key)) {
      setCurrentGuess(currentGuess + key);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentGuess, guesses, gameOver]);

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
            status = "present"; // Set to present if not already correct
          } else {
            if (!status) status = "absent"; // Set to absent only if not present/correct
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

  return (
    <div className="main-container">
      <div className="game">
        <h2>Word Clash: Guess the Word "HELLO"</h2>
        <div className="board">
          {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => (
            <div key={rowIndex} className="row">
              {Array.from({ length: WORD_LENGTH }, (_, colIndex) => {
                const letter =
                  guesses[rowIndex]?.[colIndex] ||
                  (rowIndex === guesses.length ? currentGuess[colIndex] : "");
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
        </div>

        <div className="enter-container">
          <button
            className="enter-button"
            onClick={submitGuess}
            disabled={currentGuess.length !== WORD_LENGTH}
          >
            Enter
          </button>
        </div>

        {message && <p className="message">{message}</p>}
        <div className="keyboard">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="keyboard-row">
              {row.map((key) => {
                const status = /^[A-Z]$/.test(key)
                  ? getKeyboardStatus(key)
                  : "";
                const isUsedInCurrent = currentGuess.includes(key) && /^[A-Z]$/.test(key);
                return (
                  <button
                    key={key}
                    className={`key ${status} ${key === "BACKSPACE" ? "special" : ""} ${isUsedInCurrent ? "used" : ""}`}
                    onClick={() => handleKeyboardClick(key)}
                    disabled={isUsedInCurrent}
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