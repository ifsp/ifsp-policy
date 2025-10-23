#!/bin/bash
echo "▶️  Iniciando o processo de build..."

# 1. Limpa e recria a estrutura
echo "    - Limpando o diretório 'dist'..."
rm -rf dist
mkdir -p dist/assets
mkdir -p dist/policies

# 2. Copia os assets
echo "    - Copiando arquivos estáticos..."
cp -r assets/* dist/assets/

# 3. Copia as páginas HTML
echo "    - Copiando páginas HTML..."
cp index.html dist/
cp -r policies/* dist/policies/

echo "✅ Build concluído com sucesso!"
echo "   Abra a pasta 'dist' com o Live Server para visualizar."