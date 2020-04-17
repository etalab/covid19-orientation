// Compute end based on some parameters
// https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/blob/master/pseudo-code.org
const chooseEnd = ({
  ageRange,
  minorSeverityFactorsCount,
  majorSeverityFactorsCount,
  fever,
  cough,
  diarrhea,
  soreThroatAches,
  agueusiaAnosmia,
  pronosticFactorsCount
}) => {
  let end = 8
  // Dont try to compute end when no age defined
  if (!ageRange) {
    return 8
  }

  if (ageRange === 'inf_15') {
    end = 1
  } else if (majorSeverityFactorsCount >= 1) {
    end = 5
  } else if (fever && cough) {
    if (pronosticFactorsCount === 0) {
      end = 6
    }

    if (pronosticFactorsCount >= 1) {
      if (minorSeverityFactorsCount < 2) {
        end = 6
      }

      if (minorSeverityFactorsCount >= 2) {
        end = 4
      }
    }
  } else if (
    fever ||
    (!fever &&
      (diarrhea || (cough && soreThroatAches) || (cough && agueusiaAnosmia)))
  ) {
    if (pronosticFactorsCount === 0) {
      if (minorSeverityFactorsCount === 0) {
        if (ageRange === 'inf_15' || ageRange === 'from_15_to_49') {
          end = 2
        } else {
          end = 3
        }
      } else if (minorSeverityFactorsCount >= 1) {
        end = 3
      }
    }

    if (pronosticFactorsCount >= 1) {
      if (minorSeverityFactorsCount < 2) {
        end = 3
      } else if (minorSeverityFactorsCount >= 2) {
        end = 4
      }
    }
  } else if (cough || soreThroatAches || agueusiaAnosmia) {
    if (pronosticFactorsCount === 0) {
      end = 2
    } else if (pronosticFactorsCount >= 1) {
      end = 7
    }
  } else if (!cough && !soreThroatAches && !agueusiaAnosmia) {
    end = 8
  }

  return end
}

export default chooseEnd
