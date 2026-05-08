# Requirements Document

## Introduction

A proposta comercial da LaVita Code para o Grupo Gradual (plataforma BCM) existe hoje como um documento estático de 22 slides (HTML impressível em 13.333in × 7.5in e PDF equivalente). Este projeto transforma essa proposta em uma apresentação web interativa, persuasiva, responsiva e moderna, construída em React + Tailwind CSS, preservando a paleta de cores psicologicamente calibrada (azul-confiança, verde-crescimento, âmbar-urgência) e aplicando técnicas de vendas (ancoragem, escassez, prova social, reciprocidade, autoridade, comparação gain/loss).

O objetivo é maximizar a conversão: que o Grupo Gradual assine a intenção, agende uma reunião, ou baixe a versão em PDF para circular internamente. A experiência deve funcionar em dois modos complementares — landing page contínua (com rolagem e revelações animadas) e modo apresentação (slide a slide, tela cheia) — e oferecer ferramentas interativas que ajudam o decisor a visualizar o retorno (simulador de ROI, calculadora de economia com softhouse, timeline de tranches, contador de validade, comparador "entrar agora vs esperar", cards expansíveis dos módulos, seletor de protocolos, FAQ acordeão).

A versão estática em PDF continua disponível como asset para download, garantindo que o material circule também em contextos offline ou de leitura formal.

## Glossary

- **BCM**: Plataforma clínica ABA digital da LaVita Code, objeto da proposta.
- **LaVita Code**: Empresa proprietária do BCM e contraparte do investimento.
- **Grupo Gradual**: Parceiro clínico alvo da proposta (doravante "Gradual").
- **Proposta Interativa**: Aplicação web React que entrega a proposta em formato navegável e persuasivo.
- **Landing_Mode**: Modo de navegação em rolagem vertical contínua, com revelações por scroll.
- **Presentation_Mode**: Modo de navegação slide a slide, em tela cheia, com setas e teclado.
- **Section**: Unidade de conteúdo equivalente a um slide da proposta original (ex.: "Resumo Executivo", "Proposta & Tranches", "Time").
- **Tranche**: Parcela do aporte com gatilho específico (T1 R$30.000 assinatura, T2 R$25.000 com 50 pagantes, T3 R$20.000 com publicação ou 100 pagantes).
- **ROI_Simulator**: Componente interativo que projeta o valor dos 5% da LaVita Code em cenários de tração (breakeven, 1.000 assinantes, contrato municipal, presença nacional).
- **Softhouse_Calculator**: Componente que calcula a economia anual e payback com base no custo mensal de software atual do Gradual, aplicando o desconto de 25%.
- **Countdown_Timer**: Componente que exibe o tempo restante até a data-limite de validade (22/mai/2026 ou 15 dias a partir da abertura, conforme configurado).
- **Scarcity_Indicator**: Elemento visual que reforça a validade e a escassez de posição de fundador.
- **Module_Card**: Card expansível correspondente a um dos 12 módulos do produto (PSRF, PSFA, EPS-PCA, Kernel, PEI, Minha Voz, Rotinas, 32 Jogos, Visão 360, Relatórios, Acesso, Stack).
- **Protocol_Selector**: Controle que alterna entre "Defaults BCM" (PSRF, PSFA, EPS-PCA) e "Preferenciais Gradual" (OERA, VB-MAPP, ABLLS-R, PEP-3, CARS-2, SRS-2, Vineland-3).
- **Objection_Accordion**: Lista estilo FAQ com as seis objeções já tratadas na proposta.
- **Sticky_CTA**: Barra fixa com ações primárias (assinar intenção, baixar PDF, agendar reunião).
- **PDF_Asset**: Arquivo `BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf` servido estaticamente para download.
- **Intent_Form**: Formulário leve para captura de interesse/assinatura de intenção, submetido a um endpoint configurável.
- **Reduced_Motion**: Preferência de sistema do usuário (`prefers-reduced-motion`) que desativa animações não essenciais.
- **BRL**: Moeda Real Brasileiro, formato `pt-BR` com símbolo "R$" e separadores `.` (milhar) e `,` (decimal).

## Requirements

### Requirement 1: Entrega da proposta como aplicação web interativa

