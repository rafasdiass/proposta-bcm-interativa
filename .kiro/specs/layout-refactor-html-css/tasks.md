# Plano de Implementação: layout-refactor-html-css

## Visão Geral

Este plano aplica a metodologia de **bug condition** ao refactor estrutural de
HTML e CSS/SCSS da Proposta BCM Interativa. O objetivo é eliminar a classe
recorrente de defeitos C1 (texto em coluna), C2 (cards achatados),
C3 (contraste insuficiente) e C4 (anti-padrões estruturais que reintroduzem
C1–C3) — descritos em `bugfix.md` 1.1–1.16 — sem regredir comportamento já
funcional (`bugfix.md` 3.1–3.14). A estratégia é substituir as três
estratégias concorrentes de layout de hoje (utilitários Tailwind + CSS
legado com `!important` + estilos inline) por um conjunto pequeno de
**primitivas compartilhadas** (`Prose`, `Card`, `Metric`, `Stack`,
`Container`s, `ChapterHeader`) com **contrato de largura travado** e um
**contrato de variante** que garante contraste WCAG AA por construção.

A ordem de execução segue rigorosamente o protocolo de bug condition:

1. **Task 1** — escrever teste exploratório property-based que **FALHA** no
   código atual (confirma a existência de C1/C2/C3).
2. **Task 2** — escrever testes de preservation property-based que **PASSAM**
   no código atual (fixa o baseline a preservar: conteúdo, landmarks,
   hierarquia de headings, componentes interativos, modos,
   `prefers-reduced-motion`).
3. **Tasks 3–13** — aplicar o refactor em 11 checkpoints sequenciais
   (migration order do `design.md` seção 6): infra → piloto → compartilhado
   → NarrativeSection → ExecutiveSummary (com delete do CSS legado no mesmo
   commit) → batches 1–5 → verificação estática final.
4. **Task 14** — re-executar o teste exploratório da Task 1: agora deve
   **PASSAR** (fix checking).
5. **Task 15** — re-executar os testes de preservation da Task 2 **mais os
   7 PBTs existentes**: devem **continuar passando** (preservation
   checking).
6. **Task 16** — checkpoint final: `npm run build`, `npm run lint` e
   `npm run test:run` todos verdes.

> **Núcleo da metodologia**: Task 1 DEVE FALHAR antes do fix e DEVE PASSAR
> depois. Task 2 DEVE PASSAR antes do fix e DEVE CONTINUAR PASSANDO depois.
> Essa dupla simétrica é o coração da validação de bug condition — o fix
> não é considerado válido enquanto qualquer uma das quatro asserções
> anteriores não for observada empiricamente.

Cada tarefa referencia:

- `_Requirements:_` — cláusulas numéricas do `bugfix.md` (2.1–2.16 para
  comportamento esperado; 3.1–3.14 para preservation).
- `_Properties:_` — Properties A–F do `design.md` seção _Correctness
  Properties_.

Sub-tarefas opcionais são marcadas com `*` após o checkbox.

## Task Dependency Graph

Os 11 checkpoints de migração do `design.md` seção 6 são estritamente
sequenciais (cada um precisa do anterior verde para começar). Dentro dos
batches 1–5, as migrações individuais de seção podem rodar em paralelo
(são independentes entre si desde que Tasks 3 e 5 estejam concluídas).

```
Task 1 (exploratório — FALHA)      Task 2 (preservation — PASSA)
       │                                    │
       └──────────────┬─────────────────────┘
                      ▼
              Task 3 (Infra: primitivas + tokens + variantContract + useVariant)
                      │
                      ▼
              Task 4 (Piloto: CoverSection)
                      │
                      ▼
              Task 5 (Compartilhado: SectionRenderer → ChapterHeader)
                      │
                      ▼
              Task 6 (NarrativeSection)
                      │
                      ▼
              Task 7 (ExecutiveSummarySection + DELETE ExecutiveSummary.css — mesmo commit)
                      │
                      ▼
              Task 8 (Batch 1 — light product)   ← 8.1..8.5 paralelizáveis
                      │
                      ▼
              Task 9 (Batch 2 — teal market)     ← 9.1..9.2 paralelizáveis
                      │
                      ▼
              Task 10 (Batch 3 — dark investment) ← 10.1..10.5 paralelizáveis
                      │
                      ▼
              Task 11 (Batch 4 — light execution) ← 11.1..11.6 paralelizáveis
                      │
                      ▼
              Task 12 (Batch 5 — dark close)      ← 12.1..12.2 paralelizáveis
                      │
                      ▼
              Task 13 (Verificação estática final — regex inventory Property F)
                      │
                      ▼
              Task 14 (Fix checking — Task 1 deve PASSAR)
                      │
                      ▼
              Task 15 (Preservation checking — Task 2 + 7 PBTs devem PASSAR)
                      │
                      ▼
              Task 16 (Checkpoint final — build + lint + test:run)
```

Regras de entrada em cada checkpoint: build verde, lint verde e Task 2
passando sem alteração nos testes. Se alguma seção do batch atual quebrar
qualquer uma dessas três invariantes, o batch para e a regressão é
endereçada antes de prosseguir.

## Tasks

