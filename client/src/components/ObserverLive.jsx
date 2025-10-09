import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import '../styles/ObserverLive.css';

function ObserverLive({ currentTurn, gameData }) {
  const [observedData, setObservedData] = useState({
    selectedLot: 0,
    analysis: {},
    selectedRoute: [],
    currentLocation: 'depot',
    totalDuration: 0,
    orderedSteps: []
  });
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const socket = window.socket;
    if (!socket) return;

    const handlePlayerAction = ({ role, action, data }) => {
      console.log('👀 Observer reçoit:', { role, action, data, currentTurn });
      if (role === currentTurn) {
        console.log('✅ Mise à jour de observedData:', data);
        setObservedData(prev => {
          const newData = { ...prev, ...data };
          console.log('📊 Nouveau state:', newData);
          return newData;
        });
        setLastUpdate(Date.now());
      }
    };

    socket.on('playerAction', handlePlayerAction);

    return () => {
      socket.off('playerAction', handlePlayerAction);
    };
  }, [currentTurn]);

  const getRoleInfo = () => {
    const info = {
      biostat: { emoji: '📊', name: 'Biostat\'', color: '#667eea' },
      logistics: { emoji: '🚚', name: 'Logistique', color: '#f5576c' },
      hygiene: { emoji: '🧤', name: 'Infirmier·e', color: '#00f2fe' }
    };
    return info[currentTurn] || {};
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="observer-live">
      <div className="observer-live-header">
        <span className="live-indicator">🔴 LIVE</span>
        <h3>
          <span className="role-emoji">{roleInfo.emoji}</span>
          Vue en temps réel : {roleInfo.name}
        </h3>
        <span className="update-indicator" key={lastUpdate}>
          📡 Données synchronisées
        </span>
      </div>

      <div className="observer-content">
        {currentTurn === 'biostat' && gameData?.biostat && (
          <div className="biostat-observer">
            <div className="lots-tabs-observer">
              {gameData.biostat.lots.map((lot, index) => (
                <div
                  key={lot.name}
                  className={`lot-tab-observer ${observedData.selectedLot === index ? 'active' : ''} ${
                    observedData.analysis[lot.name] ? (observedData.analysis[lot.name].isOk ? 'ok' : 'rejected') : ''
                  }`}
                >
                  Lot {lot.name}
                  {observedData.analysis[lot.name] && (
                    <span className="lot-status-icon">
                      {observedData.analysis[lot.name].isOk ? ' ✅' : ' ❌'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {gameData.biostat.lots[observedData.selectedLot] && (
              <div className="chart-observer">
                <h4>Lot {gameData.biostat.lots[observedData.selectedLot].name}</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={gameData.biostat.lots[observedData.selectedLot].points}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 15]} />
                    <Tooltip />
                    <ReferenceLine y={8} stroke="red" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="temp" stroke="#2196F3" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>

                {observedData.analysis[gameData.biostat.lots[observedData.selectedLot].name] && (
                  <div className="analysis-badge">
                    {observedData.analysis[gameData.biostat.lots[observedData.selectedLot].name].status}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentTurn === 'logistics' && gameData?.logistics && (
          <div className="logistics-observer">
            <div className="route-info-observer">
              <div className="info-item">
                <span className="label">Position :</span>
                <span className="value">{observedData.currentLocation || 'depot'}</span>
              </div>
              <div className="info-item">
                <span className="label">Durée :</span>
                <span className="value">{observedData.totalDuration || 0} / {gameData.logistics.coldLimit} min</span>
              </div>
            </div>

            {observedData.selectedRoute && observedData.selectedRoute.length > 0 && (
              <div className="route-display">
                <h4>Itinéraire en cours :</h4>
                <div className="route-steps-observer">
                  <div className="step">🏭 Dépôt</div>
                  {observedData.selectedRoute.map((route, index) => (
                    <React.Fragment key={index}>
                      <div className="arrow">→ {route.duration}min</div>
                      <div className="step">{route.to}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentTurn === 'hygiene' && gameData?.hygiene && (
          <div className="hygiene-observer">
            <h4>Ordre en cours :</h4>
            {observedData.orderedSteps && observedData.orderedSteps.length > 0 ? (
              <div className="steps-observer">
                {observedData.orderedSteps.map((stepId, index) => {
                  const step = gameData.hygiene.steps.find(s => s.id === stepId);
                  return (
                    <div key={stepId} className="step-item-observer">
                      <span className="step-number">{index + 1}</span>
                      <span className="step-text">{step?.text}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="waiting-text">En attente de la sélection...</p>
            )}
          </div>
        )}
      </div>

      <div className="observer-tip">
        💡 <strong>Conseil :</strong> Préparez-vous pour votre tour !
      </div>

      {/* Mode DEBUG - Affichage des données reçues */}
      <details className="debug-panel">
        <summary>🐛 Mode DEBUG (cliquez pour voir les données)</summary>
        <pre className="debug-content">
          {JSON.stringify(observedData, null, 2)}
        </pre>
      </details>
    </div>
  );
}

export default ObserverLive;

