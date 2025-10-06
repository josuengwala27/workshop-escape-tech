import React, { useState } from 'react';
import '../styles/Lobby.css';

function Lobby({ onJoinGame, players, role, onReady }) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && roomCode.trim()) {
      onJoinGame(name, roomCode.toUpperCase());
      setHasJoined(true);
    }
  };

  const getRoleName = (role) => {
    const roleNames = {
      biostat: 'Biostat\'',
      logistics: 'Logistique',
      hygiene: 'Infirmier·e'
    };
    return roleNames[role] || role;
  };

  const getRoleEmoji = (role) => {
    const emojis = {
      biostat: '📊',
      logistics: '🚚',
      hygiene: '🧤'
    };
    return emojis[role] || '👤';
  };

  if (!hasJoined) {
    return (
      <div className="lobby-container">
        <div className="lobby-card">
          <div className="logo">
            <span className="logo-icon">💉</span>
            <h1>VACCINE CRISIS</h1>
          </div>
          
          <div className="mission-brief">
            <h2>🚨 ALERTE URGENTE</h2>
            <p>Un frigo de vaccins est en panne !</p>
            <p className="timer-warning">⏱️ Vous avez <strong>5 minutes</strong> pour :</p>
            <ul>
              <li>📊 Valider les lots utilisables</li>
              <li>🚚 Organiser la livraison</li>
              <li>🧤 Contrôler l'hygiène</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="join-form">
            <div className="form-group">
              <label htmlFor="name">Votre nom</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Agent Smith"
                maxLength={20}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="roomCode">Code de la partie</label>
              <input
                id="roomCode"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="VAXCR1"
                maxLength={10}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Rejoindre la mission
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <div className="lobby-card">
        <h1>Salle d'attente</h1>
        <p className="room-code">Code partie : <strong>{roomCode}</strong></p>

        {role && (
          <div className="role-assigned">
            <h2>Votre rôle assigné</h2>
            <div className={`role-badge role-${role}`}>
              <span className="role-emoji">{getRoleEmoji(role)}</span>
              <span className="role-name">{getRoleName(role)}</span>
            </div>
          </div>
        )}

        <div className="players-list">
          <h3>Joueurs connectés ({players.length}/3)</h3>
          {players.map((player) => (
            <div key={player.id} className="player-item">
              <span className="player-emoji">{getRoleEmoji(player.role)}</span>
              <span className="player-name">{player.name}</span>
              <span className="player-role">{getRoleName(player.role)}</span>
              {player.ready && <span className="ready-badge">✓ Prêt</span>}
            </div>
          ))}
        </div>

        {players.length === 3 ? (
          <button onClick={onReady} className="btn-primary btn-ready">
            Je suis prêt !
          </button>
        ) : (
          <div className="waiting-message">
            <p>En attente de {3 - players.length} joueur(s)...</p>
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Lobby;