- [ ] 1. Escrever teste exploratório da bug condition (ANTES do fix)
  - **Property 1: Bug Condition** - C1 (texto em coluna), C2 (card achatado), C3 (contraste insuficiente)
  - **CRITICAL**: Este teste property-based DEVE FALHAR no código atual — a falha confirma a existência das sub-condições C1, C2 e C3
  - **DO NOT attempt to fix the test or the code when it fails** — é o comportamento esperado nesta etapa
  - **GOAL**: Surface counterexamples concretos que demonstrem cada sub-sintoma de `isBugCondition` (C1, C2, C3) nas seções mais visíveis (`CoverSection`, `SectionRenderer`/`ChapterHeader`, `NarrativeSection`, `ExecutiveSummarySection`)
  - **Scoped PBT Approach**: usar `fast-check` com gerador escopado para reprodutibilidade:
    - `fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1440, 1920)` (viewport)
    - `fc.constantFrom('light', 'dark', 'teal')` (variant)
    - `fc.constantFrom('default', 'lead', 'wide')` (measure)
    - `fc.constantFrom('flex', 'grid', 'flow')` (parentContext para C1/C2)
  - Criar arquivo `src/components/__exploratory__/BugCondition.exploratory.test.tsx` isolado em um diretório `__exploratory__` (para não ser executado em CI normal depois que o refactor passar)
  - Instalar/garantir presença de `wcag-contrast` (ou equivalente puro) em `devDependencies` para cálculo determinístico de contraste em C3
  - **Sub-asserções obrigatórias:**
    - **C1.a — Subtítulo da capa** (`CoverSection`): renderizar em viewport `1440×900`, localizar `<p>` com texto "Transforme o futuro da terapia ABA digital com o Grupo Gradual" via `screen.getByText`, medir `getBoundingClientRect().width` e `countRenderedLines`, asserir `wordsPerLine ≥ 2` (esperado contraexemplo: `max-w-3xl` sem `min-width:0` em ancestral flex reduz largura abaixo da medida natural)
    - **C1.b — Subtítulo do ChapterHeader** (via `SectionRenderer`): renderizar cada uma das 6 páginas em viewport `768×1024`, localizar o `<p>` dentro de `mb-12 w-full max-w-4xl` (heurística: `closest('[class*="max-w-4xl"]') p`), asserir `wordsPerLine ≥ 2`
    - **C1.c — Lead narrativo** (via `NarrativeSection` com `tone="dark"`): renderizar em viewport `1024×768` dentro de um pai `display: grid; grid-template-columns: 1fr 1fr` mockado, asserir `wordsPerLine ≥ 2` em todo `<p>` narrativo
    - **C2.a — Grid de cards da NarrativeSection**: renderizar com 4 cards em viewport `1024×768`, medir cada `card.getBoundingClientRect().width`, asserir `|width − (parent.contentWidth − gap) / 2| ≤ 4px` e `wordsPerLine(texto interno) ≥ 3`
    - **C2.b — Grid financeiro do ExecutiveSummary**: renderizar `ExecutiveSummarySection` em viewport `1280×800`, para cada `.fin-item` asserir `|width − (parent / 3 − gap)| ≤ 4px` (esperado contraexemplo: `min-width: 300px` em `.exec-financials` distorce a proporção)
    - **C3.a — Pares (text, bg) atuais**: extrair hardcoded a tabela de pares hoje em uso (`#a5b4fc` sobre gradiente `#1b3a6b → #102642`; `text-gray-400` sobre `bg-white`; `text-teal-50` sobre `#2D9B8A`; `text-[#F5A623]` sobre `#2D9B8A` em `NarrativeSection teal`), iterar e asserir `contrastRatio(fg, bg) ≥ 4.5` para texto normal / `≥ 3.0` para texto grande
  - Rodar em código UNFIXED: `npm run test:run -- src/components/__exploratory__/BugCondition.exploratory.test.tsx`
  - **EXPECTED OUTCOME**: FALHA em pelo menos uma asserção de cada grupo (C1, C2, C3)
  - **Documentar contraexemplos no cabeçalho do arquivo de teste (JSDoc)**, por exemplo:
    - "CoverSection subtitle @ 1440px: wordsPerLine = 1.4 (< 2) — `max-w-3xl` sem `min-width:0` em flex parent"
    - "ExecutiveSummary .fin-item @ 1280px: width = 300px fixo (esperado ≈ 374px), causa `min-width: 300px` em `.exec-financials`"
    - "ExecutiveSummary `.fin-label` @ #a5b4fc / bg #1b3a6b: ratio = 4.1 (< 4.5)"
  - Marcar tarefa como concluída quando o teste estiver escrito, executado e **todos os contraexemplos documentados**
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11_
  - _Properties: A, B, C_

