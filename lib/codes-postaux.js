const acceptedCodesPostaux = require('../accepted-codes-postaux.json')

function anonymize(codePostal) {
  // Invalide. On ignore
  if (!codePostal.match(/\d{5}/)) {
    return
  }

  // Invalide. On ignore
  if (codePostal.startsWith('00') || codePostal.startsWith('99')) {
    return
  }

  // Code postal avec population suffisante. On garde
  if (acceptedCodesPostaux.includes(codePostal)) {
    return codePostal
  }

  // Code postal avec population insuffisante. On tronque au département (cas des DROM et certaines COM)
  if (codePostal.startsWith('97')) {
    return codePostal.slice(0, 3) + 'XX'
  }

  // Code postal avec population insuffisante. On tronque au département (France métropolitaine, COM)
  return codePostal.slice(0, 2) + 'XXX'
}

module.exports = {anonymize}
