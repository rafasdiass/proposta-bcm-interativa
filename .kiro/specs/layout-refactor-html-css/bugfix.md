# Bugfix Requirements Document

## Introduction

A Proposta BCM Interativa (React + Tailwind v4 + Framer Motion) sofre de uma
classe recorrente de defeitos de layout que reaparece a cada nova seção e cada
tentativa de correção pontual. O usuário relatou o mesmo padrão em múltiplos
lugares da proposta: **o texto renderiza "em pé" (uma palavra por linha), os
cards aparecem "achatados/comprimidos na largura", e falta contraste de cor**
entre blocos que deveriam estabelecer hierarquia visual. O subtítulo do herói
da capa — "Transforme o futuro da terapia ABA digital com o Grupo Gradual" —
é apenas o exemplo mais visível; o mesmo defeito aparece no Resumo Executivo,
nas seções narrativas, nos cards de destaque e nos grids de métricas.

Correções anteriores foram cirúrgicas (adicionar `w-full` aqui, `min-w-0`
acolá, `max-w-prose` em um componente, `prose-measure` em outro, e por fim
hacks como `style={{ display: 'block', width: '100%' }}` em
`ExecutiveSummarySection.tsx`). Cada uma resolveu um ponto e o defeito
reapareceu logo ao lado. A causa não é local: é a **coexistência de três
estratégias concorrentes de layout**:

1. Utilitários Tailwind (`w-full`, `max-w-*`, `flex`, `grid`, `min-w-0`).
2. CSS legado com `!important` e declarações duplicadas
   (`ExecutiveSummary.css` tem `width: 100% !important` e `display: block !important`).
3. Estilos inline de largura/display direto no JSX
   (`style={{ display: 'block' }}`, `style={{ width: '100%', display: 'block' }}`).

O resultado é imprevisível: blocos com `max-width` mas sem `width: 100%`
explícito encolhem para `min-content` dentro de pais flex/grid; cards em
`flex-col sm:flex-row` colapsam sem `min-width: 0` nos filhos; valores de cor
em hex literal (`#1B3A6B`, `#2D9B8A`, `#F5A623`) são redeclarados em cada
componente enquanto os tokens de `theme.ts` e `@theme` em `index.css` ficam
subutilizados, abrindo margem para combinações de baixo contraste em variantes
`light`/`dark`/`teal`.

O escopo deste bugfix é **refatorar o sistema de HTML e CSS/SCSS** da proposta
para estabelecer uma única fonte de verdade de layout e cor, de forma que a
classe de bug acima deixe de ser reintroduzível. A proposta em si (conteúdo,
capítulos, componentes interativos, modos de apresentação, acessibilidade)
permanece inalterada em comportamento.

## Bug Analysis

### Current Behavior (Defect)

Os defeitos observáveis hoje, agrupados por sintoma. O bug é caracterizado
pela união de três sub-condições — texto-coluna (C1), card-achatado (C2) e
contraste-insuficiente (C3) — mais os anti-padrões estruturais (C4) que
reintroduzem C1–C3 a cada nova seção.

**C1 — Texto em coluna ("cada palavra em uma linha")**

1.1 WHEN o subtítulo do herói da capa ("Transforme o futuro da terapia ABA digital com o Grupo Gradual") é renderizado em viewports ≥ 768px THEN o sistema renderiza o parágrafo com largura efetiva menor que a largura das palavras individuais, quebrando linha a cada uma ou duas palavras e produzindo um bloco quase vertical.

1.2 WHEN um parágrafo ou `lead` narrativo é colocado dentro de um container `flex` ou `grid` sem `min-width: 0` nos filhos THEN o sistema encolhe o parágrafo até `min-content`, fazendo o texto renderizar como uma coluna estreita em vez de linhas horizontais de leitura.

1.3 WHEN um bloco de texto usa apenas `max-w-prose` (≈ 65ch) como restrição de largura, sem `width: 100%` explícito THEN o sistema trata `max-width` como teto sem piso, permitindo que o bloco encolha abaixo da medida de leitura natural dentro de pais flex/grid.

1.4 WHEN o cabeçalho do capítulo em `SectionRenderer` renderiza o subtítulo com `text-lg md:text-xl text-gray-600 leading-relaxed` dentro do wrapper `mb-12 w-full max-w-4xl` THEN o sistema exibe o subtítulo em larguras reduzidas em algumas rotas, replicando o mesmo sintoma de linhas muito curtas.

**C2 — Cards achatados / comprimidos na largura**

