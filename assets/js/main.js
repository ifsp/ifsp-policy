document.addEventListener("DOMContentLoaded", function() {
    // --- Lógica para Carregar Componentes HTML ---
    const loadComponent = (selector, url) => {
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
            })
            .catch(error => console.error(error));
    };

    // Carrega o rodapé no elemento com id="footer-placeholder"
    loadComponent("#footer-placeholder", "../_includes/footer.html");

});