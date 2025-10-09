import React, { useState, useEffect } from 'react';
import '../../styles/LogisticsRole.css';

function LogisticsRole({ data, onComplete, isCompleted, selectedLot, roomCode }) {
  const [selectedRoute, setSelectedRoute] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('depot');
  const [totalDuration, setTotalDuration] = useState(0);

  // Partager les actions en temps réel
  useEffect(() => {
    const socket = window.socket;
    if (socket && roomCode) {
      console.log('🔴 Logistique partage:', { selectedRoute, currentLocation, totalDuration });
      socket.emit('shareAction', { 
        roomCode, 
        action: 'updateLogistics', 
        data: { selectedRoute, currentLocation, totalDuration }
      });
    }
  }, [selectedRoute, currentLocation, totalDuration, roomCode]);

  const getAvailableRoutes = () => {
    return data.routes.filter(route => route.from === currentLocation);
  };

  const handleSelectRoute = (route) => {
    const newRoute = [...selectedRoute, route];
    const newDuration = totalDuration + route.duration;
    
    setSelectedRoute(newRoute);
    setCurrentLocation(route.to);
    setTotalDuration(newDuration);
  };

  const handleReset = () => {
    setSelectedRoute([]);
    setCurrentLocation('depot');
    setTotalDuration(0);
  };

  const handleSubmit = () => {
    const isOnTime = totalDuration <= data.coldLimit;
    const destination = currentLocation;

    onComplete({
      route: selectedRoute,
      duration: totalDuration,
      destination,
      isOnTime,
      coopCode: data.coopCode
    });
  };

  const getCurrentLocationName = () => {
    return data.locations.find(loc => loc.id === currentLocation)?.name || currentLocation;
  };

  const getLocationName = (id) => {
    return data.locations.find(loc => loc.id === id)?.name || id;
  };

  const isAtDestination = currentLocation !== 'depot';
  const isOnTime = totalDuration <= data.coldLimit;

  return (
    <div className="logistics-role">
      <div className="role-instructions">
        <h2>📋 Mission</h2>
        {selectedLot && (
          <div className="lot-info">
            <h3>📦 Lot à livrer : <strong>Lot {selectedLot}</strong></h3>
            <p className="lot-status">✅ Validé par Biostat' comme UTILISABLE</p>
          </div>
        )}
        <p>Organisez la livraison du lot depuis le dépôt vers un centre.</p>
        <p className="warning-text">
          ⚠️ <strong>Contrainte :</strong> Le trajet doit durer <strong>maximum {data.coldLimit} minutes</strong> pour maintenir la chaîne du froid.
        </p>
      </div>

      <div className="logistics-dashboard">
        <div className="route-info">
          <div className="info-card">
            <span className="info-label">Position actuelle</span>
            <span className="info-value location">{getCurrentLocationName()}</span>
          </div>
          <div className="info-card">
            <span className="info-label">Durée totale</span>
            <span className={`info-value duration ${totalDuration > data.coldLimit ? 'over-limit' : ''}`}>
              {totalDuration} / {data.coldLimit} min
            </span>
          </div>
          <div className="info-card">
            <span className="info-label">État</span>
            <span className={`info-value status ${isOnTime ? 'ok' : 'danger'}`}>
              {isOnTime ? '✅ Dans les temps' : '❌ Hors délai'}
            </span>
          </div>
        </div>

        <div className="route-progress">
          <h3>📍 Itinéraire</h3>
          {selectedRoute.length === 0 ? (
            <p className="empty-route">Sélectionnez un trajet pour commencer</p>
          ) : (
            <div className="route-steps">
              <div className="route-step">
                <span className="step-icon">🏭</span>
                <span className="step-name">Dépôt</span>
              </div>
              {selectedRoute.map((route, index) => (
                <React.Fragment key={index}>
                  <div className="route-arrow">
                    → <span className="route-duration">{route.duration}min</span>
                  </div>
                  <div className="route-step">
                    <span className="step-icon">
                      {route.to === 'centre' ? '🏥' : '🏨'}
                    </span>
                    <span className="step-name">{getLocationName(route.to)}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="available-routes">
          <h3>🚚 Trajets disponibles depuis {getCurrentLocationName()}</h3>
          <div className="routes-grid">
            {getAvailableRoutes().map((route, index) => {
              const wouldExceedLimit = totalDuration + route.duration > data.coldLimit;
              return (
                <button
                  key={index}
                  onClick={() => handleSelectRoute(route)}
                  className={`route-card ${wouldExceedLimit ? 'over-limit' : ''}`}
                  disabled={isCompleted}
                >
                  <div className="route-destination">
                    <span className="destination-icon">📍</span>
                    <span className="destination-name">{getLocationName(route.to)}</span>
                  </div>
                  <div className="route-duration">{route.duration} minutes</div>
                  {wouldExceedLimit && (
                    <div className="route-warning">⚠️ Dépasserait la limite</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="logistics-actions">
          <button onClick={handleReset} className="btn-reset" disabled={isCompleted}>
            🔄 Recommencer
          </button>
          <button
            onClick={handleSubmit}
            className="btn-submit"
            disabled={!isAtDestination || isCompleted}
          >
            {isCompleted ? 'Livraison confirmée ✓' : 'Confirmer la livraison'}
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="completion-message">
          <h3>✅ Livraison planifiée !</h3>
          <p>Partagez votre code COOP avec l'équipe.</p>
        </div>
      )}
    </div>
  );
}

export default LogisticsRole;

