import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Lobby from './components/Lobby';
import GameInterface from './components/GameInterface';
import Results from './components/Results';
import './styles/App.css';

const socket = io('http://localhost:3001', {
  transports: ['websocket'],
  autoConnect: false
});

// Rendre le socket accessible globalement pour GameInterface
window.socket = socket;

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, results
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [role, setRole] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameData, setGameData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [results, setResults] = useState(null);
  const [victory, setVictory] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('biostat');
  const [completedTurns, setCompletedTurns] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on('roleAssigned', ({ role, gameData }) => {
      setRole(role);
      setGameData(gameData);
    });

    socket.on('playersUpdate', ({ players, currentTurn }) => {
      setPlayers(players);
      if (currentTurn) setCurrentTurn(currentTurn);
    });

    socket.on('gameStarted', ({ duration, currentTurn }) => {
      setTimeRemaining(duration);
      setCurrentTurn(currentTurn);
      setGameState('playing');
    });

    socket.on('nextTurn', ({ currentTurn, completedRole }) => {
      setCurrentTurn(currentTurn);
      setCompletedTurns(prev => [...prev, completedRole]);
    });

    socket.on('allTurnsComplete', ({ results }) => {
      setCurrentTurn('finalCode');
      setResults(results);
    });

    socket.on('timerUpdate', ({ remaining }) => {
      setTimeRemaining(remaining);
    });

    socket.on('resultSubmitted', ({ role, result }) => {
      console.log('Résultat reçu:', role, result);
    });

    socket.on('gameEnded', ({ victory, results, correctCode, submittedCode }) => {
      setVictory(victory || false);
      setResults({ ...results, correctCode, submittedCode });
      setGameState('results');
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoinGame = (name, code) => {
    setPlayerName(name);
    setRoomCode(code);
    socket.emit('joinGame', { roomCode: code, playerName: name });
  };

  const handleReady = () => {
    socket.emit('playerReady', { roomCode });
  };

  const handleSubmitResult = (result) => {
    socket.emit('submitResult', { roomCode, role, result });
  };

  const handleSubmitFinalCode = (code) => {
    socket.emit('submitFinalCode', { roomCode, code });
  };

  return (
    <div className="app">
      {gameState === 'lobby' && (
        <Lobby
          onJoinGame={handleJoinGame}
          players={players}
          role={role}
          onReady={handleReady}
        />
      )}

      {gameState === 'playing' && (
        <GameInterface
          role={role}
          gameData={gameData}
          timeRemaining={timeRemaining}
          currentTurn={currentTurn}
          completedTurns={completedTurns}
          onSubmitResult={handleSubmitResult}
          onSubmitFinalCode={handleSubmitFinalCode}
        />
      )}

      {gameState === 'results' && (
        <Results
          victory={victory}
          results={results}
          role={role}
        />
      )}
    </div>
  );
}

export default App;

