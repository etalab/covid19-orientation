const {writeFileSync} = require('fs')
const {chain} = require('lodash')
const communes = require('@etalab/decoupage-administratif/data/communes.json')

const acceptedCodesPostaux = chain(communes)
  .filter(c => ['arrondissement-municipal', 'commune-actuelle'].includes(c.type) && c.codesPostaux)
  .map(c => c.codesPostaux.map(codePostal => ({...c, codePostal})))
  .flatten()
  .groupBy('codePostal')
  .mapValues(communes => {
    return communes.reduce((populationTotale, commune) => {
      if (commune.population) {
        return populationTotale + commune.population
      }

      return populationTotale
    }, 0)
  })
  .toPairs()
  .filter(([, populationTotale]) => populationTotale > 10000)
  .map(([codePostal]) => codePostal)
  .value()

writeFileSync('accepted-codes-postaux.json', JSON.stringify(acceptedCodesPostaux, null, 2))

console.log('Terminé')