- [ ] 2. Escrever testes de preservation (ANTES do fix, observation-first)
  - **Property 2: Preservation** - textContent, landmarks, hierarquia de headings, props dos 8 componentes interativos, modo, motion, responsividade
  - **IMPORTANTE**: Seguir metodologia observation-first — executar o código UNFIXED primeiro, capturar o comportamento real observado, então escrever property-based tests sobre esse baseline
  - **GOAL**: Garantir que o refactor não quebre o que já funciona — conteúdo das 22 seções, 8 componentes interativos, landmarks, hierarquia de cabeçalhos, alternância Landing/Presentation, `prefers-reduced-motion`, colapso responsivo em ≤ 640px
  - Criar arquivo `src/components/__preservation__/Layout.preservation.test.tsx`
  - **Observação 1 — textContent das 22 seções** (cobre Property D, Requirements 3.1, 3.2, 3.3):
    - Renderizar cada uma das 22 seções via `SectionRenderer` em viewport `1440×900` no código atual
    - Capturar `element.textContent` concatenado como snapshot de baseline
    - PBT: `fc.constantFrom(...22 slugs) × fc.constantFrom(375, 768, 1440)` → asserir que todo substring de tamanho ≥ 20 presente na snapshot continua presente após re-render (substring match, imune a reestruturação do DOM)
  - **Observação 2 — landmarks e hierarquia de headings** (cobre Property D, Requirement 3.11):
    - Para cada uma das 6 páginas (`visao-geral`, `mercado`, `produto`, `investimento`, `execucao`, `termos`), capturar: (a) conjunto de landmarks (`role="banner|main|navigation|contentinfo|article"`), (b) sequência ordenada de headings (`h1 → h2 → h3`), (c) conjunto de `aria-label`/`aria-labelledby` declarados
    - PBT: re-renderizar a mesma página e asserir igualdade de conjunto para landmarks, igualdade de sequência para headings e igualdade de conjunto para aria-labels
  - **Observação 3 — props dos 8 componentes interativos** (cobre Property D, Requirements 3.4, 3.5, 3.6):
    - Para cada um de `ROISimulator`, `SofthouseCalculator`, `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`, `ObjectionAccordion`, `IntentForm`, identificar a(s) seção(ões) que o monta e capturar snapshot das props de montagem iniciais
    - PBT: renderizar a seção e asserir que as props-chave (tranches, módulos, questões, deadline, etc.) são idênticas
  - **Observação 4 — modo, motion e responsividade** (cobre Property E, Requirements 3.8, 3.9, 3.10, 3.14):
    - `fc.constantFrom('landing', 'presentation') × fc.boolean() (reducedMotion) × fc.constantFrom('light', 'dark', 'teal') × fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1440)`
    - Asserir: (a) em `presentation` apenas 1 seção tem `display: block`/demais `hidden`, (b) com `matchMedia('(prefers-reduced-motion: reduce)')=true` transições decorativas > 100ms ficam desativadas (reusar lógica já validada em `Section.animation.test.tsx`), (c) mapping variant → background/text é o mesmo declarado hoje em `theme.ts` `sectionVariants`, (d) viewport ≤ 640px colapsa grids multi-coluna em 1 coluna
  - **Observação 5 — StickyCTA e CTAs principais** (cobre Property D, Requirement 3.13):
    - Renderizar `App`, asserir presença dos rótulos literais "Explorar Proposta", "Baixar PDF", "Agendar Reunião" no DOM
  - **Observação 6 — paleta institucional preservada como referência** (cobre Requirement 3.12):
    - Capturar hoje os hex `#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA`, `#102642` presentes em `src/index.css` bloco `@theme`; asserir que continuam presentes na fonte de tokens após o refactor (apenas movidos/consolidados, nunca substituídos)
  - Mínimo de 200 iterações por PBT
  - Rodar em código UNFIXED: `npm run test:run -- src/components/__preservation__/Layout.preservation.test.tsx`
  - **EXPECTED OUTCOME**: **TODOS PASSAM** no código atual (estabelece o baseline que deve ser preservado após o refactor)
  - Se qualquer PBT falhar antes do fix, o baseline está incorreto — ajustar a snapshot de observação (não o SUT)
  - Marcar tarefa como concluída quando todos os PBTs passarem no código unfixed
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14_
  - _Properties: D, E_

