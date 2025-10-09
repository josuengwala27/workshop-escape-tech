import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import '../../styles/BiostatRole.css';

function BiostatRole({ data, onComplete, isCompleted, roomCode }) {
  const [selectedLot, setSelectedLot] = useState(0);
  const [analysis, setAnalysis] = useState({});

  // Partager les actions en temps réel
  const shareAction = (action, actionData) => {
    const socket = window.socket;
    if (socket && roomCode) {
      socket.emit('shareAction', { roomCode, action, data: actionData });
    }
  };

  useEffect(() => {
    shareAction('selectLot', { selectedLot, analysis });
  }, [selectedLot, analysis]);

  const [showDecisionModal, setShowDecisionModal] = useState(null);

  const handleAnalyze = (lotIndex) => {
    setShowDecisionModal(lotIndex);
  };

  const handleDecision = (isUsable) => {
    const lot = data.lots[showDecisionModal];
    const minutesAbove8 = lot.points.filter(p => p.temp > 8).length;
    
    setAnalysis(prev => ({ 
      ...prev, 
      [lot.name]: {
        lot: lot.name,
        minutesAbove8,
        isOk: isUsable,
        status: isUsable ? 'UTILISABLE ✅' : 'À REJETER ❌'
      }
    }));
    setShowDecisionModal(null);
  };

  const [selectedOkLot, setSelectedOkLot] = useState(null);

  const handleSubmit = () => {
    if (!selectedOkLot) {
      alert('⚠️ Vous devez sélectionner UN lot utilisable à envoyer à la Logistique !');
      return;
    }

    const coopCode = data.coopCode;

    onComplete({
      selectedLot: selectedOkLot,
      okLots: data.lots.filter(lot => analysis[lot.name]?.isOk).map(lot => lot.name),
      rejectedLots: data.lots.filter(lot => 
        analysis[lot.name] && !analysis[lot.name].isOk
      ).map(lot => lot.name),
      coopCode
    });
  };

  const allAnalyzed = data.lots.every(lot => analysis[lot.name]);

  return (
    <div className="biostat-role">
      <div className="role-instructions">
        <h2>📋 Mission</h2>
        <p>Analysez les courbes de température de chaque lot de vaccins.</p>
        <p className="warning-text">
          ⚠️ <strong>Règle :</strong> Un lot est <strong>UTILISABLE</strong> si la température est restée 
          <strong> au-dessus de 8°C pendant 8 minutes maximum</strong>.
        </p>
      </div>

      <div className="lots-tabs">
        {data.lots.map((lot, index) => (
          <button
            key={lot.name}
            onClick={() => setSelectedLot(index)}
            className={`lot-tab ${selectedLot === index ? 'active' : ''} ${
              analysis[lot.name] ? (analysis[lot.name].isOk ? 'ok' : 'rejected') : ''
            }`}
          >
            Lot {lot.name}
            {analysis[lot.name] && (
              <span className="lot-status-icon">
                {analysis[lot.name].isOk ? ' ✅' : ' ❌'}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="chart-container">
        <h3>Lot {data.lots[selectedLot].name} - Courbe de température</h3>
        
        <div className="analysis-helper">
          <p>📝 <strong>Aide :</strong> Comptez le nombre de points au-dessus de la ligne rouge (8°C)</p>
          <p className="helper-rule">
            ✅ Si ≤ 8 minutes au-dessus de 8°C → <strong className="usable-text">UTILISABLE</strong><br/>
            ❌ Si > 8 minutes au-dessus de 8°C → <strong className="reject-text">À REJETER</strong>
          </p>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.lots[selectedLot].points}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              label={{ value: 'Temps (minutes)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ value: 'Température (°C)', angle: -90, position: 'insideLeft' }}
              domain={[0, 15]}
            />
            <Tooltip 
              formatter={(value) => [`${value}°C`, 'Température']}
              labelFormatter={(label) => `Minute ${label}`}
            />
            <ReferenceLine 
              y={8} 
              stroke="red" 
              strokeWidth={3}
              strokeDasharray="5 5" 
              label={{ value: '⚠️ SEUIL 8°C', position: 'right', fill: 'red', fontSize: 14 }}
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#2196F3" 
              strokeWidth={3}
              dot={{ fill: '#2196F3', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {!analysis[data.lots[selectedLot].name] && (
          <button
            onClick={() => handleAnalyze(selectedLot)}
            className="btn-analyze"
          >
            📝 Déclarer mon analyse
          </button>
        )}
        
        {showDecisionModal === selectedLot && (
          <div className="decision-modal">
            <h4>🔍 Votre décision pour le Lot {data.lots[selectedLot].name}</h4>
            <p className="modal-instruction">
              Comptez les minutes où la température dépasse 8°C.<br/>
              <strong>Règle :</strong> Si ≤ 8 minutes → Utilisable | Si > 8 minutes → À rejeter
            </p>
            <div className="decision-buttons">
              <button 
                onClick={() => handleDecision(true)}
                className="btn-decision usable"
              >
                ✅ UTILISABLE
              </button>
              <button 
                onClick={() => handleDecision(false)}
                className="btn-decision reject"
              >
                ❌ À REJETER
              </button>
            </div>
            <button 
              onClick={() => setShowDecisionModal(null)}
              className="btn-cancel"
            >
              Annuler
            </button>
          </div>
        )}

        {analysis[data.lots[selectedLot].name] && (
          <div className={`analysis-result ${analysis[data.lots[selectedLot].name].isOk ? 'ok' : 'rejected'}`}>
            <h4>Résultat de l'analyse</h4>
            <p>
              Durée au-dessus de 8°C : <strong>{analysis[data.lots[selectedLot].name].minutesAbove8} minutes</strong>
            </p>
            <p className="verdict">
              {analysis[data.lots[selectedLot].name].status}
            </p>
            <button
              onClick={() => {
                const newAnalysis = { ...analysis };
                delete newAnalysis[data.lots[selectedLot].name];
                setAnalysis(newAnalysis);
              }}
              className="btn-modify"
              disabled={isCompleted}
            >
              🔄 Modifier cette décision
            </button>
          </div>
        )}
      </div>

      {allAnalyzed && !isCompleted && (
        <div className="submit-section">
          <h3>🎯 Choisissez UN lot utilisable à envoyer à la Logistique</h3>
          <div className="lot-selection">
            {data.lots.filter(lot => analysis[lot.name]?.isOk).map(lot => (
              <button
                key={lot.name}
                onClick={() => setSelectedOkLot(lot.name)}
                className={`lot-select-btn ${selectedOkLot === lot.name ? 'selected' : ''}`}
              >
                <span className="lot-icon">📦</span>
                <span className="lot-label">Lot {lot.name}</span>
                {selectedOkLot === lot.name && <span className="check-icon">✓</span>}
              </button>
            ))}
            {data.lots.filter(lot => analysis[lot.name]?.isOk).length === 0 && (
              <p className="warning-no-lots">
                ⚠️ Aucun lot utilisable ! Vérifiez vos analyses.
              </p>
            )}
          </div>
          <button 
            onClick={handleSubmit} 
            className="btn-submit"
            disabled={!selectedOkLot}
          >
            📤 Envoyer le Lot {selectedOkLot} à la Logistique
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="completion-message">
          <h3>✅ Analyse terminée !</h3>
          <p>Partagez votre code COOP avec l'équipe.</p>
        </div>
      )}
    </div>
  );
}

export default BiostatRole;

