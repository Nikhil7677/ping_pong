import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [ballPosition, setBallPosition] = useState({ x: 300, y: 200 });
  const [ballSpeed, setBallSpeed] = useState({ speedX: 5, speedY: 5 });
  const [leftPaddle, setLeftPaddle] = useState(150);
  const [rightPaddle, setRightPaddle] = useState(150);
  const [gameRunning, setGameRunning] = useState(false);

  const ballRef = useRef(null);

  // Simple game loop with intervals to update ball position
  useEffect(() => {
    if (gameRunning) {
      const gameInterval = setInterval(() => {
        // Update ball position
        setBallPosition(prevBall => ({
          x: prevBall.x + ballSpeed.speedX,
          y: prevBall.y + ballSpeed.speedY
        }));

        // Ball collision with top/bottom walls
        if (ballPosition.y <= 0 || ballPosition.y >= 380) {
          setBallSpeed(prevSpeed => ({ ...prevSpeed, speedY: -prevSpeed.speedY }));
        }

        // Ball collision with paddles
        if (
          (ballPosition.x <= 10 && ballPosition.y >= leftPaddle && ballPosition.y <= leftPaddle + 80) || // Left Paddle
          (ballPosition.x >= 570 && ballPosition.y >= rightPaddle && ballPosition.y <= rightPaddle + 80) // Right Paddle
        ) {
          setBallSpeed(prevSpeed => ({ ...prevSpeed, speedX: -prevSpeed.speedX }));
        }

        // Ball goes out of bounds
        if (ballPosition.x <= 0 || ballPosition.x >= 600) {
          setGameRunning(false);
          clearInterval(gameInterval);
        }
      }, 50);

      return () => clearInterval(gameInterval);
    }
  }, [gameRunning, ballPosition, ballSpeed, leftPaddle, rightPaddle]);

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp' && rightPaddle > 0) {
      setRightPaddle(rightPaddle - 10); // Move right paddle up
    } else if (e.key === 'ArrowDown' && rightPaddle < 320) {
      setRightPaddle(rightPaddle + 10); // Move right paddle down
    } else if (e.key === 'w' && leftPaddle > 0) {
      setLeftPaddle(leftPaddle - 10); // Move left paddle up
    } else if (e.key === 's' && leftPaddle < 320) {
      setLeftPaddle(leftPaddle + 10); // Move left paddle down
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [leftPaddle, rightPaddle]);

  const startGame = () => {
    setGameRunning(true);
    setBallPosition({ x: 300, y: 200 });
    setBallSpeed({ speedX: 5, speedY: 5 });
  };

  const restartGame = () => {
    setBallPosition({ x: 300, y: 200 });
    setLeftPaddle(150);
    setRightPaddle(150);
    setGameRunning(false);
  };

  return (
    <div className="ping-pong-container">
      <div className="paddle" style={{ top: `${leftPaddle}px` }} />
      <div className="paddle" style={{ top: `${rightPaddle}px`, left: '580px' }} />
      <div
        className="ball"
        ref={ballRef}
        style={{ top: `${ballPosition.y}px`, left: `${ballPosition.x}px` }}
      />
      <div className="controls">
        {!gameRunning ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <button onClick={restartGame}>Restart Game</button>
        )}
      </div>
    </div>
  );
};

export default App;