- [ ] 3. Checkpoint 1 — Infra: criar primitivas, role tokens, variantContract e useVariant (ZERO mudanças em seções)
  - Criar toda a infra compartilhada **sem tocar em nenhum arquivo de `src/components/sections/**`**
  - Ao final deste checkpoint, as primitivas existem mas nenhuma seção as consome ainda — o build deve continuar verde
  - _Requirements: 2.8, 2.14, 2.15, 2.16_
  - _Properties: A, B, C, F_

  - [ ] 3.1 Criar `src/components/primitives/Prose.tsx` com API pública exata do `design.md` seção 5
    - Props: `measure?: 'default' | 'lead' | 'wide'` (mapeia para `max-w-[70ch] | max-w-[60ch] | max-w-[80ch]`), `tone?: 'primary' | 'secondary' | 'muted'` (consome role token), `as?: 'p' | 'div' | 'span'` (default `'p'`), `className?`, `children`
    - Classes default SEMPRE aplicadas: `w-full min-w-0` (piso de largura + não colapsa em flex/grid) + `max-w-[Xch]` conforme `measure` + `leading-relaxed` + classe de `text-*` do role token
    - Não aceita `style={{ width | display }}`
    - Nenhum arquivo CSS próprio — tudo via utilitárias Tailwind + role tokens
    - _Bug_Condition: C1 — Prose que não tem `w-full min-w-0` colapsa a `min-content` em flex/grid_
    - _Expected_Behavior: `<Prose>` dentro de qualquer flex/grid mantém `width ≥ min(available, natural-single-line)` e `wordsPerLine ≥ 2`_
    - _Requirements: 2.1, 2.2, 2.3, 2.16_
    - _Properties: A, F.4_

  - [ ] 3.2 Criar `src/components/primitives/Card.tsx` com API pública exata do `design.md` seção 5
    - Props: `tone?: 'surface' | 'elevated' | 'glass'` (default `'surface'`), `variant?: 'light' | 'dark' | 'teal'` (herdado via `useVariant()` com override opcional), `padding?: 'sm' | 'md' | 'lg'` (default `'md'`), `radius?: 'md' | 'lg' | 'xl' | '2xl'` (default `'xl'`), `className?`, `children`
    - Classes default SEMPRE aplicadas: `w-full min-w-0` (bloqueia C2) + `rounded-{radius}` + `p-{padding}` consolidados + `bg-{tone}-{variant}` + `text-{role}-{variant}`
    - Não aceita `style={{ width | display | backgroundColor | color }}`
    - Nenhum arquivo CSS próprio
    - _Bug_Condition: C2 — card sem `w-full min-w-0` dentro de grid multi-coluna colapsa a `min-content`_
    - _Expected_Behavior: `|cardWidth − (parent − (N−1)×gap) / N| ≤ 4px` e `wordsPerLine(texto interno) ≥ 3`_
    - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.16_
    - _Properties: B, F.4_

  - [ ] 3.3 Criar `src/components/primitives/Metric.tsx` com API pública exata do `design.md` seção 5
    - Props: `value: ReactNode`, `label: string`, `valueTone?: 'urgency' | 'growth' | 'trust'` (default `'urgency'`), `align?: 'start' | 'center'` (default `'start'`)
    - Classes default: raiz `w-full min-w-0 flex flex-col gap-1`; value `text-3xl md:text-4xl font-bold text-{valueTone}-on-{variant}`; label `text-sm uppercase tracking-wide text-secondary-on-{variant}`
    - Substitui `.fin-item` + `.fin-label` + `.fin-value` do CSS legado e os cards de métrica ad hoc de `NarrativeSection`
    - _Bug_Condition: C2, C3 em blocos de métrica_
    - _Expected_Behavior: métrica renderiza largura estável dentro de grid e pares `(text, bg)` respeitam WCAG AA_
    - _Requirements: 2.7, 2.10, 2.16_
    - _Properties: B, C, F.4_

  - [ ] 3.4 Criar `src/components/primitives/Stack.tsx` com API pública exata do `design.md` seção 5
    - Props: `direction?: 'column' | 'row' | 'grid'` (default `'column'`), `gap?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'`, `cols?: { base?: 1|2|3|4, sm?, md?, lg?, xl? }` (apenas em `direction='grid'`), `align?`, `justify?` (apenas em `row`/`column`)
    - Classes default: `w-full min-w-0`
      - `direction='grid'` → `grid grid-cols-{cols.base} sm:grid-cols-{cols.sm} … gap-{gap}`
      - `direction='column'` → `flex flex-col gap-{gap}`
      - `direction='row'` → `flex flex-row gap-{gap} min-w-0`
    - **Regra invariante**: em `direction='grid'`, `cols.base` NUNCA é > 1 (preserva Requirement 3.9)
    - _Requirements: 2.5, 2.16, 3.9_
    - _Properties: B, E, F.4_

  - [ ] 3.5 Criar `src/components/primitives/Container.tsx` exportando `PageContainer`, `ContentContainer`, `ProseContainer` com max-widths canônicos
    - `PageContainer`: `w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8`
    - `ContentContainer`: `w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`
    - `ProseContainer`: `w-full max-w-[70ch] mx-auto`
    - **Invariante do design**: após o refactor, nenhum componente em `sections/**` declara `max-w-*` próprio fora desse trio (exceção explícita deve ser justificada em código review)
    - _Requirements: 2.14_
    - _Properties: F.4_

  - [ ] 3.6 Adicionar role tokens ao bloco `@theme` de `src/index.css`
    - Adicionar (sem remover valores hex existentes da paleta):
      ```
      --color-support: #8B7EC8;
      --color-surface-light: #F8F9FA;
      --color-surface-dark: #102642;
      --color-text-primary-on-light: #1B3A6B;
      --color-text-secondary-on-light: #4b5563;
      --color-text-muted-on-light: #6b7280;
      --color-text-primary-on-dark: #ffffff;
      --color-text-secondary-on-dark: #cbd5e1;
      --color-text-muted-on-dark: #94a3b8;
      --color-text-primary-on-teal: #ffffff;
      --color-text-secondary-on-teal: #e6fffa;
      --color-text-accent-on-teal: #F5A623;
      ```
    - Em `@layer components`, declarar as classes `.role-primary`, `.role-secondary`, `.role-muted`, `.role-accent` lendo `var(--color-text-…-on-{variant})` — permite aplicação em qualquer primitiva sem condicionais JSX
    - Os hex `#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA`, `#102642` **permanecem** como fonte de verdade em `@theme` (Requirement 3.12)
    - _Requirements: 2.10, 2.15, 3.12_
    - _Properties: C, F.3_

  - [ ] 3.7 Adicionar `variantContract` a `src/styles/theme.ts`
    - Adicionar o objeto `variantContract` com a estrutura exata do `design.md` seção 2 (chaves `light | dark | teal`, cada uma com `surface` e `text.{primary, secondary, muted, accent}` apontando para `var(--color-*)`)
    - Exportar `export type Variant = keyof typeof variantContract`
    - Adicionar teste `src/styles/variantContract.test.ts` iterando sobre todos os 12 pares `(variant, role)` e asserindo `contrastRatio(text, surface) ≥ 4.5` para texto normal e `≥ 3.0` para texto grande (usa `wcag-contrast`)
    - _Requirements: 2.9, 2.10, 2.11, 2.15_
    - _Properties: C_

  - [ ] 3.8 Criar `src/hooks/useVariant.ts`
    - Hook `useVariant(): { variant: Variant, contract: typeof variantContract[Variant] }`
    - Lê o `VariantContext` criado em `src/components/sections/Section.tsx` (atualização coordenada: Section provê, primitivas consomem — mas Section.tsx só passa a prover o contexto na Task 4, piloto; aqui criamos apenas o hook e o Context default)
    - Fallback default: `{ variant: 'light', contract: variantContract.light }` quando usado fora de contexto
    - Adicionar teste `src/hooks/useVariant.test.ts` cobrindo leitura dentro e fora de `VariantContext.Provider`
    - _Requirements: 2.11_
    - _Properties: C_

  - [ ] 3.9 Criar `src/components/primitives/ChapterHeader.tsx`
    - Props: `index: number`, `total: number`, `title: string`, `subtitle: string`, `variant: 'light' | 'dark' | 'teal'`
    - Composto internamente de `Stack` + `Prose tone="accent"` (eyebrow "Capítulo N de M") + `<h1>` com classe `text-4xl md:text-5xl lg:text-6xl font-bold role-primary` + `<Prose measure="lead" tone="secondary">` com o subtítulo
    - **Nenhum hex literal** no arquivo
    - _Bug_Condition: C1, C3 no cabeçalho de capítulo_
    - _Expected_Behavior: subtítulo comporta-se igual aos leads internos (wordsPerLine ≥ 2) e pares de cor respeitam AA_
    - _Requirements: 2.4, 2.10, 2.11_
    - _Properties: A, C, F.4_

  - [ ] 3.10 Criar barrel `src/components/primitives/index.ts`
    - Exporta `{ Prose, Card, Metric, Stack, PageContainer, ContentContainer, ProseContainer, ChapterHeader }`
    - _Requirements: 2.16_
    - _Properties: F.4_

  - [ ] 3.11 Testes unitários das primitivas
    - `src/components/primitives/Prose.test.tsx`: renderiza dentro de pais `flex` e `grid` com mocks de `getBoundingClientRect`, asserir `width > min-content`
    - `src/components/primitives/Card.test.tsx`: renderiza dentro de `Stack direction="grid"` com N colunas, asserir `|width − (parent − (N-1)×gap) / N| ≤ 4px`
    - `src/components/primitives/Metric.test.tsx`: renderiza com `tone="urgency"`/`"growth"`/`"trust"` e variant `light`/`dark`/`teal`, asserir classes de role resolvidas corretamente
    - `src/components/primitives/Stack.test.tsx`: `direction='grid'` com `cols={{ base:1, md:3 }}`, asserir classes `grid-cols-1 md:grid-cols-3 gap-{gap}`; regra invariante `cols.base ≤ 1`
    - `src/components/primitives/ChapterHeader.test.tsx`: smoke + landmarks + ausência de hex literal (varredura no próprio arquivo de teste)
    - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.10, 2.11, 2.16_
    - _Properties: A, B, C_

  - [ ] 3.12 Checkpoint 1 — build + lint + tests passam
    - `npm run build`, `npm run lint`, `npm run test:run` todos verdes
    - Task 2 (preservation) continua passando (nenhuma seção foi tocada)
    - Task 1 (exploratório) **ainda falha** (nenhuma seção foi tocada)
    - _Requirements: 3.1..3.14 (regressão zero)_
    - _Properties: D, E_

