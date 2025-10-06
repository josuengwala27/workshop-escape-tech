import React from 'react';
import '../styles/Observer.css';

function Observer({ currentTurn, myRole, completedTurns }) {
  const getRoleInfo = (role) => {
    const info = {
      biostat: {
        emoji: '📊',
        name: 'Biostat\'',
        task: 'Analyse des lots de vaccins',
        description: 'Le joueur analyse les courbes de température et détermine quels lots sont utilisables.'
      },
      logistics: {
        emoji: '🚚',
        name: 'Logistique',
        task: 'Organisation de la livraison',
        description: 'Le joueur planifie un itinéraire de livraison qui respecte la chaîne du froid (≤ 15 minutes).'
      },
      hygiene: {
        emoji: '🧤',
        name: 'Infirmier·e',
        task: 'Protocole d\'hygiène',
        description: 'Le joueur ordonne les gestes d\'hygiène dans le bon ordre pour la vaccination.'
      }
    };
    return info[role] || {};
  };

  const currentRoleInfo = getRoleInfo(currentTurn);

  return (
    <div className="observer-container">
      <div className="observer-card">
        <div className="observer-header">
          <span className="observer-icon">👀</span>
          <h2>Mode Observation</h2>
        </div>

        <div className="current-turn-banner">
          <div className="turn-icon">{currentRoleInfo.emoji}</div>
          <div className="turn-info">
            <h3>C'est au tour de : {currentRoleInfo.name}</h3>
            <p className="turn-task">{currentRoleInfo.task}</p>
          </div>
        </div>

        <div className="turn-description">
          <p>{currentRoleInfo.description}</p>
        </div>

        <div className="waiting-animation">
          <div className="pulse-icon">⏳</div>
          <p>En attente que le joueur termine sa mission...</p>
        </div>

        <div className="turn-progress">
          <h4>📋 Progression de la partie</h4>
          <div className="progress-steps">
            {['biostat', 'logistics', 'hygiene'].map((role, index) => {
              const roleInfo = getRoleInfo(role);
              const isCompleted = completedTurns.includes(role);
              const isCurrent = currentTurn === role;
              
              return (
                <div 
                  key={role} 
                  className={`progress-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="step-icon">{roleInfo.emoji}</div>
                  <div className="step-name">{roleInfo.name}</div>
                  <div className="step-status">
                    {isCompleted && <span className="status-completed">✓</span>}
                    {isCurrent && !isCompleted && <span className="status-current">●</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="observer-tips">
          <h4>💡 Pendant l'attente</h4>
          <ul>
            <li>Préparez-vous mentalement pour votre tour</li>
            <li>Discutez de la stratégie avec les autres joueurs</li>
            <li>Gardez un œil sur le timer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Observer;

