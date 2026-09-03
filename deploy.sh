#!/usr/bin/env bash
#
# Build le site (Tailwind + Eleventy) puis le déploie en FTP.
# Usage : ./deploy.sh   (ou : yarn deploy)
#
# Les identifiants sont lus depuis .ftp.env (gitignoré) ou l'environnement.
# Voir .ftp.env.example pour le modèle.
#
set -euo pipefail
cd "$(dirname "$0")"

# --- Identifiants ---------------------------------------------------------
if [ -f ".ftp.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source .ftp.env
  set +a
fi

: "${FTP_HOST:?Definir FTP_HOST (dans .ftp.env ou une variable env)}"
: "${FTP_USER:?Définis FTP_USER}"
: "${FTP_PASS:?Définis FTP_PASS}"
# Chez Free.fr la racine web EST la racine FTP → FTP_DIR="/"
FTP_DIR="${FTP_DIR:-/}"

command -v lftp >/dev/null 2>&1 || {
  echo "Erreur : lftp introuvable. Installe-le avec : brew install lftp" >&2
  exit 1
}

# --- Vérif Node (eleventy-img requiert Node >= 20, voir .nvmrc) -----------
# On n'impose rien : on utilise le Node courant de ton shell. On échoue juste
# avec un message clair s'il est trop ancien (plutôt qu'une erreur eleventy-img).
node_major="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
if [ "${node_major:-0}" -lt 20 ]; then
  echo "Erreur : Node >= 20 requis (actuel : $(node -v)). Fais 'nvm use' puis relance." >&2
  exit 1
fi

# --- Build ----------------------------------------------------------------
echo "==> Build (Tailwind + Eleventy)"
yarn build

# --- Déploiement ----------------------------------------------------------
echo "==> Déploiement FTP vers ${FTP_HOST}:${FTP_DIR}"
lftp -c "
set ftp:ssl-allow true;
set ssl:verify-certificate no;
set ftp:use-site-chmod no;
open -u '${FTP_USER}','${FTP_PASS}' '${FTP_HOST}';
mirror --reverse --delete --verbose --parallel=4 --no-perms --exclude-glob .DS_Store --exclude old/ _site/ '${FTP_DIR}';
"

echo "==> Terminé ✅"
