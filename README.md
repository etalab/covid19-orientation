## Application d'orientation COVID19

Ce dépôt contient l'application d'orientation COVID19 développé par la [Direction interministérielle du numérique](https://www.numerique.gouv.fr/).

L'application elle-même est destinée à être publiée sur une page du site [https://www.gouvernement.fr](www.gouvernement.fr).

L'implémentation proposée est conforme à la version `2020-04-29` de la [documentation](https://delegation-numerique-en-sante.github.io/covid19-algorithme-orientation/) publiée par le ministère des Solidarités et de la Santé pour l'algorithme d'orientation COVID19.

## Contributions

Vos remarques et contributions sont les bienvenues. Vous pouvez pour cela [ouvrir un ticket](https://github.com/etalab/covid19-orientation/issues).

### Contributeurs et remerciements

Première version :

- Benoit Frattini
- David Vigier
- Julien Dubedout
- Nicolas Mathieu

Seconde version :

- Bastien Guerry
- Cédric Famibelle-Pronzola
- Guillaume Ory
- Jérôme Desboeufs
- Julien Bouquillon
- Théophile Merlière

Merci à :

- Missak Kéloglanian
- Renaud Chaput
- Soizic Pénicaud

## Tester sur sa machine

    ~$ git clone https://github.com/etalab/covid19-orientation.git
    ~$ cd covid19-orientation/
    ~$ yarn install
    ~$ yarn dev
    ~$ xdg-open http://localhost:3000

## Lancer les tests unitaires

L'application utilise la librairie [Jest](https://jestjs.io/) pour l'écriture des tests unitaires.

Les fichiers de tests doivent être placés dans un dossier nommé `tests` adjacent au fichier qui doit être testé et doit porter l'extension `.spec.js(x)`.

**Commande pour lancer l'ensemble des tests unitaires**

```bash
yarn test
```

**Commande pour lancer les tests unitaires sur les fichiers modifiés depuis le dernier commit en mode watch durant l'écriture des tests**

```bash
yarn test --watch
# utiliser l'option --watchAll pour lancer sur l'ensemble des fichiers
```

## Licence

Le dépôt est publié sous [licence MIT](LICENSE).

Les auteurs sont l'[Agence du Numérique de la Sécurité civile](https://www.interieur.gouv.fr/Le-ministere/Securite-civile), la [Direction interministérielle du numérique](https://www.numerique.gouv.fr/) et l'ensemble des contributeurs du dépôt.

Les questions, réponses et messages d'orientation présentés à l'utilisateur sont publiés sous [licence Ouverte 2.0](https://spdx.org/licenses/etalab-2.0.html) via [le dépôt de documentation](https://github.com/Delegation-numerique-en-sante/covid19-algorithme-orientation/) de l'algorithme.
