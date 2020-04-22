export const getCarreTailleMetre = heightCentimeters => {
  const parseToNumber = parseInt(heightCentimeters, 10)
  const taillEnMetre = parseToNumber / 100
  const carreDeLaTaille = taillEnMetre ** 2
  return carreDeLaTaille
}

export const getPoidsKilo = weightKilos => {
  return parseInt(weightKilos, 10)
}

export const getRapportPoidsTailleIMC = (poidsKilos, carreTailleMetre) => {
  return poidsKilos / carreTailleMetre
}

export const getRoundedIMC = rapportIMC => {
  // Rounded IMC at 1 decimal
  return Math.round(rapportIMC * 10) / 10
}

const computeIMC = (weightKilos, heightCentimeters) => {
  const kilos = getPoidsKilo(weightKilos)
  const metreCarre = getCarreTailleMetre(heightCentimeters)
  const rapportIMC = getRapportPoidsTailleIMC(kilos, metreCarre)
  return getRoundedIMC(rapportIMC)
}

export default computeIMC
