#!/bin/bash
echo "▶️  Iniciando o processo de build..."

# 1. Limpa e recria a estrutura
echo "    - Limpando o diretório 'dist'..."
rm -rf dist
mkdir -p dist/assets
mkdir -p dist/policies

# 2. Copia os assets
echo "    - Copiando assets..."
cp -r assets/* dist/assets/

# 3. Processa o index.html da raiz
echo "    - Processando a página inicial..."
COMMIT_DATE=$(TZ="America/Sao_Paulo" git log -1 --format=%cI)
FORMATTED_DATE=$(date -d "$COMMIT_DATE" +'%d/%m/%Y')
sed "s|__LAST_UPDATED__|${FORMATTED_DATE}|g" index.html > dist/index.html

# 4. Processa TODAS as políticas dentro da pasta policies/
echo "    - Processando páginas de políticas..."
for file in policies/*.html; do
    echo "      - Processando $file"
    sed "s|__LAST_UPDATED__|${FORMATTED_DATE}|g" "$file" > "dist/$file"
done

echo "✅ Build concluído com sucesso!"
echo "   Abra a pasta 'dist' com o Live Server para visualizar."