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

# 3. Processa a página inicial (index.html)
echo "    - Processando a página inicial..."
# A página inicial usa a data do último commit do REPOSITÓRIO INTEIRO
COMMIT_DATE_REPO=$(TZ="America/Sao_Paulo" git log -1 --format=%cI)
FORMATTED_DATE_REPO=$(date -d "$COMMIT_DATE_REPO" +'%d/%m/%Y')

# Processa o footer com a data do repositório
sed "s|__LAST_UPDATED__|${FORMATTED_DATE_REPO}|g" includes/footer.html > temp_footer.html

# Substitui o footer placeholder pelo conteúdo processado
cp index.html dist/index.html
sed -i '/<footer id="footer-placeholder">/{
    r temp_footer.html
    d
}' dist/index.html
sed -i '/^ *<\/footer> *$/d' dist/index.html

# 4. Processa CADA política individualmente
echo "    - Processando páginas de políticas..."
for file in policies/*.html; do
    echo "      - Processando $file"
    # Pega a data do último commit DESTE ARQUIVO ESPECÍFICO
    COMMIT_DATE_FILE=$(TZ="America/Sao_Paulo" git log -1 --format=%cI -- "$file")
    FORMATTED_DATE_FILE=$(date -d "$COMMIT_DATE_FILE" +'%d/%m/%Y')

    # Processa o footer com a data específica do arquivo
    sed "s|__LAST_UPDATED__|${FORMATTED_DATE_FILE}|g" includes/footer.html > temp_footer.html

    # Copia o arquivo e substitui o footer placeholder
    cp "$file" "dist/$file"
    sed -i '/<footer id="footer-placeholder">/{
        r temp_footer.html
        d
    }' "dist/$file"
    sed -i '/^ *<\/footer> *$/d' "dist/$file"

    # Handle the workstation.html case with additional attributes
    if [[ "$file" == "policies/workstation.html" ]]; then
        sed -i 's|<div class="footer-container|<footer role="contentinfo" aria-label="Informações institucionais e direitos autorais"><div class="footer-container|g' "dist/$file"
        sed -i 's|</div>$|</div></footer>|g' "dist/$file"
    fi
done

# Limpa o arquivo temporário
rm temp_footer.html

echo "✅ Build concluído com sucesso!"
echo "   Abra a pasta 'dist' com o Live Server para visualizar."