- [ ] 4. Checkpoint 2 — Piloto: migrar CoverSection
  - Arquivo a modificar: `src/components/sections/CoverSection.tsx`
  - Mudanças estruturais:
    - Remover o `<motion.p className="text-xl md:text-2xl text-blue-100 ...">` do subtítulo; substituir por `<Prose measure="lead" tone="secondary">` consumindo o mesmo `textContent`
    - Substituir o bloco `bg-white/10 backdrop-blur-md rounded-[2.5rem] ...` (badges/metrics) por `<Card tone="glass" variant="dark">` contendo dois `<Metric>`
    - Remover `bg-gradient-to-br from-[#1B3A6B] via-[#102642] to-[#2D9B8A]` em favor de classe utilitária `.bg-cover-gradient` declarada em `@layer components` consumindo role tokens
    - Remover `bg-[#2D9B8A] hover:bg-[#35b19e]` do CTA "Agendar Reunião" e trocar por `btn btn-secondary` (já existe em `@layer components`)
    - Preservar integralmente: textContent do título + subtítulo, sequência de animações `framer-motion` (`initial`/`animate`/`transition`), rótulos de botões, comportamento `min-h-screen flex items-center justify-center`
  - Atualizar `src/components/sections/Section.tsx` para prover `<VariantContext.Provider value={{ variant, contract: variantContract[variant] }}>` ao redor do `children`, de modo que primitivas internas possam consumir `useVariant()`
  - `style={{ display: ..., width: ... }}` em CoverSection: ZERO
  - `text-[#…]` / `bg-[#…]` em CoverSection: ZERO (toda cor de marca consumida via classe `.bg-cover-gradient`, `btn-primary`/`btn-secondary`, ou `role-*`)
  - _Bug_Condition: C1 no subtítulo do herói (caso canônico da bugfix.md 1.1), C3 em eventuais pares de cor_
  - _Expected_Behavior: subtítulo renderiza `wordsPerLine ≥ 5` em viewport ≥ 768px; contraste WCAG AA em todos os pares_
  - _Preservation: textContent + animações + rótulos de CTA idênticos_
  - _Requirements: 2.1, 2.2, 2.9, 2.10, 2.11, 2.13, 2.15, 3.3, 3.13, 3.14_
  - _Properties: A, C, D, E, F.2, F.3_

  - [ ] 4.1 Rodar Task 1 (exploratório) escopado a CoverSection — asserção C1.a agora deve **passar**; demais (C1.b, C1.c, C2.a, C2.b, C3.a exceto pares de CoverSection) continuam falhando (é o esperado)
  - [ ] 4.2 Rodar Task 2 (preservation) completa — todos os PBTs continuam verdes
  - [ ] 4.3 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes

- [ ] 5. Checkpoint 3 — Compartilhado: migrar SectionRenderer para ChapterHeader
  - Arquivo a modificar: `src/components/sections/SectionRenderer.tsx`
  - Mudanças estruturais:
    - Substituir o bloco `<div className="mb-12 w-full max-w-4xl">` com os três parágrafos "Capítulo N de 6"/título/subtítulo (hoje com condicionais de variante embutidos e hex literais) por `<ChapterHeader index={...} total={6} variant={activePage.variant} title={activePage.title} subtitle={activePage.subtitle} />`
    - Remover todos os hex literais `#2D9B8A`, `#F5A623`, `#1B3A6B` inline deste arquivo
    - Preservar slugs de página/seção, roteamento hash, ordem das seções
  - _Bug_Condition: C1 no subtítulo de capítulo (bugfix.md 1.4), C3 em cores inline_
  - _Expected_Behavior: subtítulo de capítulo comporta-se igual aos subtítulos internos (Requirement 2.4); zero hex literais_
  - _Preservation: mesmas rotas, mesma ordem, mesmos textos (Property D)_
  - _Requirements: 2.4, 2.13, 2.15, 3.1, 3.2, 3.3_
  - _Properties: A, C, D, F.3_

  - [ ] 5.1 Rodar Task 1 — asserção C1.b (ChapterHeader) agora **passa** para as 6 páginas
  - [ ] 5.2 Rodar Task 2 — PBTs de landmarks/hierarquia de headings continuam verdes (ChapterHeader preserva `h1` + landmark `article`)
  - [ ] 5.3 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes

