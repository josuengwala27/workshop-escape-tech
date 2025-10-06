import React, { useState, useEffect } from 'react';
import BiostatRole from './roles/BiostatRole';
import LogisticsRole from './roles/LogisticsRole';
import HygieneRole from './roles/HygieneRole';
import Observer from './Observer';
import Timer from './Timer';
import '../styles/GameInterface.css';

function GameInterface({ role, gameData, timeRemaining, currentTurn, completedTurns, onSubmitResult, onSubmitFinalCode }) {
  const [myCoopCode, setMyCoopCode] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalCode, setFinalCode] = useState('');
  const [sharedData, setSharedData] = useState({});
  
  // Vérifier si c'est mon tour
  const isMyTurn = currentTurn === role;
  const allTurnsComplete = currentTurn === 'finalCode';

  // Écouter les résultats partagés des autres joueurs
  useEffect(() => {
    const socket = window.socket;
    if (!socket) return;

    socket.on('resultSubmitted', ({ role, result }) => {
      setSharedData(prev => ({ ...prev, [role]: result }));
    });
  }, []);

  const handleRoleComplete = (result) => {
    setMyCoopCode(result.coopCode);
    setIsCompleted(true);
    onSubmitResult(result);
  };

  const handleSubmitCode = () => {
    if (finalCode.length === 6) {
      onSubmitFinalCode(finalCode);
    }
  };

  const getRoleTitle = () => {
    const titles = {
      biostat: '📊 THERMO-SCAN : Analyse des lots',
      logistics: '🚚 FROID EXPRESS : Organisation de la livraison',
      hygiene: '🧤 HYGIÈNE : Protocole sanitaire'
    };
    return titles[role] || '';
  };

  return (
    <div className="game-interface">
      {isMyTurn && !isCompleted && (
        <div className="turn-notification">
          <div className="notification-content">
            <span className="notification-icon">🎯</span>
            <span className="notification-text">C'est votre tour ! Accomplissez votre mission.</span>
          </div>
        </div>
      )}

      <div className="game-header">
        <div className="header-left">
          <h1>{getRoleTitle()}</h1>
        </div>
        <Timer timeRemaining={timeRemaining} />
      </div>

      <div className="game-content">
        {!isMyTurn && !allTurnsComplete ? (
          <Observer 
            currentTurn={currentTurn} 
            myRole={role}
            completedTurns={completedTurns}
          />
        ) : (
          <>
            {role === 'biostat' && isMyTurn && (
              <BiostatRole
                data={gameData.biostat}
                onComplete={handleRoleComplete}
                isCompleted={isCompleted}
              />
            )}

            {role === 'logistics' && isMyTurn && (
              <LogisticsRole
                data={gameData.logistics}
                onComplete={handleRoleComplete}
                isCompleted={isCompleted}
                selectedLot={sharedData.biostat?.selectedLot}
              />
            )}

            {role === 'hygiene' && isMyTurn && (
              <HygieneRole
                data={gameData.hygiene}
                onComplete={handleRoleComplete}
                isCompleted={isCompleted}
              />
            )}
          </>
        )}
      </div>

      {isCompleted && (
        <div className="turn-complete-banner">
          <h3>✅ Votre mission est terminée !</h3>
          <p>En attente des autres joueurs...</p>
        </div>
      )}

      {allTurnsComplete && (
        <div className="coop-section">
          <div className="coop-code-display">
            <h3>🔑 Votre code COOP</h3>
            <div className="code-box">{myCoopCode || '??'}</div>
            <p className="code-instruction">
              {myCoopCode ? 'Partagez ce code avec vos coéquipiers !' : 'Code non disponible'}
            </p>
          </div>

          <div className="final-code-input">
            <h3>🎯 Code COOP final (6 chiffres)</h3>
            <p className="help-text">
              Format : Code Biostat (2) + Code Logistique (2) + Code Hygiène (2)
            </p>
            <div className="code-input-group">
              <input
                type="text"
                maxLength={6}
                value={finalCode}
                onChange={(e) => setFinalCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="final-code-field"
              />
              <button
                onClick={handleSubmitCode}
                disabled={finalCode.length !== 6}
                className="btn-submit-code"
              >
                Valider le code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameInterface;