1.5 WHEN cards narrativos de `NarrativeSection` ou `ExecutiveSummarySection` são distribuídos em grids multi-coluna no desktop THEN o sistema renderiza cada card com largura insuficiente para acomodar copy executiva, forçando o texto do card a quebrar a cada poucas palavras.

1.6 WHEN um card usa layout interno `flex-col sm:flex-row` sem garantia de `width: 100%` e `min-width: 0` nos filhos THEN o sistema deixa o ícone dominar a caixa e o bloco de texto colapsar para uma coluna estreita, deslocando o título e o corpo para dentro de um espaço insuficiente.

1.7 WHEN o grid financeiro do Resumo Executivo é renderizado (hoje com `grid grid-cols-1 md:grid-cols-3 gap-8` dentro de `.exec-financials`) THEN o sistema apresenta as células com proporções imprevisíveis porque o container externo combina `min-width: 300px` em CSS legado com utilitários Tailwind, produzindo cards que ora extrapolam ora encolhem.

1.8 WHEN um autor de seção precisa forçar o comportamento correto THEN o sistema aceita e exige hacks como `style={{ display: 'block', width: '100%' }}` no JSX (presentes em `ExecutiveSummarySection.tsx`) para evitar o colapso, evidenciando que o sistema de layout subjacente não é previsível por si só.

**C3 — Contraste de cor insuficiente / psicologia de cor inconsistente**

1.9 WHEN blocos de texto secundário usam tons de cinza (`text-gray-400`, `text-gray-500`) sobre fundos claros com baixa diferença de luminosidade THEN o sistema produz pares texto/fundo que podem cair abaixo do contraste WCAG AA para texto corrido em partes da proposta.

1.10 WHEN o mesmo papel semântico (por exemplo, "cor de confiança" ou "cor de urgência") é implementado em componentes diferentes com hex literal diferente ou com a mesma cor aplicada a papéis diferentes THEN o sistema apresenta um uso de cor incoerente, enfraquecendo a hierarquia visual e a intenção de psicologia de cor (confiança, crescimento, urgência).

1.11 WHEN uma seção com variante `dark` ou `teal` embrulha internamente componentes escritos para fundo claro THEN o sistema renderiza texto, bordas e ícones com contraste imprevisível entre si, sem um contrato explícito de qual variante o componente interno suporta.

**C4 — Anti-padrões estruturais que reintroduzem C1–C3**

1.12 WHEN um componente de seção importa um arquivo CSS próprio com regras `!important` (ex.: `ExecutiveSummary.css` com `width: 100% !important; display: block !important;`) THEN o sistema cria camadas concorrentes de especificidade em cima do Tailwind, fazendo correções feitas por utilitários serem sobrescritas ou depender de ordem de importação.

1.13 WHEN arquivos CSS legados redeclaram propriedades tipográficas e de largura já cobertas por utilitários Tailwind (ex.: `.exec-title { font-size: 3rem }`, `.exec-lead { max-width: none; width: 100% }`) THEN o sistema duplica a escala visual fora do sistema de design, produzindo divergência entre seções refatoradas e seções legadas.

1.14 WHEN o JSX usa `style={{ display: 'block' }}` e `style={{ width: '100%', display: 'block' }}` inline em múltiplos pontos do mesmo componente (hoje visível em `ExecutiveSummarySection.tsx`) THEN o sistema exibe que o layout não é previsível sem esses hacks, e cada novo autor precisa descobrir empiricamente quais hacks aplicar.

1.15 WHEN valores hex da paleta institucional (`#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#102642`) são repetidos como literais dentro de componentes (CoverSection, NarrativeSection, ExecutiveSummarySection, SectionRenderer) em vez de consumidos a partir dos tokens declarados em `src/styles/theme.ts` e nos `@theme` vars de `src/index.css` THEN o sistema oferece múltiplas fontes de verdade para a mesma decisão de marca, permitindo divergência silenciosa.

1.16 WHEN novas seções são adicionadas à proposta THEN o sistema não oferece primitivas compartilhadas de "parágrafo narrativo", "card" e "métrica" com comportamento de largura travado, obrigando cada autor a recompor utilitários em ordem específica e introduzindo regressões de C1 e C2.

### Expected Behavior (Correct)

Para cada defeito acima, o comportamento correto esperado após o refactor.

**Correspondente a C1 — Texto em coluna**

2.1 WHEN o subtítulo do herói da capa ("Transforme o futuro da terapia ABA digital com o Grupo Gradual") é renderizado em viewports ≥ 320px THEN o sistema SHALL exibir o parágrafo em linhas horizontais de leitura, com largura efetiva suficiente para acomodar ao menos cinco palavras por linha em viewports ≥ 768px e sem nunca renderizar palavras isoladas por linha em viewports ≥ 320px (fora casos naturais de uma única palavra longa).

