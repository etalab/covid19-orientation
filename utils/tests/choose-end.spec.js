import chooseEnd from '../choose-end'

let value = {}
let result = null

const parameters = {
  ageRange: 'from_15_to_49',
  minorSeverityFactorsCount: 0,
  majorSeverityFactorsCount: 0,
  feverAlgo: false,
  cough: false,
  diarrhea: false,
  soreThroatAches: false,
  agueusiaAnosmia: false,
  pronosticFactorsCount: 3
}

describe('utils | chosseEnd', () => {
  it('si aucun arguments \
doit lever un exception', () => {
    expect(() => chooseEnd()).toThrow()
  })

  it('si ageRange est falsey \
doit retourner la valeur par defaut 8', () => {
    value = {}
    result = chooseEnd(value)
    expect(result).toBe(8)
    value = {
      ...parameters,
      ageRange: undefined
    }
    result = chooseEnd(value)
    expect(result).toBe(8)
    value = {
      ...parameters,
      ageRange: null
    }
    result = chooseEnd(value)
    expect(result).toBe(8)
    value = {
      ...parameters,
      ageRange: 0
    }
    result = chooseEnd(value)
    expect(result).toBe(8)
    value = {
      ...parameters,
      ageRange: false
    }
    result = chooseEnd(value)
    expect(result).toBe(8)
  })

  describe('IF moins de 15 ans => FIN1', () => {
    it('si l’utilisateur a moins de 15 ans \
doit retourner 1', () => {
      value = {
        ...parameters,
        ageRange: 'inf_15'
      }
      result = chooseEnd(value)
      expect(result).toBe(1)
    })

    describe('si l’utilisateur a plus de 15 ans (!’inf_15’) \
doit retourner un type number (> 1 & <= 8)', () => {
      it('Entre 15 et 49 ans', () => {
        value = {
          ...parameters,
          ageRange: 'from_15_to_49'
        }
        result = chooseEnd(value)
        expect(result).toBeGreaterThan(1)
        expect(result).toBeLessThanOrEqual(8)
      })
      it('Entre 50 et 64 ans', () => {
        value = {
          ...parameters,
          ageRange: 'from_50_to_64'
        }
        result = chooseEnd(value)
        expect(result).toBeGreaterThan(1)
        expect(result).toBeLessThanOrEqual(8)
      })
      it('65 ans ou plus', () => {
        value = {
          ...parameters,
          ageRange: 'sup_65'
        }
        result = chooseEnd(value)
        expect(result).toBeGreaterThan(1)
        expect(result).toBeLessThanOrEqual(8)
      })
    })
  })

  describe('IF >= 1 facteurs de gravité majeurs => FIN5', () => {
    it('si majorSeverityFactorsCount est égal à 1 \
doit retourner 5', () => {
      value = {
        ...parameters,
        ageRange: 'from_50_to_69',
        majorSeverityFactorsCount: 1
      }
      result = chooseEnd(value)
      expect(result).toBe(5)
    })

    it('si majorSeverityFactorsCount est supérieur à 1 \
doit retourner 5', () => {
      value = {
        ...parameters,
        ageRange: 'from_15_to_49',
        majorSeverityFactorsCount: 2
      }
      result = chooseEnd(value)
      expect(result).toBe(5)
    })

    it('si majorSeverityFactorsCount inferieur a 1 \
doit retourner un type number (>= 2 & <= 4 | >= 6 & <=8)', () => {
      value = {
        ...parameters,
        ageRange: 'from_15_to_49',
        majorSeverityFactorsCount: 0
      }
      result = chooseEnd(value)
      expect(result).not.toEqual(5)
      expect(result).not.toEqual(1)
    })
  })

  describe('IF fièvre AND toux', () => {
    it('si feverAlgo (&|) cough est false \
ne doit pas retourner 6', () => {
      value = {
        ...parameters,
        cough: true,
        feverAlgo: false,
        pronosticFactorsCount: 1,
        ageRange: 'from_15_to_49',
        minorSeverityFactorsCount: 2
      }
      result = chooseEnd(value)
      expect(result).not.toBe(6)
    })

    it('doit retourner 4 ou 6', () => {
      value = {
        ...parameters,
        cough: true,
        feverAlgo: true,
        pronosticFactorsCount: 1,
        ageRange: 'from_15_to_49',
        minorSeverityFactorsCount: 2
      }
      result = chooseEnd(value)
      expect(result === 4 || result === 6).toBeTruthy()
    })

    describe('IF 0 facteur pronostique => FIN6', () => {
      it('doit retourner 6', () => {
        value = {
          ...parameters,
          cough: true,
          feverAlgo: true,
          pronosticFactorsCount: 0,
          ageRange: 'from_15_to_49',
          minorSeverityFactorsCount: 2
        }
        result = chooseEnd(value)
        expect(result).toBe(6)
      })
    })

    describe('IF >= 1 facteurs pronostiques', () => {
      it('doit retourner 4 ou 6', () => {
        value = {
          ...parameters,
          cough: true,
          feverAlgo: true,
          pronosticFactorsCount: 1,
          ageRange: 'from_15_to_49',
          minorSeverityFactorsCount: 2
        }
        result = chooseEnd(value)
        expect(result === 4 || result === 6).toBeTruthy()
      })

      describe('IF < 2 facteur de gravité mineur => FIN6', () => {
        it('doit retourner 6', () => {
          value = {
            ...parameters,
            cough: true,
            feverAlgo: true,
            pronosticFactorsCount: 1,
            ageRange: 'from_15_to_49',
            minorSeverityFactorsCount: 1
          }
          result = chooseEnd(value)
          expect(result).toBe(6)
        })
      })

      describe('IF >= 2 facteurs de gravité mineurs => FIN4', () => {
        it('doit retourner 4', () => {
          value = {
            ...parameters,
            cough: true,
            feverAlgo: true,
            pronosticFactorsCount: 1,
            ageRange: 'from_15_to_49',
            minorSeverityFactorsCount: 2
          }
          result = chooseEnd(value)
          expect(result).toBe(4)
        })
      })
    })
  })

  describe('IF fièvre XOR \
(diarrhée OR \
(toux AND douleurs) OR \
(toux AND anosmie) OR \
(douleurs AND anosmie))', () => {
    it('si fièvre est true \
doit retourner 2, 3 ou  4', () => {
      value = {
        ...parameters,
        cough: false,
        diarrhea: false,
        feverAlgo: true
      }
      result = chooseEnd(value)
      expect(result === 2 || result === 3 || result === 4).toBeTruthy()
    })

    it('si fievre est false et diarrhée true\
    doit retourner 2, 3 ou  4', () => {
      value = {
        ...parameters,
        cough: false,
        diarrhea: true,
        feverAlgo: false
      }
      result = chooseEnd(value)
      expect(result === 2 || result === 3 || result === 4).toBeTruthy()
    })

    it('si fievre est fals, diarrhée false mais toux & gorge true \
    doit retourner 2, 3 ou  4', () => {
      value = {
        ...parameters,
        cough: true,
        diarrhea: false,
        feverAlgo: false,
        soreThroatAches: true,
        agueusiaAnosmia: false
      }
      result = chooseEnd(value)
      expect(result === 2 || result === 3 || result === 4).toBeTruthy()
    })

    it('si fievre est false, diarrhée false mais gorge & gout/odorat true \
    doit retourner 2, 3 ou  4', () => {
      value = {
        ...parameters,
        cough: false,
        diarrhea: false,
        feverAlgo: false,
        soreThroatAches: true,
        agueusiaAnosmia: true
      }
      result = chooseEnd(value)
      expect(result === 2 || result === 3 || result === 4).toBeTruthy()
    })

    it('si fievre est false, diarrhée false mais toux & gout/odorat true \
    doit retourner 2, 3 ou  4', () => {
      value = {
        ...parameters,
        cough: true,
        diarrhea: false,
        feverAlgo: false,
        soreThroatAches: false,
        agueusiaAnosmia: true
      }
      result = chooseEnd(value)
      expect(result === 2 || result === 3 || result === 4).toBeTruthy()
    })

    describe('IF 0 facteur pronostique', () => {
      describe('IF 0 facteur de gravité mineur', () => {
        describe('IF moins de 50 ans => FIN2', () => {
          it('doit retourner 2', () => {
            value = {
              ...parameters,
              cough: true,
              diarrhea: false,
              feverAlgo: false,
              soreThroatAches: false,
              agueusiaAnosmia: true,
              pronosticFactorsCount: 0,
              minorSeverityFactorsCount: 0
            }
            result = chooseEnd(value)
            expect(result).toBe(2)
          })
        })
        describe('IF plus de 50 ans => FIN3', () => {
          it('doit retourner 2', () => {
            value = {
              ...parameters,
              cough: true,
              ageRange: 'from_50_to_69',
              diarrhea: false,
              feverAlgo: false,
              soreThroatAches: false,
              agueusiaAnosmia: true,
              pronosticFactorsCount: 0,
              minorSeverityFactorsCount: 0
            }
            result = chooseEnd(value)
            expect(result).toBe(3)
          })
        })

        describe('IFNON => FIN3', () => {
          it('doit retourner 3', () => {
            value = {
              ...parameters,
              cough: true,
              diarrhea: false,
              feverAlgo: false,
              soreThroatAches: false,
              agueusiaAnosmia: true,
              pronosticFactorsCount: 0,
              minorSeverityFactorsCount: 1
            }
            result = chooseEnd(value)
            expect(result).toBe(3)
          })
        })
      })

      describe('IF >= 1 facteur de gravité mineur => FIN3', () => {
        it('doit retourner 4', () => {
          value = {
            ...parameters,
            cough: true,
            diarrhea: false,
            feverAlgo: false,
            soreThroatAches: false,
            agueusiaAnosmia: true,
            pronosticFactorsCount: 0,
            minorSeverityFactorsCount: 1
          }
          result = chooseEnd(value)
          expect(result).toBe(3)
        })
      })
    })

    describe('IF >= 1 facteurs pronostiques', () => {
      describe('IF < 2 facteur de gravité mineur => FIN3', () => {
        it('doit retourner 4', () => {
          value = {
            ...parameters,
            cough: true,
            diarrhea: false,
            feverAlgo: false,
            soreThroatAches: false,
            agueusiaAnosmia: true,
            pronosticFactorsCount: 1,
            minorSeverityFactorsCount: 1
          }
          result = chooseEnd(value)
          expect(result).toBe(3)
        })
      })

      describe('IF >= 2 facteurs de gravité mineurs => FIN4', () => {
        it('doit retourner 4', () => {
          value = {
            ...parameters,
            cough: true,
            diarrhea: false,
            feverAlgo: false,
            soreThroatAches: false,
            agueusiaAnosmia: true,
            pronosticFactorsCount: 1,
            minorSeverityFactorsCount: 2
          }
          result = chooseEnd(value)
          expect(result).toBe(4)
        })
      })
    })
  })

  describe('IF toux XOR douleurs XOR anosmie', () => {
    it('si cough est true \
doit retourner 2 ou 7', () => {
      value = {
        ...parameters,
        cough: true,
        soreThroatAches: false,
        agueusiaAnosmia: false
      }
      result = chooseEnd(value)
      expect(result === 7 || result === 2).toBeTruthy()
    })

    it('si soreThroatAches est true \
doit retourner 2 ou 7', () => {
      value = {
        ...parameters,
        cough: false,
        soreThroatAches: true,
        agueusiaAnosmia: false
      }
      result = chooseEnd(value)
      expect(result === 7 || result === 2).toBeTruthy()
    })

    it('si agueusiaAnosmia est true \
doit retourner 2 ou 7', () => {
      value = {
        ...parameters,
        cough: false,
        soreThroatAches: false,
        agueusiaAnosmia: true
      }
      result = chooseEnd(value)
      expect(result === 7 || result === 2).toBeTruthy()
    })

    describe('IF 0 facteur pronostique => FIN2', () => {
      it('doit retourner 2', () => {
        value = {
          ...parameters,
          cough: false,
          soreThroatAches: false,
          agueusiaAnosmia: true,
          pronosticFactorsCount: 0
        }
        result = chooseEnd(value)
        expect(result).toBe(2)
      })
    })

    describe('IF >= 1 facteurs pronostiques => FIN7', () => {
      it('doit retourner 7', () => {
        value = {
          ...parameters,
          cough: false,
          soreThroatAches: false,
          agueusiaAnosmia: true,
          pronosticFactorsCount: 1
        }
        result = chooseEnd(value)
        expect(result).toBe(7)
      })
    })
  })

  describe('IF NOT toux AND NOT douleurs AND NOT anosmie => FIN8', () => {
    it('doit retourner 8', () => {
      value = {
        ...parameters,
        cough: false,
        soreThroatAches: false,
        agueusiaAnosmia: false
      }
      result = chooseEnd(value)
      expect(result).toBe(8)
    })
  })
})
