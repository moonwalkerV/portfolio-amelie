# Déployer le portfolio — séparé de moonwalkervision

Ces 3 fichiers (`index.html`, `style.css`, `script.js`) forment un site autonome, indépendant du repo moonwalkervision. Voici comment le mettre en ligne gratuitement.

## 1. Créer le nouveau repo GitHub

1. Va sur [github.com/new](https://github.com/new)
2. Nom du repo : `portfolio-amelie` (ou ce que tu préfères)
3. Laisse-le **vide** (pas de README auto-généré)
4. Clique "Create repository"

## 2. Pousser les fichiers

Dans VS Code, ouvre un nouveau dossier (séparé du dossier moonwalkervision) et copie les 3 fichiers dedans. Puis dans le terminal :

```bash
cd chemin/vers/portfolio-amelie
git init
git add .
git commit -m "Premier jet du portfolio"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/portfolio-amelie.git
git push -u origin main
```

(Remplace `TON-USERNAME` par ton pseudo GitHub.)

## 3. Connecter à Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe le repo `portfolio-amelie` que tu viens de créer
3. Aucune configuration nécessaire (site statique) — clique "Deploy"
4. Vercel te donne une URL du type `portfolio-amelie.vercel.app`

C'est tout — site en ligne, gratuit, complètement détaché de moonwalkervision.fr (repo différent, projet Vercel différent).

## 4. Prochaines retouches

Pour remplacer les placeholders par du vrai contenu :

- **Photo** : remplace les blocs `.bio-photo` / `.about-photo` (actuellement des dégradés avec initiales) par une vraie `<img>` — demande-moi le prompt si tu veux que je m'en occupe avec toi.
- **Projets** : dans `index.html`, section `<section class="work" id="work">`, remplace les 3 cartes "Nom du projet" par tes vrais projets (titre, catégorie, et idéalement une capture d'écran en fond de `.work-thumb` au lieu du dégradé uni).
- **Outils** : dans `script.js`, modifie le tableau `tools` avec tes vrais outils.
- **Nom de domaine perso** (optionnel, ~10-15€/an) : dans Vercel → Settings → Domains, tu peux ajouter un domaine acheté séparément (ex: chez Namecheap ou OVH) à la place du `.vercel.app`.

## 5. Si tu veux que je continue à itérer

Donne-moi l'URL Vercel une fois en ligne (ou dis-moi juste "continue") et je pourrai te proposer des prompts précis pour Claude Code à chaque retouche, exactement comme pour moonwalkervision.
