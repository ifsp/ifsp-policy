# Repositório de Políticas IFSP

Este repositório contém o site estático oficial das **Políticas de Governança de TI** do Instituto Federal de Educação, Ciência e Tecnologia de São Paulo (IFSP). O projeto visa centralizar e facilitar o acesso às diretrizes e normas relacionadas à tecnologia da informação na instituição.

## 📋 Descrição

O site é construído com tecnologias web simples (HTML, CSS e JavaScript) para garantir acessibilidade, responsividade e facilidade de manutenção. Ele apresenta as políticas organizadas em seções claras, com navegação intuitiva e design moderno alinhado à identidade visual do IFSP.

### Funcionalidades Principais

- **Página Inicial**: Visão geral das políticas disponíveis com cards interativos.
- **Políticas Detalhadas**: Páginas dedicadas para cada política, como Inteligência Artificial (IA) e Uso de Estações de Trabalho.
- **Design Responsivo**: Compatível com dispositivos móveis, tablets e desktops.
- **Acessibilidade**: Implementação de links de pulo, navegação por teclado e conformidade com WCAG.
- **Busca Integrada**: Funcionalidade de pesquisa para localizar conteúdos específicos.

## 🏗️ Estrutura do Projeto

```
ifsp-policy/
├── index.html              # Página inicial do site
├── template.html           # Modelo base para outras páginas
├── README.md               # Este arquivo
├── LICENSE                 # Licença MIT
├── build.sh                # Script de build (se aplicável)
├── assets/
│   ├── css/
│   │   └── style.css       # Estilos principais
│   ├── images/             # Imagens e ícones
│   └── js/
│       ├── main.js         # Scripts principais
│       └── script.js       # Scripts adicionais
└── policies/
    ├── ia.html             # Política de Inteligência Artificial
    └── workstation.html    # Política de Uso de Estações de Trabalho
```

## 🚀 Como Usar

### Visualização Local

1. Clone o repositório:

   ```bash
   git clone https://github.com/ifsp/ifsp-policy.git
   cd ifsp-policy
   ```

2. Abra o arquivo `index.html` em seu navegador web preferido.

### Desenvolvimento

- Edite os arquivos HTML, CSS ou JS diretamente.
- Para mudanças em políticas, modifique os arquivos em `policies/`.
- Teste as alterações abrindo `index.html` no navegador.

### Build (se necessário)

Execute o script `build.sh` para otimizar os arquivos (se configurado):

```bash
./build.sh
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica das páginas.
- **CSS3**: Estilização responsiva com variáveis CSS personalizadas.
- **JavaScript (Vanilla)**: Interatividade básica, como busca e navegação.
- **Google Fonts**: Fonte Inter para consistência visual.

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`.
4. Push para a branch: `git push origin minha-feature`.
5. Abra um Pull Request.

### Diretrizes

- Mantenha o código limpo e comentado.
- Teste as mudanças em diferentes navegadores.
- Siga as normas de acessibilidade.
- Atualize este README se necessário.

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato com a equipe de TI do IFSP.

---

**Instituto Federal de Educação, Ciência e Tecnologia de São Paulo**  
Última atualização: Outubro 2025
