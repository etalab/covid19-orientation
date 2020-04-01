"use strict";

/* Polyfill pour Element.closest */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

function debug() {
  var _console; // Commenter la ligne suivante pour désactiver les logs

  (_console = console).info.apply(_console, arguments);
}

document.querySelectorAll("input[data-check-number]").forEach(function(element) {
  var min = parseFloat(element.dataset.checkNumberMin);
  var max = parseFloat(element.dataset.checkNumberMax);
  element.addEventListener("input", function(event) {
    var v = parseFloat(element.value);
    console.log(min, max, v);

    if (v === "NaN" || v < min || v > max) {
      element.setCustomValidity(element.dataset.checkNumberError);
    } else {
      element.setCustomValidity("");
    }
  });
});
/* ==========================================================================
   Variables
   ========================================================================== */

var stepLinks = document.querySelectorAll("#parcours .card a");
var symptomesCount = 0;
var facteurGraviteMineur = 0;
var facteurGraviteMajeur = 0;
var facteurPronostic = 0;
var symptomes = {
  fievre: false,
  toux: false,
  malDeGorge: false,
  diarrhee: false,
  anosmie: false
};
var age = 0;
var poids = 0;
var taille = 0;
var imc = 0;
var conseils;
/* ==========================================================================
   Interactions parcours
   ========================================================================== */
// Lire le lien sur lequel on clique, prendre les data éventuelles puis avancer à la prochaine étape et démasquer le bloc ciblé

function grabDataAndGoToLink(stepLink) {
  function setSymptome(key) {
    var dataKey = key.toLowerCase();

    if (dataKey in stepLink.dataset && stepLink.dataset[dataKey] === "1") {
      symptomes[key] = true;
    }
  }

  function getDataAsInt(key) {
    return key in stepLink.dataset ? parseInt(stepLink.dataset[key]) : 0;
  }

  var destination = stepLink.attributes["href"].value;
  stepLink.addEventListener("click", function(event) {
    stepLink.classList.toggle("active");
    symptomesCount += getDataAsInt("symptome");
    facteurGraviteMineur += getDataAsInt("facteurgravitemineur");
    facteurGraviteMajeur += getDataAsInt("facteurgravitemajeur");
    setSymptome("fievre");
    setSymptome("malDeGorge");
    setSymptome("toux");
    setSymptome("anosmie");
    setSymptome("diarrhee");
    facteurPronostic += getDataAsInt("facteurpronostic");

    if ("age" in stepLink.dataset) {
      age = parseInt(stepLink.dataset.age);

      if (age >= 70) {
        facteurPronostic++;
        debug(facteurPronostic + " Facteur(s) de pronostic défavorable(s)");
      }

      debug(age + " an(s)");
    }

    debug({
      count: symptomesCount,
      facteurGraviteMineur: facteurGraviteMineur,
      facteurGraviteMajeur: facteurGraviteMajeur,
      symptomes: symptomes,
      facteurPronostic: facteurPronostic,
      age: age,
      poids: poids,
      taille: taille,
      imc: imc
    });

    if (destination == "#message-fin") {
      // Si la destination est le message de fin on execute la fonction pour évaluer les conseils et la gravité
      var fin = messageFinal();
      debug("message fin", fin);
      stepLink.href = "#message-fin-" + fin;
      document.getElementById("message-fin-" + fin).classList.remove("hidden-block");
    } else {
      // Si la destination n'est pas le message de fin, on affiche la destination
      document.querySelector(destination).classList.remove("hidden-block");
    }

    stepLink.closest(".step").classList.add("hidden-block");
    event.preventDefault();
  });
} //Récupérer le poids et la taille à la soumission du form

document.getElementById("form-imc").addEventListener("submit", function(event) {
  // récupérer convertir les virgules en point décimal et transformer en float
  taille = parseFloat(document.getElementById("add-taille").value.replace(",", "."));
  poids = parseFloat(document.getElementById("add-poids").value.replace(",", "."));
  debug(taille + " m / " + poids + " kg");
  computeIMC(taille, poids); // faire apparaitre la suite

  document
    .getElementById("form-imc")
    .closest(".step")
    .classList.add("hidden-block");
  document.getElementById("fievre-01").classList.remove("hidden-block");
  event.preventDefault();
}); //calcul IMC

function computeIMC(taille, poids) {
  imc = poids / Math.pow(taille, 2);
  debug("IMC = " + imc);

  if (imc >= 30) {
    facteurPronostic++;
    debug("facteur de pronostic défavorable lié à l'IMC");
  } else {
    debug("pas de facteur de pronostic dévaforable lié à l'IMC");
  }
}
/* ==========================================================================
   Messages de fin
   ========================================================================== */
// définir le message de conseil final

function messageFinal() {
  if (age < 15) {
    debug("Moins de 15 ans, fin 1");
    return 1;
  } else if (facteurGraviteMajeur >= 1) {
    debug("Facteur de gravité majeur, fin 5");
    return 5;
  } else if (symptomes.fievre && symptomes.toux) {
    debug("Fièvre + toux");
    if (facteurPronostic == 0) {
      debug("Sans facteur de pronostic défavorable");
      return 6;
    } else {
      debug("Avec facteur de pronostic défavorable");
      if (facteurGraviteMineur <= 1) {
        debug("et moins de 2 facteurs de gravité mineurs, fin 6");
        return 6;
      } else {
        debug("et plus de 1 facteur de gravité mineur, fin 4");
        return 4;
      }
    }
  } else if (symptomes.fievre || (!symptomes.fievre && (symptomes.diarrhee || (symptomes.toux && (symptomes.malDeGorge || symptomes.anosmie))))) {
    debug("Fièvre, ou pas de fièvre mais diarrhée, ou pas de fièvre et toux + mal de gorge, ou pas de fièvre et toux + anosmie");
    if (facteurPronostic == 0) {
      debug("Sans facteur de pronostic défavorable");
      if (facteurGraviteMineur == 0) {
        debug("Sans facteur de gravité mineur");
        if (age < 50) {
          debug("et moins de 50 ans, fin 2");
          return 2;
        } else {
          debug("et plus de 50 ans, fin 3");
          return 3;
        }
      } else {
        debug("Avec facteur de gravité mineur, fin 3");
        return 3;
      }
    } else {
      debug("Avec facteur de pronostic défavorable");
      if (facteurGraviteMineur < 2) {
        debug("et moins de 2 facteurs de gravité mineurs, fin 3");
        return 3;
      } else {
        debug("et plus de 2 facteurs de gravité mineurs, fin 4");
        return 4;
      }
    }
  } else if (symptomes.toux || symptomes.malDeGorge || symptomes.anosmie) {
    debug("Toux ou mal de gorge ou anosmie");

    if (facteurPronostic == 0) {
      debug("sans facteur de pronostic défavorable, fin 2");
      return 2;
    } else {
      debug("avec facteur de pronostic défavorable, fin 7");
      return 7;
    }
  } else if (symptomes.toux == 0 && symptomes.malDeGorge == 0 && symptomes.anosmie == 0) {
    debug("Absence de fièvre, toux, mal de gorge ou anosmie, fin 9");
    return 8;
  }

  debug("Solution par défaut, pas de solution (= problème)");
  return;
}

stepLinks.forEach(grabDataAndGoToLink);
