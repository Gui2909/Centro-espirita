# Apresentação do Projeto: Portal de Serviços - NEEE Emmanuel

Esta apresentação descreve a proposta, a arquitetura, as tecnologias e o funcionamento do sistema desenvolvido para o **Núcleo de Estudos Espírita Emmanuel (NEEE)**, localizado em Mairiporã - SP.

---

## 💻 Slide 1: Visão Geral e Proposta do Projeto

### O que é o NEEE Emmanuel?
Fundado em 1969 por Teresinha e Roberto Chamma, o Núcleo de Estudos Espírita Emmanuel é uma instituição filantrópica dedicada à propagação da doutrina espírita, do amparo espiritual e do projeto social em Mairiporã.

### A Proposta da Aplicação
O objetivo deste projeto foi desenvolver uma **Plataforma Digital Integrada** constituída por duas partes fundamentais:
1. **Site Institucional (`index.html`):** Uma vitrine digital elegante e responsiva para divulgar a história da casa, o cronograma de atividades presenciais, os detalhes do projeto social de sábados, a história inspiradora da biblioteca e o contato.
2. **Portal de Serviços (`portal.html`):** Um painel administrativo e interativo para a comunidade e voluntários. Ele digitaliza processos físicos (reserva de livros, bazar social, escalas e agendamentos) em uma experiência totalmente client-side.

---

## 🛠️ Slide 2: Tecnologias Utilizadas

O projeto foi construído seguindo as melhores práticas de desenvolvimento web moderno com foco em desempenho, acessibilidade (SEO) e independência de servidores complexos.

1. **HTML5 Semântico**
   - Utilização de tags estruturais (`<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>`) que melhoram o rankeamento em motores de busca (SEO) e facilitam a leitura por tecnologias assistivas.
2. **CSS3 Avançado (Vanilla CSS)**
   - **Custom Properties (CSS Variables):** Definição de tokens de design (paleta HSL personalizada, fontes, espaçamentos e transições) facilitando a manutenção e consistência visual.
   - **Flexbox e CSS Grid:** Utilizados para layouts fluidos, responsividade automatizada (adaptando-se de celulares a telas UltraWide) e alinhamento de componentes complexos.
   - **Glassmorphism:** Efeito translúcido sofisticado no cabeçalho usando `backdrop-filter: blur()`.
   - **Estilização para Impressão:** CSS específico `@media print` para formatar a nota de cupom fiscal em impressoras térmicas ou PDF de forma limpa.
3. **JavaScript (ES6+) Vanilla**
   - Lógica de aplicação sem frameworks (zero dependência, sem React/Vue/Angular), garantindo que a aplicação seja leve, rápida e de fácil manutenção.
   - Gerenciamento dinâmico do DOM e reatividade baseada em eventos do usuário.
4. **Web Storage API (localStorage)**
   - Utilizado para criar um banco de dados local. Permite simular a persistência de dados (estoques, reservas, listas de presença e voluntariado) de forma que nenhuma informação se perca quando o usuário recarrega a página.

---

## ⚡ Slide 3: O que a Aplicação JavaScript faz

O arquivo `portal.js` atua como o "motor" do Portal de Serviços, fornecendo reatividade a 4 grandes módulos:

### 1. Painel Geral (Dashboard)
- Consolida e calcula em tempo real as métricas do portal (total de livros cadastrados, peças em estoque no bazar e voluntários ativos).
- Exibe alertas dinâmicos sobre as reservas de livros do usuário ativo, permitindo o cancelamento direto na tela inicial.

### 2. Breshopping Virtual (Bazar Social)
- **Catálogo Inteligente:** Filtra produtos dinamicamente por busca textual e categorias (Roupas, Calçados, Acessórios).
- **Sacola de Compras Reativa:** Controla o acréscimo e decréscimo de quantidades com validação rígida de estoque físico.
- **Desconto Social:** Possibilita aplicar 10% de desconto simulado em compras institucionais.
- **Checkout com Abatimento de Estoque:** Realiza a "venda", deduzindo os itens do banco de dados local e gerando um Cupom Fiscal impresso ou em PDF com dados e hora exata da transação.

### 3. Biblioteca Maria Modesto Cravo
- Exibe o acervo literário com controle visual de disponibilidade ("Disponível" em verde e "Reservado" em vermelho).
- Permite ao usuário pesquisar livros por título ou autor.
- Abre um formulário modal para solicitar a reserva de um livro inserindo o nome e contato telefônico do leitor, atualizando o status do livro no sistema global imediatamente.

### 4. Agendamentos e Escalas
- **Conversa Fraterna:** Permite agendar atendimentos espirituais. Valida a data para garantir que o agendamento ocorra no presente/futuro e **exclusivamente às terças-feiras** (dia oficial da atividade).
- **Escala de Voluntariado:** Cadastra novos voluntários ligando-os a setores (Cantina, Bazar, Projeto Social, Limpeza) e horários de disponibilidade.
- Ambas as tabelas são dinâmicas e contam com ações rápidas para cancelar agendamentos ou remover voluntários da lista.

---

## 📐 Slide 4: A Forma como foi Feito (Arquitetura e Design)

### 🎨 Design System e Identidade Visual
- **Paleta de Cores:** Curada para transmitir serenidade e acolhimento. Combina tons de azul espiritual (`#4A7BB0`) como cor primária, toques de dourado (`#D3A25D`) como secundária e fundos quentes (`#FDFBF7`) para conforto visual.
- **Tipografia Premium:** Importação do Google Fonts utilizando a fonte serifada **Lora** para títulos (trazendo sobriedade e elegância histórica) e a fonte sem-serifa **Inter** para textos gerais e painéis (trazendo excelente legibilidade e modernidade técnica).
- **Micro-interações:** Efeitos de foco, transições suaves (`ease`) e elevações em cartões de atividades ao passar o mouse (`hover`) trazem dinamismo e qualidade ao produto.

### 🏗️ Arquitetura Clean e Componentizada
A estrutura de pastas e códigos foi mantida limpa e autoexplicativa:
- **`style.css`:** Contém o design global do site, tipografia, hero banner e componentes informativos.
- **`portal.css`:** Contém a estilização do painel de controle (sidebar colapsável para dispositivos móveis, cards de estatísticas, tabelas de livros e sacola de compras).
- **`portal.js`:** Encapsulado em um escopo fechado (IIFE - *Immediately Invoked Function Expression*) para evitar poluição do escopo global e conflitos de variáveis. Define os dados de semente (mock data para livros e bazar) e gerencia a sincronização contínua com o `localStorage`.

---

## 📈 Conclusão: Benefícios do Modelo Adotado

1. **Custo de Hospedagem Zero:** A aplicação é 100% estática e client-side, podendo ser hospedada gratuitamente em plataformas como GitHub Pages, Vercel ou Netlify.
2. **Alta Performance:** Sem conexões a bancos de dados externos demorados, as páginas e buscas carregam instantaneamente (tempo de carregamento inferior a 500ms).
3. **Privacidade e Simulação Eficiente:** O uso de `localStorage` permite apresentar um sistema funcional completo a alunos, patrocinadores ou diretoria do centro espírita sem necessidade de configurar contas ou expor dados pessoais na nuvem.