**User Story:** Como decisor do Grupo Gradual, quero abrir a proposta em uma página web moderna e interativa, para entender rapidamente a oferta sem depender de PDF.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL ser entregue como aplicação React + TypeScript construída com Vite e estilizada com Tailwind CSS.
2. THE Proposta_Interativa SHALL renderizar todas as 22 seções derivadas dos slides originais: Capa, Resumo Executivo, Urgência de Mercado, O que é o BCM, Produto (12 módulos), Tese Técnica (Kernel), Protocolos Gradual, OERA como fundador, Mercado & Receita, Projeções, Por que o Gradual, Time, Proposta & Tranches, Pagamento por prova, Retorno esperado, Retorno antes da escala, Governança, Plano de execução, Objeções, Quadro de decisão, Termos resumidos e Próximos passos.
3. THE Proposta_Interativa SHALL preservar a paleta de cores institucional com os tokens `#1B3A6B` (azul-confiança), `#2D9B8A` (verde-crescimento), `#F5A623` (âmbar-urgência), `#8B7EC8` (roxo-acento), `#F8F9FA` (base clara) e `#102642` (base escura) disponíveis como variáveis semânticas no tema Tailwind.
4. WHEN a Section é renderizada, THE Proposta_Interativa SHALL aplicar a variante cromática correspondente ao slide original (clara, escura ou teal-bg) sem alterar o significado hierárquico de cada cor.
5. THE Proposta_Interativa SHALL exibir a marca "BCM · LaVita Code" e o rodapé "Proposta de Parceria Estratégica · Confidencial" em toda Section, exceto Capa e Próximos Passos.

### Requirement 2: Modos de navegação Landing e Presentation

**User Story:** Como usuário, quero alternar entre rolagem contínua e apresentação slide a slide, para consumir o conteúdo no formato que preferir.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL oferecer dois modos de navegação: Landing_Mode e Presentation_Mode.
2. WHEN a Proposta_Interativa é aberta sem parâmetros, THE Proposta_Interativa SHALL iniciar em Landing_Mode.
3. WHEN o usuário aciona o controle "Modo apresentação", THE Proposta_Interativa SHALL alternar para Presentation_Mode exibindo uma Section por vez em layout 16:9 responsivo.
4. WHILE em Presentation_Mode, THE Proposta_Interativa SHALL aceitar as teclas `ArrowRight`/`PageDown`/`Space` para avançar, `ArrowLeft`/`PageUp` para voltar, `Home` para ir à primeira Section, `End` para ir à última, e `Esc` para retornar a Landing_Mode.
5. WHILE em Landing_Mode, THE Proposta_Interativa SHALL permitir rolagem vertical livre e exibir um indicador de progresso da leitura com a Section atual.
6. WHEN o usuário acessa uma URL com fragmento `#secao-<slug>`, THE Proposta_Interativa SHALL rolar até a Section correspondente em Landing_Mode ou saltar para a Section em Presentation_Mode.
7. WHEN a Section ativa muda em qualquer modo, THE Proposta_Interativa SHALL atualizar o fragmento da URL de forma que um recarregamento preserve a posição atual.

### Requirement 3: Download do PDF estático

**User Story:** Como leitor que prefere formato estático, quero baixar a versão em PDF da proposta, para circular internamente ou ler offline.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL servir o arquivo `BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf` como asset estático acessível via URL pública determinística.
2. THE Sticky_CTA SHALL exibir uma ação "Baixar PDF" visível em Landing_Mode e em Presentation_Mode.
3. WHEN o usuário aciona "Baixar PDF", THE Proposta_Interativa SHALL iniciar o download do PDF_Asset com o nome `BCM_Proposta_Investimento_Grupo_Gradual.pdf`.
4. IF o PDF_Asset não estiver disponível no servidor, THEN THE Proposta_Interativa SHALL exibir uma mensagem "PDF indisponível no momento" e manter a interface utilizável.
5. WHERE o dispositivo é móvel e o navegador bloqueia downloads diretos, THE Proposta_Interativa SHALL abrir o PDF_Asset em nova aba para visualização e salvamento manual.

### Requirement 4: Simulador de ROI dos 5%

**User Story:** Como investidor, quero simular o valor dos 5% da LaVita Code em diferentes cenários de tração, para avaliar o retorno potencial do aporte de R$75.000.

#### Acceptance Criteria

