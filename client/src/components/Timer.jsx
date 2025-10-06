import React from 'react';
import '../styles/Timer.css';

function Timer({ timeRemaining }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const percentage = (timeRemaining / 300) * 100;
  const isUrgent = timeRemaining <= 60;
  const isCritical = timeRemaining <= 30;

  return (
    <div className={`timer ${isUrgent ? 'urgent' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="timer-icon">⏱️</div>
      <div className="timer-display">
        <span className="timer-value">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        <div className="timer-bar">
          <div 
            className="timer-bar-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Timer;

