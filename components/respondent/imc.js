import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const HEIGHT_MINMAX = {
  min: 50,
  max: 246,
};

const WEIGHT_MINMAX = {
  min: 25,
  max: 400,
};

function renderMandatoryFieldsMessage(msg) {
  // Dupliquer depuis le composant
  // risk-factor-radios
  return (
    <div className="message">
      <div className="primary-message">{msg}</div>
      <style jsx>{`
        .primary-message {
          margin: 0.5em 0;
          text-align: center;
          color: var(--alert-dark);
        }
      `}</style>
    </div>
  );
}

function IMC({ handleHeight, handleWeight }) {
  const didMountRef = useRef(false);
  const [weight, setWeight] = useState();
  const [height, setHeight] = useState();
  const [isWeightValid, setWeightIsValid] = useState(false);
  const [isHeightValid, setHeightIsValid] = useState(false);

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      handleHeight(height);
      handleWeight(weight);
    },
    [height, weight, handleHeight, handleWeight]
  );

  useEffect(() => {
    if (didMountRef.current) {
      const weightIsValid =
        weight >= WEIGHT_MINMAX.min && weight <= WEIGHT_MINMAX.max;
      setWeightIsValid(weightIsValid);
      const heightIsValid =
        height >= HEIGHT_MINMAX.min && height <= HEIGHT_MINMAX.max;
      setHeightIsValid(heightIsValid);
    } else {
      didMountRef.current = true;
    }
  });

  return (
    <article className="step" id="imc-01">
      <h2>
        <i className="fas fa-weight" aria-hidden="true" />{' '}
        <span>Indiquez votre poids et votre taille</span>
      </h2>
      <div className="card">
        <form id="form-imc" onSubmit={handleSubmit}>
          <div className="complement-infos">
            <p>
              Ces données sont utiles pour calculer votre indice de masse
              corporelle.
            </p>
            <ul>
              <li>
                <label htmlFor="add-taille">Taille en centimètres * :</label>
                <input
                  type="number"
                  required
                  id="add-taille"
                  min={HEIGHT_MINMAX.min}
                  max={HEIGHT_MINMAX.max}
                  placeholder="Par ex. 165"
                  onChange={event => setHeight(event.target.value)}
                />
              </li>
              <li>
                <label htmlFor="add-poids">Poids en kilogrammes * :</label>
                <input
                  type="number"
                  required
                  id="add-poids"
                  min={WEIGHT_MINMAX.min}
                  max={WEIGHT_MINMAX.max}
                  placeholder="Par ex. 70"
                  onChange={event => setWeight(event.target.value)}
                />
              </li>
            </ul>
            {didMountRef.current &&
              !isWeightValid &&
              weight !== undefined &&
              renderMandatoryFieldsMessage(
                'Ce nombre ne semble pas être un poids valide en kilogrammes.'
              )}
          </div>
          {didMountRef.current &&
            !isHeightValid &&
            height !== undefined &&
            renderMandatoryFieldsMessage(
              'Ce nombre ne semble pas être une taille valide en centimètres.'
            )}
          {isWeightValid && isHeightValid && (
            <button className="mainbutton" type="submit">
              <span>
                Je mesure {height} cm et je pèse {weight} kilos.
              </span>
              <i className="fas fa-check" aria-hidden="true" />
            </button>
          )}
          <p>* La saisie de ces deux champs est obligatoire.</p>
        </form>
      </div>
    </article>
  );
}

IMC.propTypes = {
  handleHeight: PropTypes.func.isRequired,
  handleWeight: PropTypes.func.isRequired,
};

export default IMC;