- [ ] 6. Checkpoint 4 — NarrativeSection refactor
  - Arquivo a modificar: `src/components/sections/NarrativeSection.tsx`
  - Mudanças estruturais:
    - Deletar o objeto `toneStyles` local (substituído pelo `variantContract`)
    - Substituir o bloco de `metrics` por `<Stack direction="grid" cols={{ base:1, sm:2, lg:3 }} gap="md">` de `<Metric>`
    - Substituir o bloco de `cards` por `<Stack direction="grid" cols={{ base:1, lg:2 }} gap="md">` de `<Card>` contendo `<Prose>` no body
    - Remover `wrapperBg` com hex literais; usar utilitária de gradiente por variante (`.bg-variant-dark-gradient`, `.bg-variant-teal-gradient`) declarada em `@layer components` consumindo role tokens
    - Preservar copy, ordem dos cards/metrics, animações `framer-motion`
  - _Bug_Condition: C1 no `lead`, C2 nos cards, C3 em pares da variante teal_
  - _Expected_Behavior: Properties A/B/C passam em todos os pontos onde `NarrativeSection` é instanciada_
  - _Preservation: mesmos textos, mesma ordem, mesmas props de render_
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.7, 2.11, 2.15, 3.3_
  - _Properties: A, B, C, D, F.3_

  - [ ] 6.1 Rodar Task 1 — asserções C1.c + C2.a agora **passam**; asserção C3.a escopada a pares da NarrativeSection teal agora **passa**
  - [ ] 6.2 Rodar Task 2 — PBTs de preservation continuam verdes
  - [ ] 6.3 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes

- [ ] 7. Checkpoint 5 — ExecutiveSummarySection reescrito + DELETE `ExecutiveSummary.css` (MESMO COMMIT)
  - **CRÍTICO**: este checkpoint é atômico — a reescrita do `.tsx` e a remoção do `.css` legado **DEVEM** ir no mesmo commit/PR para manter o repo verde
  - Arquivos a modificar/deletar:
    - Reescrever `src/components/sections/ExecutiveSummarySection.tsx` (completo)
    - **DELETAR** `src/components/sections/ExecutiveSummary.css` (bugfix.md 2.12)
  - Mudanças estruturais no `.tsx`:
    - Remover `import './ExecutiveSummary.css'`
    - Remover TODOS os `style={{ display: ... }}` e `style={{ width: ..., display: ... }}` (hoje no hero, em `.exec-financials`, na célula "Garantias", nos `icon-box`)
    - Remover os `style={{ backgroundColor: item.bgColor, color: item.color }}` dos `icon-box` — substituir por `<IconBox tone={item.tone} />` (nova primitiva ou composição de `<Card tone="surface">` + `<Icon>`) consumindo role tokens via prop `tone`
    - Hero: `<Section variant="dark">` → `<ContentContainer>` → `<Stack gap="xl">` → `<Badge variant="outline-light">Visão de Futuro</Badge>` + `<h1>` + `<Prose measure="lead" tone="secondary">` + `<Card tone="glass" variant="dark">` com `<Stack direction="grid" cols={{ base:1, md:3 }} gap="lg">` de três `<Metric>`
    - Highlights grid: `<Stack direction="grid" cols={{ base:1, md:2, lg:4 }}>` de quatro `<Card>`, cada um com `<IconBox tone={item.tone} />` + `<Prose>`
    - "Logic section": `<Card tone="surface" variant="light">` contendo `<Stack direction="grid" cols={{ base:1, lg:2 }} gap="2xl">`
    - Preservar integralmente copy, ordem dos blocos, contagens de cards/métricas, animações
  - Após a reescrita:
    - `ExecutiveSummarySection.tsx` tem ZERO `style={{ display | width }}` (cobre Property F.2 pela primeira vez em escopo real)
    - `src/components/sections/ExecutiveSummary.css` não existe mais no filesystem (cobre Property F.1 por remoção)
    - Nenhum hex de marca literal neste arquivo (cobre Property F.3 escopado)
  - _Bug_Condition: C2 no grid financeiro (bugfix.md 1.7), C3 em pares lavanda/azul (bugfix.md Example C3), C4 em `.css` e `style={{ }}`_
  - _Expected_Behavior: Properties B, C, F.1, F.2 passam no arquivo reescrito_
  - _Preservation: textContent dos três blocos (hero, highlights, logic) + três métricas financeiras + 4 highlights + logic 2x N preservados; animações framer-motion preservadas_
  - _Requirements: 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12, 2.13, 2.15, 3.3_
  - _Properties: B, C, D, F.1, F.2, F.3_

  - [ ] 7.1 Rodar Task 1 — asserção C2.b (grid financeiro) + asserções C3.a escopadas a ExecutiveSummary agora **passam**
  - [ ] 7.2 Rodar Task 2 — PBTs de textContent, landmarks e hierarquia para as seções da página `visao-geral` continuam verdes
  - [ ] 7.3 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes
  - [ ] 7.4 Grep estático escopado: `grep -r "ExecutiveSummary.css" src/` deve retornar ZERO resultados

- [ ] 8. Checkpoint 6 — Sections batch 1 (variante `light` — produto)
  - Migrar 5 seções da página `produto` para primitivas + tokens. Dentro deste batch, 8.1..8.5 são paralelizáveis (arquivos independentes)
  - Regra aplicada a cada arquivo: remover `import './*.css'` legado (se houver); remover `style={{ display | width | backgroundColor: '<hex>' | color: '<hex>' }}`; substituir `text-[#...]`/`bg-[#...]` por classes de role; envolver em `<Section variant="light">` + `<ContentContainer>`; trocar `<p>` livres por `<Prose>`, cards por `<Card>`, grids por `<Stack direction="grid">`, métricas por `<Metric>`
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.13, 2.14, 2.15, 2.16, 3.3_
  - _Properties: A, B, C, D, F.2, F.3, F.4_

  - [ ] 8.1 * Migrar `src/components/sections/ProductOverviewSection.tsx`
  - [ ] 8.2 * Migrar `src/components/sections/TechnicalThesisSection.tsx`
  - [ ] 8.3 * Migrar `src/components/sections/GradualProtocolsSection.tsx` (preservar `ProtocolSelector` props)
  - [ ] 8.4 * Migrar `src/components/sections/OERAFounderSection.tsx`
  - [ ] 8.5 * Migrar `src/components/sections/ProductModulesSection.tsx` (preservar `ModuleCards` props)
  - [ ] 8.6 Rodar Task 1 + Task 2 — ambas devem refletir progresso (Task 1 mais perto de passar; Task 2 continua verde)
  - [ ] 8.7 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes

