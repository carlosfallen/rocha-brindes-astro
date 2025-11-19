#!/bin/bash

# Interrompe o script caso algum comando dê erro
set -e

echo "==> Rodando build do projeto..."
npm run build

echo "==> Realizando deploy do Firebase Hosting (rocha-brindes)..."
firebase deploy --only hosting:rocha-brindes

echo "==> Preparando commit..."
git add .

# Se nenhum argumento for passado, usa uma mensagem padrão
COMMIT_MSG=${1:-"Atualização automática via deploy.sh"}

echo "==> Criando commit: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# branch atual
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "==> Enviando para o branch remoto: $BRANCH"
git push origin "$BRANCH"

echo "==> Processo concluído com sucesso!"
