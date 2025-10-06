import React, { useState } from 'react';
import '../../styles/HygieneRole.css';

function HygieneRole({ data, onComplete, isCompleted }) {
  const [orderedSteps, setOrderedSteps] = useState([]);
  const [availableSteps, setAvailableSteps] = useState([...data.steps]);
  const [errors, setErrors] = useState(0);

  const handleSelectStep = (step) => {
    setOrderedSteps([...orderedSteps, step]);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
  };

  const handleRemoveStep = (index) => {
    const step = orderedSteps[index];
    setAvailableSteps([...availableSteps, step]);
    setOrderedSteps(orderedSteps.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setOrderedSteps([]);
    setAvailableSteps([...data.steps]);
    setErrors(0);
  };

  const handleSubmit = () => {
    let errorCount = 0;
    orderedSteps.forEach((step, index) => {
      const correctStep = data.correctOrder.find(s => s.order === index + 1);
      if (step.id !== correctStep.id) {
        errorCount++;
      }
    });

    setErrors(errorCount);

    onComplete({
      orderedSteps: orderedSteps.map(s => s.id),
      errors: errorCount,
      isCorrect: errorCount === 0,
      coopCode: data.coopCode
    });
  };

  const canSubmit = orderedSteps.length === data.steps.length;

  return (
    <div className="hygiene-role">
      <div className="role-instructions">
        <h2>📋 Mission</h2>
        <p>Ordonnez les gestes d'hygiène dans le bon ordre pour la préparation d'une vaccination.</p>
        <p className="warning-text">
          ⚠️ <strong>Important :</strong> Le respect de l'ordre est crucial pour éviter toute contamination.
        </p>
      </div>

      <div className="hygiene-container">
        <div className="ordered-zone">
          <h3>✅ Ordre des gestes ({orderedSteps.length}/{data.steps.length})</h3>
          {orderedSteps.length === 0 ? (
            <div className="empty-zone">
              <p>Sélectionnez les gestes dans l'ordre</p>
            </div>
          ) : (
            <div className="steps-list">
              {orderedSteps.map((step, index) => (
                <div key={step.id} className="step-card ordered">
                  <span className="step-number">{index + 1}</span>
                  <span className="step-text">{step.text}</span>
                  {!isCompleted && (
                    <button
                      onClick={() => handleRemoveStep(index)}
                      className="btn-remove"
                      title="Retirer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="available-zone">
          <h3>📝 Gestes disponibles</h3>
          {availableSteps.length === 0 ? (
            <div className="empty-zone">
              <p>Tous les gestes ont été ordonnés</p>
            </div>
          ) : (
            <div className="steps-list">
              {availableSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleSelectStep(step)}
                  className="step-card available"
                  disabled={isCompleted}
                >
                  <span className="step-text">{step.text}</span>
                  <span className="step-add">+</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hygiene-actions">
        <button onClick={handleReset} className="btn-reset" disabled={isCompleted}>
          🔄 Recommencer
        </button>
        <button
          onClick={handleSubmit}
          className="btn-submit"
          disabled={!canSubmit || isCompleted}
        >
          {isCompleted ? 'Protocole validé ✓' : 'Valider le protocole'}
        </button>
      </div>

      {isCompleted && (
        <div className={`result-message ${errors === 0 ? 'success' : 'error'}`}>
          {errors === 0 ? (
            <>
              <h3>✅ Protocole parfait !</h3>
              <p>Tous les gestes sont dans le bon ordre.</p>
            </>
          ) : (
            <>
              <h3>⚠️ Protocole avec erreurs</h3>
              <p>{errors} geste(s) mal placé(s).</p>
            </>
          )}
          <p className="share-code">Partagez votre code COOP avec l'équipe.</p>
        </div>
      )}
    </div>
  );
}

export default HygieneRole;