- [ ] 9. Checkpoint 7 — Sections batch 2 (variante `teal` — mercado)
  - Migrar 2 seções da página `mercado`. 9.1..9.2 paralelizáveis
  - Especial atenção ao **par teal/âmbar** (`text-[#F5A623]` sobre `#2D9B8A`) — deve ser consumido via `variantContract.teal.text.accent` que é verificado por teste de contraste em `variantContract.test.ts` (Task 3.7)
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.11, 2.13, 2.15, 2.16, 3.3_
  - _Properties: A, B, C, D, F.2, F.3_

  - [ ] 9.1 * Migrar `src/components/sections/MarketUrgencySection.tsx` (preservar `CountdownTimer` props)
  - [ ] 9.2 * Migrar `src/components/sections/MarketRevenueSection.tsx`
  - [ ] 9.3 Rodar Task 1 + Task 2 e `npm run build`/`lint`/`test:run` — todos verdes

- [ ] 10. Checkpoint 8 — Sections batch 3 (variante `dark` — investimento)
  - Migrar 5 seções da página `investimento`. 10.1..10.5 paralelizáveis
  - Cuidado particular com `ROISimulator` e `SofthouseCalculator`: são **componentes interativos** — só o **wrapper de seção** é alterado; os componentes em si permanecem inalterados (Property D / Requirements 3.4, 3.5, 3.6, 3.7)
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.11, 2.13, 2.15, 2.16, 3.3, 3.4, 3.5, 3.6_
  - _Properties: A, B, C, D, F.2, F.3_

  - [ ] 10.1 * Migrar `src/components/sections/ProjectionsSection.tsx` (preservar `ROISimulator` props)
  - [ ] 10.2 * Migrar `src/components/sections/ProposalTranchesSection.tsx` (preservar `TrancheTimeline` props)
  - [ ] 10.3 * Migrar `src/components/sections/PaymentProofSection.tsx` (preservar `ComparisonTable` e `SofthouseCalculator` props)
  - [ ] 10.4 * Migrar `src/components/sections/ExpectedReturnSection.tsx` (preservar `ROISimulator` props)
  - [ ] 10.5 * Migrar `src/components/sections/PreScaleReturnSection.tsx` (preservar `SofthouseCalculator` props)
  - [ ] 10.6 Rodar Task 1 + Task 2 — os 5 PBTs existentes dos componentes interativos devem continuar verdes (Requirement 3.7)
  - [ ] 10.7 `npm run build`, `npm run lint`, `npm run test:run` — todos verdes

- [ ] 11. Checkpoint 9 — Sections batch 4 (variante `light` — execução)
  - Migrar 6 seções da página `execucao`. 11.1..11.6 paralelizáveis
  - Atenção a `ObjectionsSection` (preservar `ObjectionAccordion`) e `DecisionFrameworkSection` (matriz 2×2 — usar `<Stack direction="grid" cols={{ base:1, md:2 }}>`)
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.13, 2.15, 2.16, 3.3, 3.6_
  - _Properties: A, B, C, D, F.2, F.3_

  - [ ] 11.1 * Migrar `src/components/sections/WhyGradualSection.tsx`
  - [ ] 11.2 * Migrar `src/components/sections/TeamSection.tsx`
  - [ ] 11.3 * Migrar `src/components/sections/GovernanceSection.tsx`
  - [ ] 11.4 * Migrar `src/components/sections/ExecutionPlanSection.tsx`
  - [ ] 11.5 * Migrar `src/components/sections/ObjectionsSection.tsx` (preservar `ObjectionAccordion` props)
  - [ ] 11.6 * Migrar `src/components/sections/DecisionFrameworkSection.tsx`
  - [ ] 11.7 Rodar Task 1 + Task 2 e `npm run build`/`lint`/`test:run` — todos verdes

- [ ] 12. Checkpoint 10 — Sections batch 5 (variante `dark` — fecho)
  - Migrar 2 seções da página `termos`. 12.1..12.2 paralelizáveis
  - `NextStepsSection` preserva `IntentForm` props (Requirement 3.6)
  - _Requirements: 2.1, 2.2, 2.5, 2.6, 2.11, 2.13, 2.15, 2.16, 3.3, 3.6_
  - _Properties: A, B, C, D, F.2, F.3_

  - [ ] 12.1 * Migrar `src/components/sections/SummaryTermsSection.tsx`
  - [ ] 12.2 * Migrar `src/components/sections/NextStepsSection.tsx` (preservar `IntentForm` props)
  - [ ] 12.3 Rodar Task 1 + Task 2 e `npm run build`/`lint`/`test:run` — todos verdes

