document.addEventListener("DOMContentLoaded", function() {
    // Footer is now embedded directly in HTML during build process
    // No dynamic loading needed

    // Navigation dropdown functionality
    const dropdownBtn = document.querySelector('.nav-dropdown-btn');
    const dropdownContent = document.querySelector('.nav-dropdown-content');

    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle dropdown
            this.setAttribute('aria-expanded', !isExpanded);
            dropdownContent.setAttribute('aria-hidden', isExpanded);

            // Close dropdown when clicking outside
            if (!isExpanded) {
                document.addEventListener('click', closeDropdownOnClickOutside);
            }
        });

        function closeDropdownOnClickOutside(e) {
            if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownContent.setAttribute('aria-hidden', 'true');
                document.removeEventListener('click', closeDropdownOnClickOutside);
            }
        }

        // Close dropdown on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && dropdownBtn.getAttribute('aria-expanded') === 'true') {
                dropdownBtn.setAttribute('aria-expanded', 'false');
                dropdownContent.setAttribute('aria-hidden', 'true');
                document.removeEventListener('click', closeDropdownOnClickOutside);
            }
        });
    }

    // Global search functionality (only on main page)
    const globalSearchInput = document.getElementById('globalSearchInput');
    const globalSearchResults = document.getElementById('globalSearchResults');
    const searchResultsList = document.getElementById('searchResultsList');
    const globalNoResultsMessage = document.getElementById('globalNoResultsMessage');

    if (globalSearchInput && globalSearchResults) {
        // Search index containing all policy content
        const searchIndex = [
            {
                title: "Política de Uso de Inteligência Artificial",
                url: "policies/ia.html",
                icon: "🤖",
                content: [
                    "Para quem vale esta Política? A política vale para TODA a comunidade do IFSP. Isso inclui servidores (docentes e TAEs), estudantes, pesquisadores, estagiários, colaboradores e até funcionários de empresas prestadoras de serviço que usam os recursos de TI da instituição.",
                    "Se a IA gerar uma informação errada ou com \"alucinação\", a culpa é dela? NÃO. A responsabilidade por qualquer conteúdo gerado por IA é integralmente sua, o usuário. Você deve verificar a precisão, adequação e ausência de vieses do conteúdo antes de usá-lo.",
                    "Posso colocar dados de alunos ou documentos do IFSP no ChatGPT (ou outra IA externa)? NÃO, em hipótese alguma. É PROIBE EXPRESSAMENTE inserir em IAs de Uso Particular dados pessoais sensíveis, dados pessoais não anonimizados, dados institucionais confidenciais.",
                    "Sou obrigado(a) a informar que usei IA para fazer um documento ou trabalho? SIM. A transparência é um princípio fundamental da política. Você deve especificar qual ferramenta usou, para quê e a extensão do uso.",
                    "Posso usar IA para fazer meus trabalhos acadêmicos? SIM, como uma ferramenta de apoio. Mas é proibido apresentar um trabalho gerado substancialmente por IA como se fosse de sua autoria.",
                    "Um professor pode me proibir de usar IA em uma atividade? SIM. Os docentes podem estabelecer limites ou restrições específicas sobre o uso de IA em certas atividades avaliativas."
                ]
            },
            {
                title: "Política de Uso Aceitável de Estações de Trabalho",
                url: "policies/workstation.html",
                icon: "💻",
                content: [
                    "O que é esta Política e para quem ela vale? É um guia oficial de regras para usar de forma segura e ética os equipamentos de TI do IFSP. Vale para TODOS: servidores, estudantes, pesquisadores, estagiários e funcionários de empresas prestadoras.",
                    "Quem é o responsável pelo backup dos meus arquivos? VOCÊ, o usuário. A responsabilidade por fazer cópias de segurança é integralmente do usuário. Use o Google Drive institucional para salvar seus arquivos de trabalho.",
                    "Meu notebook do IFSP foi perdido ou roubado. O que eu faço? Comunique o setor de TI da sua unidade e registre um Boletim de Ocorrência junto à autoridade policial local.",
                    "Posso instalar um programa no meu computador do IFSP? NÃO. A instalação de softwares é uma atribuição exclusiva do setor de TI. É proibido instalar softwares não licenciados ou não aprovados.",
                    "Posso usar meu notebook pessoal para acessar o e-mail do IFSP? SIM, no modelo BYOD. Mas seu dispositivo deve ter políticas mínimas de segurança como senha ou biometria.",
                    "Achei um pen drive perdido. Posso conectar no computador? NÃO! É expressamente vedado conectar dispositivos USB de origem desconhecida. Representa risco gravíssimo de segurança.",
                    "Preciso bloquear o computador toda vez que saio da mesa? SIM. É obrigatório o uso de bloqueio de tela sempre que o dispositivo for deixado desassistido.",
                    "Posso emprestar minha senha do SUAP ou e-mail? NÃO. Suas credenciais são individuais, pessoais e intransferíveis.",
                    "Recebi um e-mail urgente pedindo minha senha. O que faço? IGNORE, NÃO CLIQUE. É um golpe de phishing ou engenharia social.",
                    "Posso usar o ChatGPT para analisar documentos com dados pessoais? NÃO. É vedado inserir dados confidenciais ou pessoais em plataformas de IA não homologadas."
                ]
            }
        ];

        function highlightText(text, searchTerm) {
            if (!searchTerm) return text;
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark class="highlight">$1</mark>');
        }

        function performSearch(searchTerm) {
            if (!searchTerm || searchTerm.length < 2) {
                globalSearchResults.style.display = 'none';
                return;
            }

            const results = [];
            const term = searchTerm.toLowerCase();

            searchIndex.forEach(page => {
                const matchingSnippets = [];

                page.content.forEach(paragraph => {
                    if (paragraph.toLowerCase().includes(term)) {
                        // Find the context around the search term
                        const words = paragraph.split(' ');
                        const termIndex = words.findIndex(word =>
                            word.toLowerCase().includes(term)
                        );

                        if (termIndex !== -1) {
                            const start = Math.max(0, termIndex - 10);
                            const end = Math.min(words.length, termIndex + 15);
                            const snippet = words.slice(start, end).join(' ') + (end < words.length ? '...' : '');
                            matchingSnippets.push({
                                text: snippet,
                                highlighted: highlightText(snippet, searchTerm)
                            });
                        }
                    }
                });

                if (matchingSnippets.length > 0) {
                    results.push({
                        title: page.title,
                        url: page.url,
                        icon: page.icon,
                        snippets: matchingSnippets.slice(0, 2) // Limit to 2 snippets per page
                    });
                }
            });

            displayResults(results, searchTerm);
        }

        function displayResults(results, searchTerm) {
            searchResultsList.innerHTML = '';

            if (results.length === 0) {
                globalNoResultsMessage.style.display = 'block';
                globalSearchResults.style.display = 'block';
                return;
            }

            globalNoResultsMessage.style.display = 'none';

            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                resultItem.innerHTML = `
                    <div class="result-title">
                        <span class="result-icon">${result.icon}</span>
                        ${result.title}
                    </div>
                    <a href="${result.url}" class="result-link">
                        ${result.url.replace('policies/', '')}
                    </a>
                    ${result.snippets.map(snippet =>
                        `<div class="result-snippet">${snippet.highlighted}</div>`
                    ).join('')}
                `;

                searchResultsList.appendChild(resultItem);
            });

            globalSearchResults.style.display = 'block';
        }

        // Debounce search input
        let searchTimeout;
        globalSearchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const searchTerm = e.target.value.trim();

            if (searchTerm.length === 0) {
                globalSearchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(searchTerm);
            }, 300);
        });

        // Clear results when input is cleared
        globalSearchInput.addEventListener('input', function(e) {
            if (e.target.value.trim().length === 0) {
                globalSearchResults.style.display = 'none';
            }
        });
    }
});