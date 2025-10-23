document.addEventListener("DOMContentLoaded", function() {
    // --- Lógica para Carregar Componentes HTML ---
    const loadComponent = (selector, url) => {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro ao carregar o componente: ${url}`);
                    }
                    return response.text();
                })
                .then(data => {
                    // Substitui o conteúdo do seletor pelo HTML carregado
                    document.querySelector(selector).innerHTML = data;
                    resolve();
                })
                .catch(error => {
                    console.error(error);
                    reject(error);
                });
        });
    };

    // Carrega o rodapé no elemento com id="footer-placeholder"
    loadComponent("#footer-placeholder", "../../_includes/footer.html").then(() => {
        // Após carregar o footer, substitui a data se houver
        const footerPlaceholder = document.getElementById('footer-placeholder');
        const lastUpdatedDate = footerPlaceholder ? footerPlaceholder.getAttribute('data-last-updated') : null;

        if (lastUpdatedDate) {
            const copyrightLine = document.querySelector('.copyright-line');
            if (copyrightLine && copyrightLine.textContent.includes('__LAST_UPDATED__')) {
                copyrightLine.innerHTML = copyrightLine.innerHTML.replace('__LAST_UPDATED__', lastUpdatedDate);
            }
        }
    });

});