- [ ] 13. Checkpoint 11 — Verificação estática final (regex inventory — Property F)
  - Executar cada regex do `design.md` seção 7 _Inline Style Patterns to Remove_ em `src/components/sections/**` e **asserir ZERO matches** para todos eles
  - Criar `src/__static__/antiPatterns.static.test.ts` que usa `glob` + `fs.readFileSync` + regex para validar Property F em CI
  - **Regex a aplicar (zero matches):**
    - `style=\{\{\s*display\s*:` (F.2 — `display` inline)
    - `style=\{\{[^}]*width\s*:` (F.2 — `width` inline em layout)
    - `text-\[#[0-9A-Fa-f]{6}\]` (F.3 — Tailwind arbitrary color com hex)
    - `bg-\[#[0-9A-Fa-f]{6}\]` (F.3 — idem para background)
    - `(#1B3A6B|#2D9B8A|#F5A623|#8B7EC8|#102642|#F8F9FA)` case-insensitive em `.tsx` ou `.css` local de `sections/**` (F.3)
    - `!important` em qualquer `.css` sob `sections/**` (F.1)
  - **Inspeção adicional (F.4):**
    - `fs.existsSync('src/components/primitives/Prose.tsx')` etc. para as 4 primitivas canônicas + 3 containers + `ChapterHeader`
    - `src/components/primitives/index.ts` exporta todos os símbolos esperados (import dinâmico + `Object.keys`)
  - Remover qualquer `import './*.css'` de seção remanescente que não tenha sido purgado nos checkpoints anteriores
  - _Bug_Condition: C4 — anti-padrões estruturais por inspeção estática_
  - _Expected_Behavior: ZERO matches para todos os regex listados_
  - _Preservation: paleta institucional continua presente em `src/index.css` `@theme` (não é ignorada pelo regex porque o escopo é `src/components/sections/**`, não global)_
  - _Requirements: 2.12, 2.13, 2.14, 2.15, 2.16_
  - _Properties: F.1, F.2, F.3, F.4_

  - [ ] 13.1 `npm run test:run -- src/__static__/antiPatterns.static.test.ts` passa com zero matches
  - [ ] 13.2 Grep manual de sanidade: `grep -rnE "style=\{\{[^}]*(display|width)" src/components/sections/` → zero resultados
  - [ ] 13.3 Grep manual de sanidade: `grep -rniE "#(1B3A6B|2D9B8A|F5A623|8B7EC8|102642|F8F9FA)" src/components/sections/` → zero resultados

- [ ] 14. Fix checking — re-executar Task 1 (deve PASSAR agora)
  - **Property 1: Expected Behavior** - C1, C2, C3 corrigidos em todas as seções
  - **IMPORTANTE**: re-executar o MESMO teste da Task 1 — NÃO escrever novo teste. O teste da Task 1 codifica a Expected Behavior; sua passagem confirma que o bug foi corrigido
  - Rodar: `npm run test:run -- src/components/__exploratory__/BugCondition.exploratory.test.tsx`
  - **EXPECTED OUTCOME**: TODAS as asserções C1.a, C1.b, C1.c, C2.a, C2.b, C3.a **PASSAM**
  - Se alguma asserção ainda falhar, há seção não-migrada ou hex literal remanescente: voltar ao checkpoint correspondente antes de prosseguir
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11_
  - _Properties: A, B, C_

- [ ] 15. Preservation checking — re-executar Task 2 + 7 PBTs existentes (devem CONTINUAR passando)
  - **Property 2: Preservation** - conteúdo, landmarks, hierarquia, componentes interativos, modos, motion inalterados
  - **IMPORTANTE**: re-executar os MESMOS testes da Task 2 e os 7 PBTs existentes sem qualquer modificação no código dos testes (Requirement 3.7)
  - **EXPECTED OUTCOME**: TODOS os PBTs de preservation + os 7 PBTs existentes PASSAM
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 3.13, 3.14_
  - _Properties: D, E_

  - [ ] 15.1 Re-executar `src/components/__preservation__/Layout.preservation.test.tsx` (Task 2) — todos os PBTs verdes
  - [ ] 15.2 Re-executar os 7 PBTs existentes SEM modificação no código dos testes: `ROISimulator.property.test.ts`, `SofthouseCalculator.property.test.ts`, `TrancheTimeline.property.test.ts`, `CountdownTimer.property.test.ts`, `ModuleCards.property.test.ts`, `formatting.property.test.ts`, `NavigationProvider.property.test.tsx` — 100% verde
  - [ ] 15.3 Re-executar `Section.animation.test.tsx` + `useReducedMotion.test.ts` — animações `framer-motion` preservadas (Requirement 3.14); `prefers-reduced-motion` continua desativando animações decorativas (Requirement 3.10)
  - [ ] 15.4 Re-executar `src/App.accessibility.test.tsx` (axe) — ZERO violações de contraste (valida Property C runtime end-to-end, em complemento ao `variantContract.test.ts` da Task 3.7); landmarks `header`/`main`/`nav`/`footer`/`article` e hierarquia de headings preservados (Property D / Requirement 3.11)
  - [ ] 15.5 * Snapshot textual opcional: para cada uma das 22 seções × 3 viewports, versionar um snapshot de `textContent` concatenado para auditoria de futuras regressões
  - [ ] 15.6 * Teste de regressão visual opcional via Playwright em breakpoints 375/768/1440 para as 22 seções

- [ ] 16. Checkpoint final — build + lint + test:run verdes; paleta preservada
  - `npm run build` → build de produção bem-sucedido (sem avisos de CSS não encontrado pelo `ExecutiveSummary.css` deletado)
  - `npm run lint` → zero erros
  - `npm run test:run` → zero falhas (inclui os testes novos das Tasks 1, 2, 3.7, 3.8, 3.11, 13 e todos os pré-existentes)
  - Verificação manual em viewports 375, 768 e 1440:
    - Subtítulo da capa renderiza horizontal (sem "palavras em pé")
    - Cards de `NarrativeSection` e `ExecutiveSummary` ocupam largura proporcional ao grid
    - Pares de texto/fundo em todas as 22 seções passam no leitor de contraste do navegador
  - Verificação de que a paleta institucional continua presente em `src/index.css` `@theme` (Requirement 3.12) e que os hex foram apenas **consolidados** em tokens, nunca substituídos
  - Verificação de que `StickyCTA` e os CTAs principais ("Explorar Proposta", "Baixar PDF", "Agendar Reunião") mantêm rótulos e ações (Requirement 3.13)
  - Se surgirem dúvidas sobre comportamento de alguma seção migrada (ex.: qual `measure` usar em um `Prose` específico, qual `cols` em um `Stack`), consultar o usuário antes de decidir
  - _Requirements: 2.12, 2.13, 2.14, 2.15, 2.16, 3.1..3.14_
  - _Properties: A, B, C, D, E, F_
