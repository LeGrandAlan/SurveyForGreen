# Design4Green
Ce projet a été réalisé lors du hackathon Design4Green 2018 en 48h.

Nous avions très peu de temps pour développé ce projet, c'est pour cela qu'il n'y a quasiment aucun commentaire et que les messages de commit ne sont des fois pas très explicite.

## Description
### Design4Green
Le Design4Green est un hackathon international de développement greenIT organisé par l'école d'ingénieur ESAIP à Angers(49).

Le but de ce challenge est de développé un site web ayant l'impact carbone le plus faible tout en aillant une interface attractive et ergonomique pour les utilisateurs.

Le Design4Green est ouvert aux étudiants ainsi qu'aux professionnels.

### Le sujet
Le sujet de cette année portait sur la création d'un site formulaire qui permettrait de récolter les réponses des utilisateurs aux questions fournis par les organisateurs.

## Solution adoptée
### Serveur
Nous avons développé le serveur en Node.js, ce qui permet au site d'être très vite opérationnel, de consommer peu de mémoire et d'être très rapide.

Nous avons utilisé la libraire Node.js "zlib" qui nous à permis de compresser les données de la page lors de l'envoi au client. Ce qui nous a permis de réduire la charge sur la bande passante.
### Client
Pour la partie client, nous avons simplement développé une interface en HTML et CSS, mais nous avons aussi utiliser du JavaScript pour les interactions avec l'utilisateur ainsi que pour charger les composants HTML avec les valeurs du questionnaire. Grâce au JavaScript, nous avons pu créer dynamiquement les éléments HTML ce qui nous a permis de réduire la taille de la page transmise par le serveur.

Nous avons aussi utilisé le JS pour stocker sous forme de JSON les questions, les réponses possibles ainsi que leurs types (cf. capture "Extrait du JSON").

## Deploiement
Voici les instructions pour déployer notre solution :

### Prérequis
- Avoir Node.js (solution développée sous Node.js 10 et toujours opérationnel sous Node.js 13)

### Lancement du serveur
1. Ce rendre dans le dossier du projet
2. Executer le fichier serveur.js (sous linux `./serveur.js`)

### Accerder au site
Pour accéder au site, il faut ouvrir votre navigateur et se rendre à l'adresse `localhost:8080`

## Résultats
### Résultats du hackaton
Notre équipe a fini dans les 11 premiers (pas d'ordre donné pour les 11 premiers sauf pour les équipes sur le podium).

### Score Eco Index
Nous avons obtenu un score Eco Index de 95/100.

### Captures de la solution

- Première interface
![Première interface](https://uncloud.univ-nantes.fr/index.php/s/eiAHQ24Tbf5bLzb/download)

- Une question du formulaire
![Une question du formulaire](https://uncloud.univ-nantes.fr/index.php/s/ZXsrgm4xLNW6MtG/download)

- Une question du formulaire
![Une question du formulaire](https://uncloud.univ-nantes.fr/index.php/s/qgEqBMez92B8B6C/download)

- Interface finale
![Interface finale](https://uncloud.univ-nantes.fr/index.php/s/MA8e8ZXPAfCAzd2/download)


- Extrait du JSON
![Extrait du JSON](https://uncloud.univ-nantes.fr/index.php/s/T9F6ac3gYk5yfsT/download)

## Contributeurs
- Alban Moizan
- Erwan Launay
- Alan Le Grand
- Étienne Lécrivain

## Liens
[Design4Green](https://design4green.org/)

[Sujet 2018](https://uncloud.univ-nantes.fr/index.php/s/GAznKA9ykcGxDjP/download)

## Licence
Ce projet est sous licence GNU AGPLv3.
