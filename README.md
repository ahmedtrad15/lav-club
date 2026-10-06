# LAV CLUB — site web

Boutique en ligne du pressing LAV CLUB (68 Av. Salah Ben Youssef, Tunis) : le client choisit ses articles, planifie le ramassage et envoie sa commande sur WhatsApp. Le cahier des charges est dans [PROJECT_BRIEF.md](PROJECT_BRIEF.md).

## Voir le site

Aucune installation : ouvrez `index.html` dans un navigateur. Pour le mettre en ligne, déposez le dossier tel quel sur n'importe quel hébergement statique (Netlify, Vercel, GitHub Pages…).

## Modifier les prix et les réglages

Tout est dans [`assets/js/data.js`](assets/js/data.js) :

- `GROUPS` : la liste des articles et leurs prix (`from: true` = prix « dès »).
- `BRIDAL` : la robe de mariée.
- `CONFIG` : téléphone, e-mail de réception des commandes (`orderEmail`, vide = bouton e-mail masqué), frais de livraison, remises, option express, créneaux, quartiers desservis, jours sans livraison.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | La page |
| `assets/css/style.css` | Styles et animations |
| `assets/js/data.js` | Catalogue et réglages |
| `assets/js/pricing.js` | Calcul du total, remises, dates de ramassage et de livraison |
| `assets/js/icons.js` | Icônes des articles |
| `assets/js/app.js` | Boutique, panier, commande |

## Tests

```sh
node --test tests/*.test.js
```
