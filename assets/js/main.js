document.addEventListener("DOMContentLoaded", function() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Footer year update
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Virtual Keyboard functionality
    class VirtualKeyboard {
        constructor() {
            this.activeInput = null;
            this.keyboard = null;
            this.isVisible = false;
            this.isInteracting = false; // Flag to prevent premature hiding
            this.init();
        }

        init() {
            this.createKeyboard();
            this.attachEventListeners();
        }

        createKeyboard() {
            const keyboardHTML = `
                <div class="virtual-keyboard" id="virtualKeyboard" role="dialog" aria-label="Teclado virtual" aria-modal="true">
                    <div class="keyboard-row">
                        <button class="keyboard-key" data-key="q">Q</button>
                        <button class="keyboard-key" data-key="w">W</button>
                        <button class="keyboard-key" data-key="e">E</button>
                        <button class="keyboard-key" data-key="r">R</button>
                        <button class="keyboard-key" data-key="t">T</button>
                        <button class="keyboard-key" data-key="y">Y</button>
                        <button class="keyboard-key" data-key="u">U</button>
                        <button class="keyboard-key" data-key="i">I</button>
                        <button class="keyboard-key" data-key="o">O</button>
                        <button class="keyboard-key" data-key="p">P</button>
                    </div>
                    <div class="keyboard-row">
                        <button class="keyboard-key" data-key="a">A</button>
                        <button class="keyboard-key" data-key="s">S</button>
                        <button class="keyboard-key" data-key="d">D</button>
                        <button class="keyboard-key" data-key="f">F</button>
                        <button class="keyboard-key" data-key="g">G</button>
                        <button class="keyboard-key" data-key="h">H</button>
                        <button class="keyboard-key" data-key="j">J</button>
                        <button class="keyboard-key" data-key="k">K</button>
                        <button class="keyboard-key" data-key="l">L</button>
                    </div>
                    <div class="keyboard-row">
                        <button class="keyboard-key special" data-key="shift">⇧</button>
                        <button class="keyboard-key" data-key="z">Z</button>
                        <button class="keyboard-key" data-key="x">X</button>
                        <button class="keyboard-key" data-key="c">C</button>
                        <button class="keyboard-key" data-key="v">V</button>
                        <button class="keyboard-key" data-key="b">B</button>
                        <button class="keyboard-key" data-key="n">N</button>
                        <button class="keyboard-key" data-key="m">M</button>
                        <button class="keyboard-key special backspace" data-key="backspace">⌫</button>
                    </div>
                    <div class="keyboard-row">
                        <button class="keyboard-key special" data-key="numbers">123</button>
                        <button class="keyboard-key space" data-key=" ">Espaço</button>
                        <button class="keyboard-key enter" data-key="enter">↵</button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', keyboardHTML);
            this.keyboard = document.getElementById('virtualKeyboard');
            this.attachKeyboardEvents();
        }

        attachEventListeners() {
            // Find all search inputs
            const searchInputs = document.querySelectorAll('input[type="search"]');

            searchInputs.forEach(input => {
                // Add toggle button
                const container = input.parentElement;
                const toggleBtn = document.createElement('button');
                toggleBtn.type = 'button';
                toggleBtn.className = 'virtual-keyboard-toggle';
                toggleBtn.innerHTML = '⌨️';
                toggleBtn.setAttribute('aria-label', 'Mostrar teclado virtual');
                toggleBtn.setAttribute('title', 'Teclado virtual');

                container.style.position = 'relative';
                container.appendChild(toggleBtn);

                // Toggle keyboard on button click
                toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleKeyboard(input);
                });

                // Show keyboard on input focus (for accessibility)
                input.addEventListener('focus', () => {
                    if (this.isVisible && this.activeInput === input) {
                        return; // Already showing for this input
                    }
                    this.showKeyboard(input);
                });

                // Hide keyboard when input loses focus (but keep it if clicking on keyboard)
                input.addEventListener('blur', (e) => {
                    // Delay to allow keyboard clicks
                    setTimeout(() => {
                        if (!this.isInteracting && !this.keyboard.contains(document.activeElement)) {
                            this.hideKeyboard();
                        }
                    }, 150); // Increased timeout for better reliability
                });
            });
        }

        attachKeyboardEvents() {
            // Set interacting flag when mouse enters keyboard
            this.keyboard.addEventListener('mouseenter', () => {
                this.isInteracting = true;
            });

            // Clear interacting flag when mouse leaves keyboard
            this.keyboard.addEventListener('mouseleave', () => {
                this.isInteracting = false;
            });

            this.keyboard.addEventListener('click', (e) => {
                if (e.target.classList.contains('keyboard-key')) {
                    e.preventDefault();
                    const key = e.target.dataset.key;
                    this.handleKeyPress(key);
                }
            });

            // Keyboard navigation
            this.keyboard.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hideKeyboard();
                    if (this.activeInput) {
                        this.activeInput.focus();
                    }
                }
            });
        }

        handleKeyPress(key) {
            if (!this.activeInput) return;

            const input = this.activeInput;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const value = input.value;

            switch (key) {
                case 'backspace':
                    if (start === end) {
                        input.value = value.slice(0, start - 1) + value.slice(end);
                        input.selectionStart = input.selectionEnd = start - 1;
                    } else {
                        input.value = value.slice(0, start) + value.slice(end);
                        input.selectionStart = input.selectionEnd = start;
                    }
                    break;
                case 'enter':
                    input.value = value.slice(0, start) + '\n' + value.slice(end);
                    input.selectionStart = input.selectionEnd = start + 1;
                    break;
                case 'shift':
                    // Toggle case for next key press (simplified)
                    break;
                case 'numbers':
                    // Toggle to number/symbol keyboard (simplified)
                    break;
                default:
                    input.value = value.slice(0, start) + key + value.slice(end);
                    input.selectionStart = input.selectionEnd = start + key.length;
                    break;
            }

            // Trigger input event for search functionality
            input.dispatchEvent(new Event('input', { bubbles: true }));

            // Keep focus on input after a short delay to avoid blur conflicts
            setTimeout(() => {
                if (this.isVisible && this.activeInput === input) {
                    input.focus();
                }
            }, 10);
        }

        toggleKeyboard(input) {
            if (this.isVisible && this.activeInput === input) {
                this.hideKeyboard();
            } else {
                this.showKeyboard(input);
            }
        }

        showKeyboard(input) {
            this.activeInput = input;
            this.keyboard.classList.add('show');
            this.isVisible = true;

            // Position keyboard near the input
            const inputRect = input.getBoundingClientRect();
            const keyboardRect = this.keyboard.getBoundingClientRect();

            // Position above input if there's space, otherwise below
            if (inputRect.top > keyboardRect.height + 20) {
                this.keyboard.style.bottom = 'auto';
                this.keyboard.style.top = `${inputRect.top - keyboardRect.height - 10}px`;
            } else {
                this.keyboard.style.top = 'auto';
                this.keyboard.style.bottom = `${window.innerHeight - inputRect.bottom - 10}px`;
            }

            this.keyboard.style.left = `${Math.max(10, Math.min(window.innerWidth - keyboardRect.width - 10, inputRect.left))}px`;

            // Announce to screen readers
            this.keyboard.setAttribute('aria-hidden', 'false');
        }

        hideKeyboard() {
            this.keyboard.classList.remove('show');
            this.isVisible = false;
            this.isInteracting = false; // Reset interacting flag
            this.activeInput = null;
            this.keyboard.setAttribute('aria-hidden', 'true');
        }
    }

    // Initialize virtual keyboard
    new VirtualKeyboard();

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