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
awk '
BEGIN { in_footer = 0; printed_content = 0 }
/<footer id="footer-placeholder">/ { 
    in_footer = 1; 
    print "<footer id=\"footer-placeholder\">"; 
    system("cat temp_footer.html"); 
    printed_content = 1; 
    next 
}
/<\/footer>/ { 
    if (in_footer && printed_content) { 
        print "</footer>"; 
        in_footer = 0; 
        next 
    } 
}
!in_footer { print }
' dist/index.html > dist/index_temp.html && mv dist/index_temp.html dist/index.html

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
    awk '
    BEGIN { in_footer = 0; printed_content = 0 }
    /<footer id="footer-placeholder">/ || /<footer id="footer-placeholder" role="contentinfo" aria-label="Informações institucionais e direitos autorais">/ { 
        in_footer = 1; 
        print gensub(/(<footer[^>]*>).*/, "\\1", "g"); 
        system("cat temp_footer.html"); 
        printed_content = 1; 
        next 
    }
    /<\/footer>/ { 
        if (in_footer && printed_content) { 
            print "</footer>"; 
            in_footer = 0; 
            next 
        } 
    }
    !in_footer { print }
    ' "dist/$file" > "dist/${file}_temp" && mv "dist/${file}_temp" "dist/$file"
done

# Limpa o arquivo temporário
rm temp_footer.html

echo "✅ Build concluído com sucesso!"
echo "   Abra a pasta 'dist' com o Live Server para visualizar."