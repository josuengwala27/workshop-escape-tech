import React from 'react';
import '../styles/Results.css';

function Results({ victory, results, role }) {
  const getRoleEmoji = (roleName) => {
    const emojis = {
      biostat: '📊',
      logistics: '🚚',
      hygiene: '🧤'
    };
    return emojis[roleName] || '👤';
  };

  return (
    <div className="results-container">
      <div className="results-card">
        {victory ? (
          <div className="victory-banner">
            <div className="victory-icon">🎉</div>
            <h1>MISSION RÉUSSIE !</h1>
            <p>Vous avez sauvé les vaccins et protégé la santé publique.</p>
          </div>
        ) : (
          <div className="defeat-banner">
            <div className="defeat-icon">❌</div>
            <h1>MISSION ÉCHOUÉE</h1>
            <p>La chaîne du froid ou le protocole n'a pas été respecté.</p>
          </div>
        )}

        <div className="results-summary">
          <h2>📋 Récapitulatif de la mission</h2>

          {results?.biostat && (
            <div className="result-section">
              <h3>{getRoleEmoji('biostat')} Thermo-Scan</h3>
              <div className="result-details">
                <p>
                  <strong>Lots utilisables :</strong>{' '}
                  {results.biostat.okLots?.length > 0 
                    ? results.biostat.okLots.join(', ') 
                    : 'Aucun'}
                </p>
                <p>
                  <strong>Lots rejetés :</strong>{' '}
                  {results.biostat.rejectedLots?.length > 0
                    ? results.biostat.rejectedLots.join(', ')
                    : 'Aucun'}
                </p>
                <p>
                  <strong>Code COOP :</strong> <span className="code">{results.biostat.coopCode}</span>
                </p>
              </div>
            </div>
          )}

          {results?.logistics && (
            <div className="result-section">
              <h3>{getRoleEmoji('logistics')} Froid Express</h3>
              <div className="result-details">
                <p>
                  <strong>Durée du trajet :</strong> {results.logistics.duration} minutes
                </p>
                <p>
                  <strong>Destination :</strong> {results.logistics.destination}
                </p>
                <p className={results.logistics.isOnTime ? 'success' : 'error'}>
                  {results.logistics.isOnTime ? '✅ Dans les temps' : '❌ Hors délai'}
                </p>
                <p>
                  <strong>Code COOP :</strong> <span className="code">{results.logistics.coopCode}</span>
                </p>
              </div>
            </div>
          )}

          {results?.hygiene && (
            <div className="result-section">
              <h3>{getRoleEmoji('hygiene')} Hygiène</h3>
              <div className="result-details">
                <p>
                  <strong>Erreurs :</strong> {results.hygiene.errors}
                </p>
                <p className={results.hygiene.errors === 0 ? 'success' : 'error'}>
                  {results.hygiene.errors === 0 ? '✅ Protocole parfait' : `⚠️ ${results.hygiene.errors} erreur(s)`}
                </p>
                <p>
                  <strong>Code COOP :</strong> <span className="code">{results.hygiene.coopCode}</span>
                </p>
              </div>
            </div>
          )}

          <div className="code-verification">
            <h3>🔐 Vérification du code COOP</h3>
            <div className="code-comparison">
              <div>
                <strong>Code attendu :</strong>
                <div className="code-display correct">{results?.correctCode || '------'}</div>
              </div>
              <div>
                <strong>Code soumis :</strong>
                <div className={`code-display ${results?.submittedCode === results?.correctCode ? 'correct' : 'incorrect'}`}>
                  {results?.submittedCode || '------'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="educational-section">
          <h2>📚 Ce que vous avez appris</h2>
          <div className="learning-points">
            <div className="learning-card">
              <h4>🌡️ Chaîne du froid</h4>
              <p>
                Les vaccins doivent être conservés entre 2°C et 8°C. 
                Une exposition prolongée à des températures inadéquates peut les rendre inefficaces.
              </p>
            </div>
            <div className="learning-card">
              <h4>📦 Logistique médicale</h4>
              <p>
                Le transport des vaccins nécessite une planification rigoureuse 
                pour respecter les délais et maintenir la chaîne du froid.
              </p>
            </div>
            <div className="learning-card">
              <h4>🧤 Protocole d'hygiène</h4>
              <p>
                L'ordre des gestes d'hygiène est crucial pour prévenir toute contamination 
                et garantir la sécurité des patients.
              </p>
            </div>
            <div className="learning-card">
              <h4>🤝 Travail d'équipe</h4>
              <p>
                La collaboration entre différents métiers (analyste, logisticien, infirmier) 
                est essentielle dans le secteur de la santé.
              </p>
            </div>
          </div>
        </div>

        <button onClick={() => window.location.reload()} className="btn-restart">
          🔄 Nouvelle partie
        </button>
      </div>
    </div>
  );
}

export default Results;

