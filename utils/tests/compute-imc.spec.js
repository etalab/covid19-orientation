import computeIMC, {
  getCarreTailleMetre,
  getPoidsKilo,
  getRapportPoidsTailleIMC,
  getRoundedIMC
} from '../compute-imc'

describe('utils | compute-imc', () => {
  describe('getCarreTailleMetre', () => {
    it('si la taille est de 172cm (number) \
doit retourner 5184', () => {
      const result = getCarreTailleMetre(172)
      const expected = (172 / 100) ** 2
      expect(result).toBe(expected)
    })

    it('si la taille est de 100cm (string) \
doit retourner 5184', () => {
      const result = getCarreTailleMetre('172')
      const expected = (172 / 100) ** 2
      expect(result).toBe(expected)
    })

    it('si la taille n’est pas un number ou une string doit retourner NaN', () => {
      let result = getCarreTailleMetre({})
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(true)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(undefined)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(null)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre('undefined')
      expect(result).toBe(NaN)
    })
  })

  describe('getPoidsKilo', () => {
    it('si le poids est de 65kg (number) \
doit retourner 65k', () => {
      const result = getPoidsKilo(65)
      expect(result).toBe(65)
    })

    it('si le poids est de 65kg (string) \
    doit retourner 65k', () => {
      const result = getPoidsKilo('65')
      expect(result).toBe(65)
    })

    it('si le poids n’est pas un number ou une string doit retourner NaN', () => {
      let result = getCarreTailleMetre({})
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(true)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(undefined)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre(null)
      expect(result).toBe(NaN)
      result = getCarreTailleMetre('undefined')
      expect(result).toBe(NaN)
    })
  })

  describe('getRapportPoidsTailleIMC', () => {
    it('si le poids et la taille(2) sont 50 et 200cm \
doit retourner 12.5', () => {
      const carreTaille = 2 ** 2 // => 4
      const result = getRapportPoidsTailleIMC(50, carreTaille)
      expect(result).toBe(12.5)
    })

    it('si taille est une string sans décimale \
doit retourner 12.5', () => {
      const carreTaille = '2' ** 2 // => 4
      const result = getRapportPoidsTailleIMC(50, carreTaille)
      expect(result).toBe(12.5)
    })

    it('si le poids, taille ne sont pas de 50kg et 200cm \
doit retourner 8.680555555555555', () => {
      const carreTaille = 2.4 ** 2 // => 5.76
      const result = getRapportPoidsTailleIMC(50, carreTaille)
      expect(result).toBe(8.680555555555555)
    })

    it('si taille est une string avec flottant \
doit retourner 8.680555555555555', () => {
      const carreTaille = '2.4' ** 2 // => 5.76
      const result = getRapportPoidsTailleIMC(50, carreTaille)
      expect(result).toBe(8.680555555555555)
    })

    it('si taille est une string avec décimale \
doit retourner NaN', () => {
      const carreTaille = '2,4' ** 2 // => NaN
      const result = getRapportPoidsTailleIMC(50, carreTaille)
      expect(result).toBe(NaN)
    })

    it('si le poids et/ou la taille ne sont pas un number \
doit retourner NaN', () => {
      let result = getRapportPoidsTailleIMC({}, 172)
      expect(result).toBe(NaN)
      result = getRapportPoidsTailleIMC(65, {})
      expect(result).toBe(NaN)
      result = getRapportPoidsTailleIMC(null, {})
      expect(result).toBe(NaN)
      result = getRapportPoidsTailleIMC(null, 'toto')
      expect(result).toBe(NaN)
    })
  })

  describe('getRoundedIMC', () => {
    it('doit retourner un chiffre arrondi a la dizaine', () => {
      const result = getRoundedIMC(1.423456)
      expect(result).toBe(1.4)
    })

    it('doit retourner un chiffre arrondi a la dizaine', () => {
      const result = getRoundedIMC(1.483456)
      expect(result).toBe(1.5)
    })

    it('doit retourner un chiffre arrondi a la dizaine', () => {
      const result = getRoundedIMC(1.456789)
      expect(result).toBe(1.5)
    })

    it('doit retourner un chiffre arrondi a la dizaine', () => {
      const result = getRoundedIMC(1)
      expect(result).toBe(1)
    })
  })

  describe('computeIMC', () => {
    it('si les parametres sont des nombres \
doit retourner une valeur de type number', () => {
      const result = computeIMC(1, 1)
      expect(typeof result === 'number').toBeTruthy()
    })

    it('si les parametres sont des chaines de caracteres \
doit retourner une valeur de type number', () => {
      const result = computeIMC('1', '1')
      expect(typeof result === 'number').toBeTruthy()
    })

    it('si le poids et/ou la taille ne sont pas un number ou une string \
doit retourner NaN', () => {
      let result = computeIMC({}, 172)
      expect(result).toBe(NaN)
      result = computeIMC(65, {})
      expect(result).toBe(NaN)
      result = computeIMC(null, {})
      expect(result).toBe(NaN)
    })

    it('si poids est 65kg et taille 172cm \
doit retourner 22', () => {
      const result = computeIMC(65, 172)
      expect(result).toBe(22)
    })

    it('si poids est 65kg et taille 170cm \
doit retourner 22.5', () => {
      const result = computeIMC(65, 170)
      expect(result).toBe(22.5)
    })
  })
})