2.2 WHEN um parágrafo ou `lead` narrativo é colocado dentro de um container `flex` ou `grid` THEN o sistema SHALL garantir `min-width: 0` no filho e `width: 100%` no bloco de texto, de forma que o parágrafo ocupe a largura disponível até o limite de `max-width` definido pela primitiva de leitura.

2.3 WHEN um bloco de texto aplica medida de leitura (`prose`/`max-w-prose` ≈ 65–75ch) THEN o sistema SHALL aplicar simultaneamente `width: 100%` e `max-width: <medida>`, de modo que o bloco respeite a medida como teto e também ocupe a largura disponível como piso, sem encolher abaixo dela dentro de pais flex/grid.

2.4 WHEN o cabeçalho de capítulo em `SectionRenderer` é renderizado THEN o sistema SHALL usar as mesmas primitivas de leitura das demais seções, de modo que o subtítulo do capítulo se comporte identicamente aos subtítulos internos (mesma largura efetiva em mesmos viewports, mesma hierarquia de fonte e cor).

**Correspondente a C2 — Cards achatados**

2.5 WHEN cards narrativos são distribuídos em grids multi-coluna no desktop THEN o sistema SHALL limitar o grid a um número de colunas compatível com copy executiva legível (no máximo duas colunas em viewports < 1280px; no máximo três colunas em viewports ≥ 1280px para cards curtos de métrica), preservando largura mínima utilizável por card.

2.6 WHEN um card usa layout interno com `flex` em qualquer eixo THEN o sistema SHALL aplicar `min-width: 0` no filho que contém texto e `width: 100%` no bloco textual, impedindo colapso para `min-content`.

2.7 WHEN o grid financeiro do Resumo Executivo é renderizado THEN o sistema SHALL usar uma única primitiva compartilhada de "métrica" (valor + rótulo) com largura interna travada, eliminando a dependência de regras do CSS legado (`min-width: 300px` em `.exec-financials` etc.).

2.8 WHEN um autor de seção precisa compor um bloco que antes exigia hacks inline THEN o sistema SHALL oferecer primitivas (ex.: `Prose`, `Card`, `Metric`, `Stack`) cujo contrato de largura elimina a necessidade de `style={{ display: 'block', width: '100%' }}` em qualquer arquivo `.tsx` da proposta.

**Correspondente a C3 — Contraste de cor**

2.9 WHEN texto corrido ou secundário é renderizado em qualquer variante de seção THEN o sistema SHALL garantir contraste WCAG AA (≥ 4.5:1 para texto normal, ≥ 3:1 para texto grande) entre o texto e seu fundo imediato, para todos os pares cor/fundo usados na proposta.

2.10 WHEN uma cor da paleta institucional é aplicada a um papel semântico (confiança, crescimento, urgência, apoio, superfície-clara, superfície-escura) THEN o sistema SHALL aplicá-la por meio de um token nomeado (ex.: `--color-trust`, `--color-growth`, `--color-urgency`) com uso documentado, de modo que cada papel tenha um e apenas um token e cada token tenha um papel claro.

2.11 WHEN uma seção declara uma variante visual (`light`, `dark`, `teal`) THEN o sistema SHALL fornecer um contrato explícito de quais primitivas e quais tokens são válidos naquela variante, de modo que componentes internos herdem combinações de cor com contraste garantido por construção.

**Correspondente a C4 — Anti-padrões estruturais**

2.12 WHEN a base de código é inspecionada após o refactor THEN o sistema SHALL conter zero arquivos CSS legados específicos de seção com regras `!important` sobre largura, display ou tipografia (o arquivo `ExecutiveSummary.css` SHALL ser removido ou consolidado dentro do sistema de design).

2.13 WHEN a base de código é inspecionada após o refactor THEN o sistema SHALL conter zero estilos inline em JSX da forma `style={{ display: '...' }}`, `style={{ width: '...' }}` ou `style={{ display: '...', width: '...' }}` aplicados a elementos de layout nos componentes de `src/components/sections/**`.

2.14 WHEN a base de código é inspecionada após o refactor THEN o sistema SHALL centralizar as decisões de largura em um conjunto finito e documentado de containers (ex.: `page`, `content`, `prose`) definidos em um único lugar, e nenhum componente de seção SHALL declarar seus próprios valores de `max-width` fora desse conjunto.

