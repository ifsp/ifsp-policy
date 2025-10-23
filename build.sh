#!/bin/bash
echo "▶️  Iniciando o processo de build..."

# 1. Limpa e recria a estrutura
echo "    - Limpando o diretório 'dist'..."
rm -rf dist
mkdir -p dist/assets
mkdir -p dist/policies
mkdir -p dist/_includes

# 2. Copia os assets e includes
echo "    - Copiando arquivos estáticos..."
cp -r assets/* dist/assets/
cp -r _includes/* dist/_includes/

# 3. Processa a página inicial (index.html)
echo "    - Processando a página inicial..."
# A página inicial usa a data do último commit do REPOSITÓRIO INTEIRO
COMMIT_DATE_REPO=$(TZ="America/Sao_Paulo" git log -1 --format=%cI)
FORMATTED_DATE_REPO=$(date -d "$COMMIT_DATE_REPO" +'%d/%m/%Y')
sed "s|__LAST_UPDATED__|${FORMATTED_DATE_REPO}|g" index.html > dist/index.html

# 4. Processa CADA política individualmente
echo "    - Processando páginas de políticas..."
for file in policies/*.html; do
    echo "      - Processando $file"
    # Pega a data do último commit DESTE ARQUIVO ESPECÍFICO
    COMMIT_DATE_FILE=$(TZ="America/Sao_Paulo" git log -1 --format=%cI -- "$file")
    FORMATTED_DATE_FILE=$(date -d "$COMMIT_DATE_FILE" +'%d/%m/%Y')
    
    # Substitui o placeholder no arquivo e salva o resultado em dist/
    sed "s|__LAST_UPDATED__|${FORMATTED_DATE_FILE}|g" "$file" > "dist/$file"
done

echo "✅ Build concluído com sucesso!"
echo "   Abra a pasta 'dist' com o Live Server para visualizar."