1. THE ROI_Simulator SHALL aceitar como entrada o número de assinantes pagantes no intervalo [0, 5000] em incrementos de 10.
2. THE ROI_Simulator SHALL aceitar o mix de planos (Profissional R$297, Clínica R$997, Escola R$1.997) com percentuais somando 100% e valor default de 60/30/10.
3. THE ROI_Simulator SHALL aceitar um múltiplo de MRR no intervalo [1, 20] com default 5 para estimar valuation.
4. WHEN qualquer entrada do ROI_Simulator muda, THE ROI_Simulator SHALL recalcular e exibir, em menos de 100ms, a receita mensal estimada, o valuation estimado e o valor dos 5% em BRL.
5. THE ROI_Simulator SHALL exibir quatro cenários pré-configurados clicáveis: "Breakeven (350 assinantes)", "1.000 assinantes", "Contrato municipal + 500 assinantes" e "Presença nacional".
6. WHEN um cenário pré-configurado é selecionado, THE ROI_Simulator SHALL preencher os campos de entrada com os valores desse cenário.
7. FOR ALL entradas válidas, o valor dos 5% calculado pelo ROI_Simulator SHALL ser monotônico não-decrescente no número de assinantes quando o mix e o múltiplo estão fixos (propriedade de correctness).
8. FOR ALL entradas válidas, a soma `receita_profissional + receita_clinica + receita_escola` calculada pelo ROI_Simulator SHALL ser igual à receita mensal total exibida, com tolerância de arredondamento de R$ 0,01 (propriedade de correctness).
9. THE ROI_Simulator SHALL exibir um disclaimer textual "Projeções são estimativas comerciais por múltiplo de MRR e não constituem garantia de retorno."

### Requirement 5: Calculadora de economia com softhouse

**User Story:** Como decisor financeiro do Gradual, quero calcular a economia anual e o payback do investimento assumindo que contratemos serviços de desenvolvimento da LaVita Code, para enxergar retorno operacional independente da escala do BCM.

#### Acceptance Criteria

1. THE Softhouse_Calculator SHALL aceitar como entrada o custo mensal atual de software em BRL no intervalo [0, 200.000].
2. THE Softhouse_Calculator SHALL aplicar um desconto fixo de 25% sobre o custo mensal informado.
3. WHEN o custo mensal informado muda, THE Softhouse_Calculator SHALL recalcular e exibir a economia mensal, economia anual e payback em anos considerando o aporte total de R$75.000, com atualização em menos de 100ms.
4. THE Softhouse_Calculator SHALL exibir os exemplos de referência da proposta: R$8.000/mês (economia R$24.000/ano, payback 3,1 anos) e R$12.000/mês (economia R$36.000/ano, payback 2,1 anos).
5. FOR ALL custos mensais maiores que zero, o payback em anos calculado pelo Softhouse_Calculator SHALL ser igual a `75000 / (custo_mensal * 0,25 * 12)` com tolerância de arredondamento de 0,1 ano (propriedade de correctness).
6. IF o custo mensal informado for zero, THEN THE Softhouse_Calculator SHALL exibir "Informe um custo mensal para estimar o payback" sem lançar erro.
7. THE Softhouse_Calculator SHALL formatar todos os valores monetários em BRL (ex.: "R$ 24.000,00").

### Requirement 6: Linha do tempo interativa das tranches