2.15 WHEN a base de código é inspecionada após o refactor THEN o sistema SHALL consumir as cores da paleta institucional exclusivamente a partir dos tokens de `src/styles/theme.ts` e/ou das variáveis `@theme` de `src/index.css`, sem hex literais duplicados em arquivos `.tsx` ou `.css` para cores de marca.

2.16 WHEN uma nova seção é adicionada à proposta THEN o sistema SHALL oferecer primitivas compartilhadas (`Prose`, `Card`, `Metric`, containers de largura) com comportamento de largura, contraste e tipografia travado por construção, de modo que seguir a primitiva seja o caminho mais curto e que divergir dela seja a exceção explícita.

### Unchanged Behavior (Regression Prevention)

O refactor é estrutural (HTML e CSS). Nenhum dos comportamentos abaixo deve
ser alterado.

**Conteúdo e navegação**

3.1 WHEN o usuário abre a proposta THEN o sistema SHALL CONTINUAR A renderizar os seis capítulos existentes (`visao-geral`, `mercado`, `produto`, `investimento`, `execucao`, `termos`) com seus títulos, subtítulos e ordem atuais.

3.2 WHEN o usuário navega entre capítulos via `ProposalNavbar` ou via hash da URL THEN o sistema SHALL CONTINUAR A resolver os slugs de capítulo e de seção para os mesmos destinos de hoje, sem alterar rotas ou nomes de âncora.

3.3 WHEN as 22 seções já implementadas são renderizadas (capa, resumo executivo, produto, protocolos, projeções, governança, objeções, e as demais atualmente em produção) THEN o sistema SHALL CONTINUAR A exibir o mesmo conteúdo textual, na mesma ordem e com a mesma hierarquia semântica de cabeçalhos.

**Componentes interativos**

3.4 WHEN o usuário interage com `ROISimulator` THEN o sistema SHALL CONTINUAR A produzir os mesmos resultados de cálculo e SHALL CONTINUAR A preservar a propriedade de monotonicidade do ROI já validada por testes.

3.5 WHEN o usuário interage com `SofthouseCalculator` THEN o sistema SHALL CONTINUAR A retornar os mesmos valores para os mesmos insumos e SHALL CONTINUAR A preservar a pureza da formatação BRL já validada por testes.

3.6 WHEN o usuário interage com `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`, `ObjectionAccordion` e `IntentForm` THEN o sistema SHALL CONTINUAR A executar sua lógica de estado, seus eventos e suas propriedades já validadas (soma das tranches, idempotência de toggles, contagem regressiva, envio do formulário) sem alteração de comportamento.

3.7 WHEN as sete PBTs existentes na suíte de testes são executadas THEN o sistema SHALL CONTINUAR A passar todas elas sem modificação nos testes.

**Modos, responsividade e acessibilidade**

3.8 WHEN o usuário alterna entre `landing` e `presentation` THEN o sistema SHALL CONTINUAR A respeitar as regras de ambos os modos (rolagem contínua em landing; uma seção por vez em presentation) e SHALL CONTINUAR A preservar foco e `scrollIntoView` como hoje.

3.9 WHEN a proposta é aberta em viewports ≤ 640px THEN o sistema SHALL CONTINUAR A reorganizar grids multi-coluna em coluna única preservando a ordem semântica do conteúdo.

3.10 WHEN o usuário tem `prefers-reduced-motion` ativo THEN o sistema SHALL CONTINUAR A desativar animações decorativas, preservando apenas transições essenciais.

3.11 WHEN o conteúdo é lido por leitor de tela THEN o sistema SHALL CONTINUAR A expor os landmarks semânticos existentes (`header`, `main`, `nav`, `footer`, `article`), a hierarquia de cabeçalhos e os rótulos acessíveis.

**Identidade visual e CTA**

3.12 WHEN a paleta institucional é aplicada THEN o sistema SHALL CONTINUAR A usar as cores `#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA` e `#102642` como referência de marca; a consolidação em tokens SHALL preservar esses valores, não substituí-los.

3.13 WHEN o `StickyCTA` e os botões de ação principais ("Explorar Proposta", "Baixar PDF", "Agendar Reunião") são renderizados THEN o sistema SHALL CONTINUAR A expor os mesmos rótulos, ícones e ações, sem alterar a copy comercial ou o fluxo de conversão.

3.14 WHEN animações de entrada de seção em `framer-motion` são aplicadas THEN o sistema SHALL CONTINUAR A disparar os mesmos `initial`/`animate`/`transition` já definidos, com a mesma duração e easing, exceto onde uma animação dependia diretamente de um hack de layout que esteja sendo removido.
