        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('searchInput');
            const faqContainer = document.getElementById('faqContainer');
            const noResultsMessage = document.getElementById('noResultsMessage');
            const faqItems = faqContainer.querySelectorAll('.faq-item');

            // --- Lógica de Busca e Highlight ---
            const originalTexts = new Map();
            faqItems.forEach((item, index) => {
                 // Armazena o HTML INTERNO dos elementos
                originalTexts.set(index, {
                    summary: item.querySelector('summary').innerHTML,
                    content: item.querySelector('.faq-content').innerHTML
                });
            });

            function highlightText(html, searchTerm) {
                 if (!searchTerm) {
                    return html;
                 }
                 const safeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                 const regex = new RegExp(safeSearchTerm, 'gi');

                 // Estratégia: Iterar pelos nós de texto para aplicar o highlight
                 const tempDiv = document.createElement('div');
                 tempDiv.innerHTML = html;

                 const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
                 let node;
                 const nodesToReplace = [];

                 while (node = walker.nextNode()) {
                     // Verifica se o nó pai não é um script ou style para evitar problemas
                     if (node.parentNode && node.parentNode.tagName.toLowerCase() !== 'script' && node.parentNode.tagName.toLowerCase() !== 'style') {
                         if (node.nodeValue.toLowerCase().includes(searchTerm)) {
                             const newNodeValue = node.nodeValue.replace(regex, '<mark class="highlight">$&</mark>');
                             nodesToReplace.push({ oldNode: node, newNodeHTML: newNodeValue });
                         }
                     }
                 }

                 nodesToReplace.forEach(({ oldNode, newNodeHTML }) => {
                    const span = document.createElement('span');
                    span.innerHTML = newNodeHTML;
                    try { // Adiciona try-catch para robustez
                        if(oldNode.parentNode) {
                            oldNode.parentNode.replaceChild(span, oldNode);
                            while (span.firstChild) {
                                span.parentNode.insertBefore(span.firstChild, span);
                            }
                            span.parentNode.removeChild(span);
                        }
                    } catch (e) {
                        console.error("Erro ao substituir nó de texto durante highlight:", e);
                        // Se der erro, tenta restaurar o conteúdo original para evitar quebra
                         const detailsElement = oldNode.closest('.faq-item');
                         if(detailsElement){
                             const index = Array.from(faqItems).indexOf(detailsElement);
                             const original = originalTexts.get(index);
                             if(original && detailsElement.querySelector('summary') && detailsElement.querySelector('.faq-content')){
                                 detailsElement.querySelector('summary').innerHTML = original.summary;
                                 detailsElement.querySelector('.faq-content').innerHTML = original.content;
                             }
                         }
                    }
                 });

                 return tempDiv.innerHTML;
            }


            function resetHighlights() {
                faqItems.forEach((item, index) => {
                    const original = originalTexts.get(index);
                    if(original) {
                        const summaryEl = item.querySelector('summary');
                        const contentEl = item.querySelector('.faq-content');
                        // Verifica se os elementos existem antes de tentar alterar o innerHTML
                        if (summaryEl) summaryEl.innerHTML = original.summary;
                        if (contentEl) contentEl.innerHTML = original.content;
                    }
                });
            }


            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                let itemsFound = 0;

                resetHighlights(); // Reseta primeiro

                 if (searchTerm.length === 0) {
                     faqItems.forEach(item => item.style.display = 'block');
                     noResultsMessage.style.display = 'none';
                     return;
                 } else if (searchTerm.length < 2) {
                     faqItems.forEach(item => item.style.display = 'block');
                     noResultsMessage.style.display = 'none';
                     return;
                 }


                faqItems.forEach((item, index) => {
                    const summary = item.querySelector('summary');
                    const content = item.querySelector('.faq-content');
                    const original = originalTexts.get(index);

                    // Verifica se os elementos summary e content existem
                    if (!summary || !content) return; // Pula este item se algo estiver faltando

                    const summaryText = summary.textContent.toLowerCase();
                    const contentText = content.textContent.toLowerCase();

                    if (summaryText.includes(searchTerm) || contentText.includes(searchTerm)) {
                        item.style.display = 'block';
                        itemsFound++;
                        if(original){
                            try { // Adiciona try-catch para robustez
                                summary.innerHTML = highlightText(original.summary, searchTerm);
                                content.innerHTML = highlightText(original.content, searchTerm);
                            } catch (e) {
                                 console.error("Erro ao aplicar highlight:", e);
                                 // Restaura o original em caso de erro
                                 summary.innerHTML = original.summary;
                                 content.innerHTML = original.content;
                            }
                        }

                    } else {
                        item.style.display = 'none';
                    }
                });

                noResultsMessage.style.display = (itemsFound === 0 && searchTerm) ? 'block' : 'none';
            });
        });