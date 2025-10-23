#!/bin/bash

# -- Script para gerar uma versão de produção do site localmente --

echo "▶️  Iniciando o processo de build..."

# 1. Limpa a pasta de build antiga e recria a estrutura
echo "    - Limpando o diretório 'dist'..."
rm -rf dist
mkdir -p dist/assets

# 2. Copia todos os assets (CSS, JS, Imagens) para a pasta 'dist'
echo "    - Copiando assets..."
cp -r assets/* dist/assets/

# 3. Pega a data do último commit e formata
echo "    - Obtendo a data da última atualização..."
COMMIT_DATE=$(TZ="America/Sao_Paulo" git log -1 --format=%cI)
FORMATTED_DATE=$(date -d "$COMMIT_DATE" +'%d/%m/%Y')
echo "    - Data encontrada: ${FORMATTED_DATE}"

# 4. Lê o index.html, substitui o placeholder pela data e salva o resultado em dist/index.html
echo "    - Injetando data no index.html..."
sed "s|__LAST_UPDATED__|${FORMATTED_DATE}|g" index.html > dist/index.html

echo "✅ Build concluído com sucesso!"
echo "   Agora, abra a pasta 'dist' com o Live Server para visualizar o resultado."