**User Story:** Como decisor, quero visualizar as três tranches do aporte com seus gatilhos e o que é liberado em cada etapa, para entender que o risco é protegido por prova de mercado.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL exibir uma timeline com três marcos: Tranche 1 (R$30.000), Tranche 2 (R$25.000) e Tranche 3 (R$20.000).
2. THE timeline de tranches SHALL exibir o gatilho de cada marco: "Assinatura do contrato" para T1, "50 usuários pagantes ativos" para T2, "Publicação conjunta OU 100 usuários pagantes" para T3.
3. WHEN o usuário interage com um marco (hover ou toque), THE Proposta_Interativa SHALL revelar o conjunto de entregas associadas a esse marco (ex.: T1 inclui viagem inicial, onboarding, início da integração OERA).
4. THE timeline de tranches SHALL exibir a soma dos três valores como R$ 75.000 em local visível e acessível por leitor de tela.
5. THE soma exibida pela timeline de tranches SHALL ser sempre igual à soma dos valores individuais das três tranches (propriedade de correctness: invariante total = T1 + T2 + T3).
6. THE timeline de tranches SHALL exibir um indicador visual de progresso entre marcos usando gradiente do verde (#2D9B8A) ao âmbar (#F5A623).

### Requirement 7: Contador regressivo de validade

**User Story:** Como decisor, quero ver claramente o tempo restante até o fim da validade da proposta, para ponderar a urgência da decisão.

#### Acceptance Criteria

1. THE Countdown_Timer SHALL exibir dias, horas, minutos e segundos restantes até uma data-limite configurável, com default de 22 de maio de 2026, 23:59:59 no fuso `America/Sao_Paulo`.
2. WHILE a data atual é anterior à data-limite, THE Countdown_Timer SHALL atualizar a contagem a cada segundo.
3. WHEN a data atual atinge ou ultrapassa a data-limite, THE Countdown_Timer SHALL exibir "Proposta expirada" e interromper atualizações periódicas.
4. THE Countdown_Timer SHALL usar a cor âmbar (#F5A623) quando restarem até 72 horas e azul (#1B3A6B) nos demais casos.
5. FOR ALL instantes antes da data-limite, o valor em segundos retornado pelo Countdown_Timer SHALL ser estritamente decrescente entre atualizações consecutivas (propriedade de correctness).
6. THE Countdown_Timer SHALL respeitar `prefers-reduced-motion` desabilitando animações decorativas sem interromper a atualização do valor textual.

### Requirement 8: Comparador "Entrar agora vs Esperar"

**User Story:** Como decisor, quero comparar lado a lado os ganhos de entrar agora versus o custo de esperar, para reduzir ambiguidade na decisão.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL exibir um comparador com duas colunas equilibradas: "Se o Gradual entra agora" e "Se o Gradual espera".
2. THE coluna "entra agora" SHALL listar os cinco ganhos descritos na proposta (primeiro parceiro, moldar produto, catálogo fundador, coautoria, narrativa científica).
3. THE coluna "espera" SHALL listar os cinco riscos descritos na proposta (outro parceiro ocupa, outro catálogo vira fundador, entrada como cliente, janela fecha, poder de moldar diminui).
4. WHEN o usuário aciona o controle "Animar comparação", THE Proposta_Interativa SHALL revelar sequencialmente itens das duas colunas com intervalos não-bloqueantes.
5. WHERE `prefers-reduced-motion` está ativo, THE Proposta_Interativa SHALL exibir ambas as colunas completas sem animação sequencial.

### Requirement 9: Cards expansíveis dos 12 módulos

**User Story:** Como leitor técnico, quero expandir cada um dos 12 módulos do produto para ler detalhes, para entender o escopo sem poluir a vista geral.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL exibir 12 Module_Cards correspondentes aos módulos: PSRF-BCM, PSFA-BCM, EPS-PCA, Kernel, PEI Digital, Minha Voz, Rotinas, 32 Jogos, Visão 360, Relatórios, Acesso Progressivo e Stack SaaS.
2. WHEN o usuário aciona um Module_Card fechado, THE Module_Card SHALL expandir para revelar a descrição completa.
3. WHEN o usuário aciona um Module_Card aberto, THE Module_Card SHALL recolher para o estado fechado.
4. WHEN dois acionamentos consecutivos ocorrem sobre o mesmo Module_Card, o estado final do Module_Card SHALL ser idêntico ao estado inicial (propriedade de correctness: toggle idempotente em pares).
5. THE Module_Card SHALL ser operável por teclado com `Enter` e `Space`, expondo `aria-expanded` apropriado.

### Requirement 10: Seletor de protocolos clínicos

**User Story:** Como clínico, quero alternar entre os protocolos default do BCM e os preferenciais do Gradual, para ver como o kernel aceita cada conjunto.

#### Acceptance Criteria

1. THE Protocol_Selector SHALL oferecer dois grupos: "Defaults BCM" (PSRF-BCM, PSFA-BCM, EPS-PCA) e "Preferenciais Gradual" (OERA, VB-MAPP, ABLLS-R, PEP-3, CARS-2, SRS-2, Vineland-3).
2. WHEN o usuário seleciona um grupo, THE Protocol_Selector SHALL destacar os cards dos protocolos desse grupo e atualizar o texto explicativo correspondente.
3. THE Protocol_Selector SHALL marcar o protocolo "OERA" com um selo visual "Prioritário" sempre que "Preferenciais Gradual" estiver selecionado.
4. THE Protocol_Selector SHALL permitir selecionar ambos os grupos simultaneamente para ilustrar o modo "combinação".
5. WHEN nenhum grupo está selecionado, THE Protocol_Selector SHALL exibir o estado default "Defaults BCM" selecionado e um aviso textual orientando o uso.

### Requirement 11: FAQ de objeções em acordeão

**User Story:** Como decisor cético, quero acessar respostas para as objeções comuns em formato de FAQ, para resolver dúvidas sem sair da página.

#### Acceptance Criteria

1. THE Objection_Accordion SHALL exibir seis itens correspondentes às objeções da proposta: produto não vender, clínica não usar, virar "só mais um software", participação pequena, conflito técnico e retorno demorar.
2. WHEN o usuário aciona um item do Objection_Accordion, THE Objection_Accordion SHALL expandir esse item exibindo a resposta correspondente.
3. THE Objection_Accordion SHALL permitir no máximo um item expandido por vez.
4. THE Objection_Accordion SHALL ser operável por teclado seguindo o padrão WAI-ARIA Accordion (`Enter`/`Space` para alternar, `ArrowUp`/`ArrowDown` para mover entre cabeçalhos).

### Requirement 12: CTA fixo com ações primárias

**User Story:** Como leitor engajado, quero acessar as ações primárias a qualquer momento da leitura, para decidir sem precisar voltar ao topo ou ao final.

#### Acceptance Criteria

1. THE Sticky_CTA SHALL permanecer visível em qualquer ponto de rolagem em Landing_Mode e como rodapé fixo em Presentation_Mode.
2. THE Sticky_CTA SHALL expor três ações primárias: "Assinar intenção", "Baixar PDF" e "Agendar reunião".
3. WHEN o usuário aciona "Assinar intenção", THE Proposta_Interativa SHALL abrir o Intent_Form em modal.
4. WHEN o usuário aciona "Agendar reunião", THE Proposta_Interativa SHALL abrir um link externo de agendamento em nova aba, cujo destino é configurável por variável de ambiente.
5. THE Sticky_CTA SHALL recolher-se para uma barra compacta quando a largura do viewport é menor que 640px, preservando acesso às três ações por meio de um menu expansível.
6. THE Sticky_CTA SHALL respeitar contraste mínimo WCAG AA nas variantes clara e escura do tema.

### Requirement 13: Formulário de intenção

**User Story:** Como representante do Gradual, quero registrar minha intenção de avançar com a proposta informando dados mínimos, para iniciar a formalização.

#### Acceptance Criteria

1. THE Intent_Form SHALL coletar os campos: nome completo (obrigatório), email corporativo (obrigatório), telefone (opcional), papel na decisão (obrigatório) e mensagem livre (opcional).
2. WHEN o usuário submete o Intent_Form com campos obrigatórios válidos, THE Proposta_Interativa SHALL enviar os dados ao endpoint configurado via variável de ambiente e exibir uma confirmação de recebimento.
3. IF um campo obrigatório está vazio ou um email é sintaticamente inválido, THEN THE Intent_Form SHALL bloquear a submissão e destacar o campo com mensagem específica.
4. IF a submissão ao endpoint configurado falhar por erro de rede, THEN THE Intent_Form SHALL exibir uma mensagem de falha com opção de tentar novamente e oferecer um link `mailto:` de fallback para `rafaeldias@lavitacode.com.br`.
5. THE Intent_Form SHALL incluir um aviso de confidencialidade e consentimento explícito para contato comercial conforme LGPD antes da submissão.

### Requirement 14: Responsividade e compatibilidade

**User Story:** Como leitor em dispositivos diversos, quero que a proposta funcione em desktop, tablet e celular, para acessá-la no dispositivo que tiver em mãos.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL ser utilizável em larguras de viewport de 320px a 2560px.
2. WHEN o viewport é menor que 768px, THE Proposta_Interativa SHALL reorganizar grids multi-coluna em coluna única, preservando a ordem semântica do conteúdo.
3. THE Proposta_Interativa SHALL ser compatível com as duas últimas versões estáveis de Chrome, Firefox, Safari e Edge.
4. THE Proposta_Interativa SHALL carregar o conteúdo principal (First Contentful Paint) em menos de 2,5 segundos em conexão 4G típica simulada.
5. WHERE imagens decorativas são usadas, THE Proposta_Interativa SHALL aplicar `loading="lazy"` e dimensões explícitas para evitar layout shift.

### Requirement 15: Acessibilidade

**User Story:** Como usuário com leitor de tela ou navegação por teclado, quero acessar todo o conteúdo e todas as interações, para não depender do mouse.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL expor landmarks semânticos (`header`, `main`, `nav`, `footer`) e cabeçalhos hierárquicos coerentes (`h1` único por Section principal).
2. THE Proposta_Interativa SHALL permitir navegação completa por teclado, com foco sempre visível e sem armadilhas de foco.
3. THE Proposta_Interativa SHALL manter contraste mínimo WCAG AA (4,5:1 para texto normal, 3:1 para texto grande) em todas as combinações de cor do tema.
4. WHERE `prefers-reduced-motion` está ativo, THE Proposta_Interativa SHALL desativar scroll-reveals, parallax e animações decorativas, preservando transições essenciais para compreensão (ex.: abrir/fechar acordeão).
5. THE Proposta_Interativa SHALL associar rótulos acessíveis (`aria-label` ou texto visível) a todos os controles interativos.

### Requirement 16: Animações e micro-interações

**User Story:** Como leitor, quero sentir a proposta moderna e viva, com animações sutis que reforcem a narrativa sem atrapalhar a leitura.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL usar Framer Motion para animações de entrada, transições entre Sections e micro-interações.
2. WHEN uma Section entra no viewport em Landing_Mode, THE Proposta_Interativa SHALL aplicar uma animação de revelação com duração entre 300ms e 600ms.
3. THE Proposta_Interativa SHALL usar Lucide React como biblioteca de ícones padrão.
4. WHERE animações decorativas estão ativas, THE Proposta_Interativa SHALL limitar o uso simultâneo a 3 elementos animados por viewport para não comprometer desempenho.
5. WHERE `prefers-reduced-motion` está ativo, THE Proposta_Interativa SHALL substituir animações por transições de opacidade com duração máxima de 100ms ou nenhuma transição.

### Requirement 17: Formatação de valores monetários e numéricos

**User Story:** Como leitor brasileiro, quero ver valores monetários, datas e números formatados conforme o padrão pt-BR, para evitar ambiguidade.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL formatar valores monetários usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.
2. THE Proposta_Interativa SHALL formatar números grandes com separador de milhar `.` (ex.: 150.000) e decimais com `,`.
3. THE Proposta_Interativa SHALL formatar datas no padrão `dd/MM/yyyy` quando datas completas são exibidas textualmente.
4. FOR ALL valores monetários exibidos, a função de formatação aplicada pela Proposta_Interativa SHALL produzir a mesma saída para a mesma entrada em execuções repetidas (propriedade de correctness: pureza da formatação).
5. THE Proposta_Interativa SHALL exibir os valores-chave imutáveis da proposta sempre com a mesma precisão: R$ 75.000 (aporte total), R$ 30.000 (T1), R$ 25.000 (T2), R$ 20.000 (T3), R$ 297, R$ 997, R$ 1.997 (planos), R$ 150.000 (capital investido).

### Requirement 18: Configuração e construção do projeto

**User Story:** Como desenvolvedor, quero instalar e rodar o projeto com comandos padrão, para construir e publicar a aplicação sem fricção.

#### Acceptance Criteria

1. THE Proposta_Interativa SHALL declarar no `package.json` os scripts `dev`, `build`, `preview` e `lint`.
2. WHEN `npm install` é executado em um ambiente com Node.js 20 LTS, THE Proposta_Interativa SHALL instalar todas as dependências sem erros.
3. WHEN `npm run build` é executado, THE Proposta_Interativa SHALL gerar um bundle estático em `dist/` pronto para servir por qualquer servidor de arquivos.
4. THE Proposta_Interativa SHALL incluir o PDF_Asset no diretório `public/` ou equivalente do Vite, preservando o nome original.
5. THE Proposta_Interativa SHALL fixar versões exatas das dependências principais (React, Vite, Tailwind, Framer Motion, Lucide React) no `package.json`.
6. THE Proposta_Interativa SHALL incluir um `README.md` mínimo com instruções de instalação, execução e publicação.
