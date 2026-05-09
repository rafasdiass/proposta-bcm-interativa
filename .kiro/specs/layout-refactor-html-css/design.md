# layout-refactor-html-css Bugfix Design

## Overview

Este bugfix executa um **refactor estrutural de HTML e CSS/SCSS** da Proposta BCM
Interativa para eliminar uma classe recorrente de defeitos de layout — parágrafos
renderizando "em pé" (C1), cards "achatados" (C2), contraste insuficiente (C3) —
cuja causa raiz são os anti-padrões estruturais (C4) que reintroduzem C1–C3 a
cada nova seção. Em vez de corrigir ponto a ponto (como nas rodadas anteriores
de patches), a estratégia é estabelecer **uma única fonte de verdade de layout
e cor** e substituir as três estratégias concorrentes de hoje (utilitários
Tailwind + CSS legado com `!important` + estilos inline) por um conjunto pequeno
de primitivas compartilhadas.

O refactor gira em torno de duas decisões de arquitetura:

1. **Primitivas de layout** em `src/components/primitives/` — `Prose`, `Card`,
   `Metric`, `Stack` e os `Container`s (`Page`, `Content`, `Prose`) — cada uma
   com um **contrato de largura travado** (`width: 100%`, `min-width: 0`,
   `max-width` apropriado) que impede, por construção, o colapso para
   `min-content` dentro de pais `flex`/`grid` e remove a necessidade de hacks
   inline.
2. **Consolidação de tokens** em `src/styles/theme.ts` e nas variáveis `@theme`
   de `src/index.css` — tokens semânticos (`trust`, `growth`, `urgency`,
   `support`, `surface-light`, `surface-dark`, `text-primary`,
   `text-secondary`) com um **contrato de variante** (`light | dark | teal`)
   que declara explicitamente os pares `(text, bg)` permitidos, todos com
   contraste WCAG AA garantido por construção.

A escopo do refactor é exclusivamente estrutural: o conteúdo das 22 seções, a
lógica dos 8 componentes interativos, as 7 PBTs existentes, os modos
`landing`/`presentation`, as rotas, os landmarks semânticos e a paleta
institucional **permanecem inalterados**. O objetivo é que o repositório fique
"verde" seção a seção durante a migração, e que, ao final, o caminho mais
curto para adicionar uma nova seção seja usar as primitivas — divergir delas
passa a ser a exceção explícita.

## Glossary

- **Bug_Condition (C)**: União `C = C1 ∨ C2 ∨ C3 ∨ C4` — o sistema apresenta o
  bug quando pelo menos um dos quatro sintomas estruturais ocorre no render ou
  na inspeção estática da base de código.
- **C1 — Texto em coluna**: sub-condição em que um parágrafo/`lead` renderiza
  com largura efetiva inferior à medida natural de leitura, tipicamente por
  falta de `width: 100%` ou `min-width: 0` em contexto flex/grid.
- **C2 — Card achatado**: sub-condição em que um card dentro de um grid
  multi-coluna ou de um `flex-col sm:flex-row` colapsa para `min-content`,
  forçando texto a quebrar a cada poucas palavras.
- **C3 — Contraste insuficiente**: sub-condição em que um par `(text, bg)`
  aplicado pelo sistema cai abaixo de WCAG AA (4.5:1 para texto normal, 3:1
  para texto grande) para tipografia corrida, tipicamente cinza-sobre-cinza ou
  componentes "light-only" embutidos em variantes `dark`/`teal`.
- **C4 — Anti-padrões estruturais**: sub-condição detectada estaticamente —
  existência de CSS legado com `!important`, estilos inline de `display`/`width`
  em seções, hex literais da marca duplicados em `.tsx` ou CSS local, ausência
  de primitivas compartilhadas.
- **Property (P)**: comportamento correto esperado após o refactor — texto
  ocupa a largura disponível até a medida (C1 ok), cards ocupam
  `(parent / N) − gap` com fluxo horizontal (C2 ok), pares de cor respeitam
  WCAG AA (C3 ok), codebase não contém os anti-padrões (C4 ok).
- **Preservation**: conjunto de comportamentos que **não mudam** — conteúdo
  das 22 seções, 8 componentes interativos, 7 PBTs existentes, alternância
  Landing/Presentation, `prefers-reduced-motion`, colapso para coluna única em
  viewport ≤ 640px, landmarks, hierarquia de cabeçalhos, paleta institucional.
- **Prose**: primitiva de texto corrido com contrato de largura travado
  (`width: 100%`, `min-width: 0`, `max-width ≈ 70ch`) que garante medida de
  leitura em qualquer pai flex/grid.
- **Card**: primitiva de superfície com contrato de largura travado (`width:
  100%`, `min-width: 0`) e slots internos de `header`/`body`/`footer`; por
  construção, não colapsa dentro de grids multi-coluna.
- **Metric**: primitiva de valor + rótulo (usada hoje informalmente em
  `.exec-financials`, `exec-card` e no grid de métricas de `NarrativeSection`),
  com contrato de largura travado e tipografia fixa do design system.
- **Stack**: primitiva de ritmo vertical — container que aplica `gap` uniforme
  entre filhos diretos, substituindo combinações ad hoc de `space-y-*` com
  margens heterogêneas.
- **Container**: conjunto finito `{ Page, Content, Prose }` com `max-width`
  canônicos (`1400px`, `1200px`, `70ch`). Nenhuma seção declara `max-w-*`
  próprio fora desse conjunto.
- **Variant Contract**: regra explícita que liga uma variante de seção
  (`light | dark | teal`) a um conjunto de pares `(text-role, bg)` válidos. As
  primitivas consomem o contrato via `useVariant()` ou prop `tone`, garantindo
  contraste por construção.
- **Role Token**: token semântico de cor (ex.: `--color-trust`,
  `--color-growth`, `--color-urgency`, `--color-text-primary`,
  `--color-text-secondary`, `--color-surface-light`, `--color-surface-dark`).
  Cada papel tem **um e apenas um** token, e cada token tem **um papel claro**.
- **isBugCondition(input)**: função formal (definida abaixo) que devolve `true`
  quando qualquer das quatro sub-condições ocorre no render (runtime) ou na
  inspeção estática (build-time) da base de código.
- **F / F'**: `F` é o componente/estilo antes do refactor; `F'` é o
  componente/estilo depois do refactor, usando primitivas e tokens.

## Bug Details

### Bug Condition

O bug manifesta-se como um comportamento emergente da **coexistência de três
estratégias concorrentes de layout** sobre as mesmas regiões do DOM: utilitários
Tailwind (`w-full`, `max-w-*`, `flex`, `grid`, `min-w-0`), CSS legado com
`!important` (`ExecutiveSummary.css`) e estilos inline de `display`/`width` no
JSX. A condição é composta e sobreposta — um render pode exibir C1 e C2
simultaneamente; uma inspeção estática pode flagrar C4 sem observar C1/C2/C3
no runtime naquele momento. A formalização trata isso como união lógica.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input — either (a) a rendered node in a given viewport, or
                         (b) a static view of the source tree.
  OUTPUT: boolean

  // ---------- C1: Texto em coluna ----------
  LET C1 = FALSE
  IF input is a rendered node THEN
    FOR EACH paragraph p IN input.textParagraphs DO
      LET wordCount    = countWords(p.textContent)
      LET lineCount    = countRenderedLines(p)
      LET parent       = closestFlexOrGridAncestor(p)
      LET measuredW    = boundingClientRect(p).width
      LET naturalW     = measureSingleLineWidth(p.textContent, p.computedFont)
      LET availableW   = parent != NULL ? parent.contentWidth : viewport.width

      LET shrunkBelowAvailable =
            parent != NULL
            AND measuredW < min(availableW, naturalW) - 8px
      LET wordsPerLineTooLow =
            wordCount >= 5
            AND (wordCount / lineCount) < 2
            AND viewport.width >= 320

      IF shrunkBelowAvailable OR wordsPerLineTooLow THEN
        C1 := TRUE
      END IF
    END FOR
  END IF

  // ---------- C2: Card achatado ----------
  LET C2 = FALSE
  IF input is a rendered node THEN
    FOR EACH card c IN input.cards DO
      LET gridParent = closestGridAncestor(c)
      IF gridParent != NULL THEN
        LET N        = gridParent.columnCount
        LET gap      = gridParent.computedGap
        LET expected = (gridParent.contentWidth - (N - 1) * gap) / N
        LET actual   = boundingClientRect(c).width
        IF abs(actual - expected) > 4px THEN
          C2 := TRUE
        END IF
      END IF
      FOR EACH textBlock tb IN c.descendantTextBlocks DO
        IF wordsPerLine(tb) < 3 AND wordCount(tb) >= 6 THEN
          C2 := TRUE
        END IF
      END FOR
    END FOR
  END IF

  // ---------- C3: Contraste insuficiente ----------
  LET C3 = FALSE
  IF input is a rendered node THEN
    FOR EACH textNode t IN input.visibleText DO
      LET fg    = computedColor(t)
      LET bg    = effectiveBackground(t)
      LET large = isLargeText(t) // >= 18pt or >= 14pt bold
      LET ratio = contrastRatio(fg, bg)
      LET min   = large ? 3.0 : 4.5
      IF ratio < min THEN
        C3 := TRUE
      END IF
    END FOR
  END IF

  // ---------- C4: Anti-padrões estruturais ----------
  LET C4 = FALSE
  IF input is a static view of the source tree THEN
    LET sectionsDir = "src/components/sections/**"
    LET brandHex    = { "#1B3A6B", "#2D9B8A", "#F5A623",
                        "#8B7EC8", "#102642", "#F8F9FA" }

    IF exists file in sectionsDir matching "*.css" with "!important"
       on width|display|typography rules
    THEN C4 := TRUE

    IF exists JSX attribute in sectionsDir of shape
         style={{ display: ..., ... }} OR style={{ width: ..., ... }}
       on layout elements
    THEN C4 := TRUE

    IF exists .tsx or component-local .css in sectionsDir
       containing a literal from brandHex
    THEN C4 := TRUE

    IF NOT exists src/components/primitives/{Prose,Card,Metric,Stack}.tsx
    THEN C4 := TRUE
  END IF

  RETURN C1 OR C2 OR C3 OR C4
END FUNCTION
```

### Examples

Exemplos concretos de manifestação, agrupados por sub-condição. Cada exemplo
indica o comportamento atual (**F**) e o comportamento esperado após o refactor
(**F'**).

- **C1 — Subtítulo do herói da capa** (`CoverSection.tsx`, linha do
  `<motion.p>` "Transforme o futuro da terapia ABA digital com o Grupo
  Gradual"). Hoje, em viewports ≥ 768px dentro do container centralizado com
  `max-w-3xl mx-auto`, o parágrafo combina `font-light` com um ancestral flex
  sem `min-width: 0`, e em certos breakpoints quebra linha a cada 1–2 palavras.
  **F':** renderizado via `<Prose measure="lead">`, com `width: 100%`,
  `min-width: 0` e `max-width: 70ch`, mantendo ≥ 5 palavras/linha em
  desktop e nunca descendo abaixo de 3 palavras/linha em mobile.

- **C2 — Linha de cards da `NarrativeSection`** (grid `grid-cols-1
  lg:grid-cols-2`). Hoje, o `article` interno usa `flex items-start gap-4` com
  o ícone ocupando `w-12` fixo e o bloco textual em `flex-1 min-w-0` — mas o
  card externo não tem contrato de largura, então em contextos `tone="dark"`
  com `rounded-3xl p-8 md:p-12 lg:p-16` o texto do card renderiza com largura
  interna insuficiente e "quebra achatado". **F':** `<Card>` com `width:
  100%`, `min-width: 0` e grid pai `Stack direction="grid" cols={{ base:1,
  lg:2 }} gap="lg"`; o slot textual é sempre `<Prose>`, com a medida travada.

- **C3 — Célula do grid financeiro do Resumo Executivo**
  (`ExecutiveSummarySection.tsx`, dentro de `.exec-financials`). Hoje,
  `.fin-label` usa `color: #a5b4fc` (lavanda clara) sobre gradiente
  `#1b3a6b → #102642`, produzindo um par com contraste ≈ 4.1:1 — abaixo do
  WCAG AA para texto normal. **F':** `<Metric label={…} value={…} />` dentro
  de `variant="dark"`, que consome `--color-text-secondary-on-dark` garantido
  ≥ 4.5:1 pelo contrato de variante.

- **C3 — Par `teal` / accent dourado no
  `NarrativeSection`**. Hoje, `tone="teal"` usa `text-teal-50` sobre
  `from-[#2D9B8A] to-[#1a7a6b]` e, simultaneamente, `text-[#F5A623]` para
  `eyebrow` sobre o mesmo fundo. O par teal/âmbar precisa ser verificado
  formalmente. **F':** par declarado em `variantContract.teal = { textPrimary:
  'white', textSecondary: 'teal-50', accent: 'urgency-on-teal' }` com todos
  os pares pré-verificados via teste de contraste.

- **C4 — Hacks inline em `ExecutiveSummarySection.tsx`**: `style={{ display:
  'block' }}` no hero, `style={{ width: '100%', display: 'block' }}` em
  `.exec-financials`, `style={{ display: 'flex', alignItems: 'center', gap:
  '8px', color: '#fbbf24', fontWeight: 'bold', fontSize: '1.25rem' }}` na
  célula "Garantias", `style={{ backgroundColor: item.bgColor, color:
  item.color }}` nos `icon-box`. **F':** nenhum `style={{ display | width }}`
  em `src/components/sections/**`; cores de ícones via prop `tone` e tokens.

- **C4 — `ExecutiveSummary.css` com `!important`**: `.exec-summary-container
  { width: 100% !important; display: block !important; }` na raiz do arquivo.
  **F':** `ExecutiveSummary.css` **deletado**; seção reescrita 100% com
  primitivas e utilitárias Tailwind.

- **Exemplo de cabeçalho de capítulo** (`SectionRenderer.tsx`, wrapper
  `mb-12 w-full max-w-4xl`). Hoje declara três classes cromáticas inline com
  hex `#2D9B8A`, `#F5A623`, `#1B3A6B`. **F':** `<ChapterHeader variant={...}
  eyebrow={...} title={...} subtitle={...} />`, composto de primitivas, sem
  hex literal.

## Expected Behavior

### Preservation Requirements

O refactor é estrutural (HTML + CSS + tokens). Os comportamentos listados
abaixo **não devem mudar**. Esta seção é a âncora da Property D/E/F.

**Comportamentos preservados (conteúdo, navegação e componentes):**

- Os seis capítulos (`visao-geral`, `mercado`, `produto`, `investimento`,
  `execucao`, `termos`) continuam com títulos, subtítulos, slugs e ordem
  atuais.
- As 22 seções já implementadas continuam exibindo o mesmo conteúdo textual,
  na mesma ordem, com a mesma hierarquia de cabeçalhos.
- Os 8 componentes interativos (`ROISimulator`, `SofthouseCalculator`,
  `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`,
  `ObjectionAccordion`, `IntentForm`) continuam com a mesma lógica de estado
  e as mesmas propriedades.
- As 7 PBTs existentes continuam passando **sem modificação** no código dos
  testes.

**Comportamentos preservados (modos, responsividade, acessibilidade):**

- Alternância `landing` ↔ `presentation` preserva estado e seção ativa.
- `prefers-reduced-motion` continua desativando animações decorativas.
- Viewports ≤ 640px continuam colapsando grids multi-coluna em coluna única,
  preservando ordem semântica.
- Landmarks (`header`, `main`, `nav`, `footer`, `article`), hierarquia de
  cabeçalhos e `aria-label`/`aria-labelledby` permanecem iguais.
- Animações `framer-motion` de entrada de seção (`initial`/`animate`/
  `transition`, duração, easing) permanecem iguais, exceto onde uma animação
  dependia diretamente de um hack de layout removido.

**Comportamentos preservados (identidade visual):**

- Os valores hex `#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA`,
  `#102642` continuam sendo a referência de marca. A consolidação em tokens
  **preserva** esses valores, não os substitui.
- `StickyCTA` e os CTAs principais ("Explorar Proposta", "Baixar PDF",
  "Agendar Reunião") mantêm rótulos, ícones e ações.

**Escopo de não-interferência:**

Qualquer input para o qual `isBugCondition(input)` retornava `false` **antes**
do refactor deve continuar produzindo render visualmente equivalente (texto
idêntico em posição equivalente, mesmas animações, mesmos landmarks) **depois**
do refactor. Em termos formais, `F(input) ≡ F'(input)` quando `¬C(input)` — é a
âncora da checagem de preservação.

## Hypothesized Root Cause

A razão pela qual o bug **reaparece a cada nova seção**, apesar de cada
correção ter funcionado localmente, não é um defeito pontual: é uma
característica emergente da arquitetura atual. Três hipóteses, em ordem de
probabilidade:

1. **Três estratégias de layout concorrentes sobre o mesmo DOM.** Utilitários
   Tailwind (que dependem de ordem e precedência natural), CSS legado com
   `!important` (que quebra essa ordem) e estilos inline (que têm maior
   especificidade que ambos) coexistem no mesmo subárvore de render. O autor
   que adiciona uma nova seção descobre empiricamente quais classes/estilos
   precisam ser combinados — e descobre errado metade das vezes, porque não
   existe contrato. Cada "correção" anterior adicionou mais estilos em vez de
   remover estratégias.

2. **Ausência de contrato de largura nas primitivas existentes.**
   `max-w-prose`, `max-w-7xl`, `max-w-3xl` são aplicados como "teto" sem
   "piso" — não existe `width: 100%` canônico acompanhando o `max-width`.
   Fora de flex/grid isso funciona; dentro (que é o caso de ~90% das regiões
   da proposta), o bloco encolhe até `min-content`. Cada autor redescobre isso
   e adiciona `w-full` manualmente — algumas vezes esquece, outras aplica em
   lugar errado.

3. **Tokens de cor subutilizados, com hex literais como atalho.** Os tokens em
   `theme.ts` e `@theme` existem, mas não são obrigatórios. `CoverSection`,
   `NarrativeSection`, `SectionRenderer`, `ExecutiveSummarySection` usam
   `text-[#1B3A6B]`, `bg-[#2D9B8A]`, etc. O autor que quer ajustar uma cor
   tem duas fontes de verdade (token + hex); um `grep` por token não acha o
   uso. Pares `(text, bg)` não são validados — nada impede aplicar
   `text-gray-400` sobre `bg-white` em um lugar e `text-teal-50` sobre
   `bg-gradient...` em outro sem medir contraste.

4. **Componentes de seção não compartilham primitivas.** `ExecutiveSummary`
   tem seu próprio CSS, `NarrativeSection` tem seu próprio `toneStyles`,
   `CoverSection` tem classes ad hoc, `SectionRenderer` embute o cabeçalho de
   capítulo. Cinco formas diferentes de declarar "um parágrafo de lead", cinco
   formas diferentes de declarar "um card". O defeito em uma forma não
   propaga consertos às outras — e vice-versa.

A consequência das quatro hipóteses é que **corrigir ponto a ponto é
O(seções × estratégias)**, enquanto remover a concorrência de estratégias e
introduzir primitivas é **O(primitivas)**. É por isso que o refactor é a
correção — patches adicionais sem refactor voltam a falhar.

## Correctness Properties

As propriedades abaixo são a **fonte única de verdade** dos contratos de
correção e preservação deste bugfix. Property A–C validam o fix (cobertura das
sub-condições C1–C3). Property D–E validam preservação. Property F valida a
ausência dos anti-padrões estruturais (C4) por inspeção estática.

Property A: Bug Condition — C1 Text Width

_For any_ `Prose` primitive rendered in any viewport ≥ 320px within any
`flex` or `grid` parent, the rendered bounding-box width SHALL be
`≥ min(available-parent-width, measured-content-single-line-width)` and SHALL
NOT shrink to `min-content`. Equivalently: for all rendered paragraphs reached
via `<Prose>`, `countWords(text) / countRenderedLines ≥ 2` when
`countWords ≥ 5` and `viewport.width ≥ 320`.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property B: Bug Condition — C2 Card Width

_For any_ `Card` primitive placed inside a grid with `N` columns and computed
`gap`, the rendered width SHALL equal
`(parent-content-width − (N − 1) × gap) / N` (within a 4px rendering
tolerance). For any text block inside a `Card`, when the block contains at
least 6 words, `wordsPerLine ≥ 3` given typical executive copy lengths.

**Validates: Requirements 2.5, 2.6, 2.7, 2.8**

Property C: Bug Condition — C3 Contrast Ratio

_For every_ pair `(variant ∈ {light, dark, teal}, role ∈ {primary, secondary,
muted, accent})` declared in the variant contract and consumed by any
primitive in the proposal, the computed contrast ratio between the resolved
foreground token and the resolved background token SHALL be `≥ 4.5:1` for
normal text and `≥ 3.0:1` for large text (≥ 18pt or ≥ 14pt bold), matching
WCAG 2.1 AA.

**Validates: Requirements 2.9, 2.10, 2.11**

Property D: Preservation — Content, Components, Semantics

_For any_ input for which the bug condition does NOT hold before the refactor,
the fixed code SHALL produce the same observable output, specifically:

- the 22 sections render the same `textContent` substrings as before, in the
  same order;
- the 8 interactive components mount with the same props and their existing
  7 PBTs pass unchanged;
- landmarks (`header`, `main`, `nav`, `footer`, `article`), heading hierarchy
  (h1 → h2 → h3), and `aria-label`/`aria-labelledby` attributes are unchanged.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.11**

Property E: Preservation — Modes, Responsiveness, Motion

_For any_ input for which the bug condition does NOT hold, the fixed code SHALL
preserve:

- the Landing ↔ Presentation toggle, including active page and scroll
  position semantics;
- suppression of decorative motion under `prefers-reduced-motion: reduce`;
- collapse of multi-column grids to single column at viewport ≤ 640px;
- existing `framer-motion` `initial`/`animate`/`transition` timings.

**Validates: Requirements 3.8, 3.9, 3.10, 3.14**

Property F: Structural — Anti-Pattern Absence

_For any_ static inspection of the source tree after the refactor, the
following SHALL hold:

- **F.1**: zero CSS files in `src/components/sections/**` contain `!important`
  declarations on layout/typography rules;
- **F.2**: zero JSX attributes in `src/components/sections/**` of the form
  `style={{ display: … }}`, `style={{ width: … }}` or
  `style={{ display: …, width: … }}` on layout elements;
- **F.3**: zero occurrences of the brand hex literals `#1B3A6B`, `#2D9B8A`,
  `#F5A623`, `#8B7EC8`, `#102642`, `#F8F9FA` (case-insensitive) in `.tsx` or
  component-local `.css` files under `src/components/sections/**`; all such
  colors are consumed via role tokens;
- **F.4**: the primitives `Prose`, `Card`, `Metric`, `Stack` and the
  `Container` set exist under `src/components/primitives/` and are exported
  from an `index.ts` barrel.

**Validates: Requirements 2.12, 2.13, 2.14, 2.15, 2.16, 3.12, 3.13**

## Fix Implementation

### Changes Required

Assuming the root cause analysis above is correct, the refactor replaces the
three concurrent layout strategies with a single one — primitives + tokens —
and migrates sections seção a seção to consume it. All changes are local to
`src/components/`, `src/styles/`, and `src/index.css`; `src/data/pages.ts` and
routing are untouched.

### 1. Primitivas de Layout (novas)

**Diretório**: `src/components/primitives/`

Cada primitiva tem um contrato de largura travado e consome o contrato de
variante. Nenhum `style={{ display | width }}` inline é permitido dentro
dessas primitivas.

**`Prose.tsx` — parágrafos e leads**

- Props públicos:
  - `measure?: 'default' | 'lead' | 'wide'` → mapeia para `max-width`
    `70ch` / `60ch` / `80ch`.
  - `tone?: 'primary' | 'secondary' | 'muted'` → consome role token.
  - `as?: 'p' | 'div' | 'span'` (default `'p'`).
  - `className?`, `children`.
- Classes default (sempre aplicadas):
  - `w-full min-w-0` (piso de largura + não colapsa em flex/grid).
  - `max-w-[70ch] | max-w-[60ch] | max-w-[80ch]` conforme `measure`.
  - `leading-relaxed` + classe de `text-*` do role token.
- CSS que a primitiva possui: nenhum arquivo separado; tudo via utilitárias
  Tailwind + role tokens.

**`Card.tsx` — superfícies**

- Props públicos:
  - `tone?: 'surface' | 'elevated' | 'glass'` (default `'surface'`).
  - `variant?: 'light' | 'dark' | 'teal'` (herdado do contexto da seção via
    `useVariant()`, com override opcional).
  - `padding?: 'sm' | 'md' | 'lg'` (default `'md'`).
  - `radius?: 'md' | 'lg' | 'xl' | '2xl'` (default `'xl'`).
  - `className?`, `children`.
- Classes default:
  - `w-full min-w-0` (bloqueia C2).
  - `rounded-{radius}` + `p-{padding}` consolidados.
  - `bg-{tone}-{variant}` + `text-{role}-{variant}` via role tokens.
- CSS que a primitiva possui: nenhum arquivo separado.

**`Metric.tsx` — valor + rótulo**

- Props públicos:
  - `value: ReactNode` (número, moeda, etc.).
  - `label: string`.
  - `valueTone?: 'urgency' | 'growth' | 'trust'` (default `'urgency'`).
  - `align?: 'start' | 'center'` (default `'start'`).
- Classes default:
  - Raiz: `w-full min-w-0 flex flex-col gap-1`.
  - Value: `text-3xl md:text-4xl font-bold text-{valueTone}-on-{variant}`.
  - Label: `text-sm uppercase tracking-wide text-secondary-on-{variant}`.
- Uso: substitui `.fin-item` + `.fin-label` + `.fin-value` do CSS legado e
  os cards de métrica ad hoc em `NarrativeSection`.

**`Stack.tsx` — ritmo vertical e grids canônicos**

- Props públicos:
  - `direction?: 'column' | 'row' | 'grid'` (default `'column'`).
  - `gap?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'`.
  - `cols?: { base?: 1|2|3|4, sm?, md?, lg?, xl? }` (só quando
    `direction='grid'`).
  - `align?`, `justify?` apenas em `row`/`column`.
- Classes default:
  - `w-full min-w-0`.
  - `direction='grid'` → `grid grid-cols-{cols.base} sm:grid-cols-{cols.sm} …
    gap-{gap}`.
  - `direction='column'` → `flex flex-col gap-{gap}`.
  - `direction='row'` → `flex flex-row gap-{gap} min-w-0`.
- Regra: em `direction='grid'`, `cols.base` nunca é > 1 (preservação de 3.9).

**`Container.tsx` — wrappers de largura**

- Três variantes exportadas nomeadamente:
  - `<PageContainer>` → `w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8`.
  - `<ContentContainer>` → `w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`.
  - `<ProseContainer>` → `w-full max-w-[70ch] mx-auto`.
- Nenhum `Section` ou componente em `sections/**` declara `max-w-*` próprio
  fora desse trio (Property F.4, Requirement 2.14).

**`ChapterHeader.tsx` — cabeçalho de capítulo**

- Extraído do atual cabeçalho embutido em `SectionRenderer` (linhas do
  "Capitulo N de 6" + título + subtítulo).
- Props: `index: number`, `total: number`, `title: string`, `subtitle: string`,
  `variant: 'light' | 'dark' | 'teal'`.
- Composto internamente de `Stack` + `Prose tone="accent"` (eyebrow) + `h1` +
  `Prose measure="lead" tone="secondary"` (subtitle). Nenhum hex literal.

**Barrel**: `src/components/primitives/index.ts` exporta
`{ Prose, Card, Metric, Stack, PageContainer, ContentContainer,
  ProseContainer, ChapterHeader }`.

### 2. Consolidação de Tokens de Cor

**Arquivo**: `src/index.css` (bloco `@theme`)

Adicionar ao bloco existente (preservando os valores hex atuais como fonte de
verdade):

```
/* Semantic role tokens (adicionados) */
--color-support: #8B7EC8;
--color-surface-light: #F8F9FA;
--color-surface-dark: #102642;

/* Variant-scoped text roles (para o Variant Contract) */
--color-text-primary-on-light: #1B3A6B;
--color-text-secondary-on-light: #4b5563;   /* gray-600, AA vs surface-light */
--color-text-muted-on-light: #6b7280;       /* gray-500, AA vs surface-light em bold */

--color-text-primary-on-dark: #ffffff;
--color-text-secondary-on-dark: #cbd5e1;    /* slate-300, AA vs #102642 */
--color-text-muted-on-dark: #94a3b8;        /* slate-400, AA large-only */

--color-text-primary-on-teal: #ffffff;
--color-text-secondary-on-teal: #e6fffa;    /* teal-50-like, pair verified */
--color-text-accent-on-teal: #F5A623;       /* verified ≥ 4.5:1 on #2D9B8A */
```

**Arquivo**: `src/styles/theme.ts`

Adicionar o objeto `variantContract` com a declaração explícita de pares:

```ts
export const variantContract = {
  light: {
    surface: 'var(--color-surface-light)',
    text: {
      primary:   'var(--color-text-primary-on-light)',
      secondary: 'var(--color-text-secondary-on-light)',
      muted:     'var(--color-text-muted-on-light)',
      accent:    'var(--color-growth)', // #2D9B8A on light (verified)
    },
  },
  dark: {
    surface: 'var(--color-surface-dark)',
    text: {
      primary:   'var(--color-text-primary-on-dark)',
      secondary: 'var(--color-text-secondary-on-dark)',
      muted:     'var(--color-text-muted-on-dark)',
      accent:    'var(--color-urgency)', // #F5A623 on dark (verified)
    },
  },
  teal: {
    surface: 'var(--color-growth)',
    text: {
      primary:   'var(--color-text-primary-on-teal)',
      secondary: 'var(--color-text-secondary-on-teal)',
      muted:     'var(--color-text-secondary-on-teal)',
      accent:    'var(--color-text-accent-on-teal)',
    },
  },
} as const;

export type Variant = keyof typeof variantContract;
```

- `useVariant()` hook (novo, `src/hooks/useVariant.ts`) devolve o par
  `(variant, contract)` a partir do contexto mais próximo. `Section.tsx`
  provê o contexto; `Card`, `Prose`, `Metric` o consomem.
- Classe utilitária `.role-primary`, `.role-secondary`, `.role-muted`,
  `.role-accent` declaradas em `@layer components` lendo `var(--color-text-…
  -on-{variant})` — permite aplicar em qualquer primitiva sem condicionais
  JSX.

### 3. Arquivos a Deletar

- **`src/components/sections/ExecutiveSummary.css`** — DELETAR
  integralmente. Todo o conteúdo é reescrito via primitivas + utilitárias
  Tailwind. Cobre Requirement 2.12.

### 4. Arquivos a Reescrever (Seção por Seção)

Para cada arquivo abaixo, a regra é:

- remover `import './*.css'` legado;
- remover `style={{ display | width | backgroundColor: '<hex>' | color:
  '<hex>' }}` em elementos de layout;
- substituir `text-[#1B3A6B]`, `bg-[#2D9B8A]`, etc. por classes/roles do
  contrato de variante;
- envolver cada seção em `<Section variant>` e usar `ContentContainer`
  interno;
- trocar parágrafos livres por `<Prose>`, cartões por `<Card>`, métricas por
  `<Metric>`, grids por `<Stack direction="grid">`.

**Reescritas principais:**

- **`src/components/sections/CoverSection.tsx`**
  - Substituir `<motion.p className="text-xl md:text-2xl text-blue-100 ...">`
    pelo subtítulo em `<Prose measure="lead" tone="secondary">`.
  - Substituir o bloco `bg-white/10 backdrop-blur-md rounded-[2.5rem] ...` por
    `<Card tone="glass" variant="dark">` contendo dois `<Metric>`.
  - Remover `bg-gradient-to-br from-[#1B3A6B] via-[#102642] to-[#2D9B8A]` em
    favor de classe utilitária `.bg-cover-gradient` declarada em `@layer
    components` consumindo tokens.
  - Remover `bg-[#2D9B8A] hover:bg-[#35b19e]` do CTA "Agendar Reunião" e
    trocar por `btn btn-secondary` (já existe em `@layer components`).

- **`src/components/sections/SectionRenderer.tsx`**
  - Substituir o bloco `mb-12 w-full max-w-4xl` contendo os três parágrafos
    com condicionais de variante por `<ChapterHeader index={...} total={...}
    variant={activePage.variant} title={...} subtitle={...} />`.
  - Remover os hex literais `#2D9B8A`, `#F5A623`, `#1B3A6B` inline.

- **`src/components/sections/NarrativeSection.tsx`**
  - Deletar o objeto `toneStyles` (substituído pelo contrato de variante).
  - Substituir o bloco de `metrics` por `<Stack direction="grid" cols={{
    base:1, sm:2, lg:3 }} gap="md">` de `<Metric>`.
  - Substituir o bloco de `cards` por `<Stack direction="grid" cols={{
    base:1, lg:2 }} gap="md">` de `<Card>` contendo `<Prose>` no body.
  - Remover `wrapperBg` com hex literais; usar utilitária de gradiente por
    variante (`.bg-variant-dark-gradient`, `.bg-variant-teal-gradient`) em
    `@layer components`.

- **`src/components/sections/ExecutiveSummarySection.tsx`** (reescrita
  completa)
  - Deletar `import './ExecutiveSummary.css'`.
  - Remover todos os `style={{ display | width | ... }}`.
  - Hero: `<Section variant="dark">` → `<ContentContainer>` → `<Stack gap="xl">`
    → `<Badge variant="outline-light">Visão de Futuro</Badge>` + `<h1>` + `<Prose
    measure="lead" tone="secondary">` + `<Card tone="glass" variant="dark">`
    com `<Stack direction="grid" cols={{ base:1, md:3 }} gap="lg">` de três
    `<Metric>`.
  - Highlights grid: `<Stack direction="grid" cols={{ base:1, md:2, lg:4 }}>`
    de quatro `<Card>`, cada um com `<IconBox tone={item.tone} />` +
    `<Prose>`; remover `color`/`bgColor` inline — `IconBox` consome role
    tokens por `tone`.
  - "Logic section": `<Card tone="surface" variant="light">` contendo
    `<Stack direction="grid" cols={{ base:1, lg:2 }} gap="2xl">`.

- **Demais 18 seções** em `src/components/sections/**Section.tsx` —
  migração mecânica orientada pela ordem abaixo, aplicando a mesma regra:
  remover CSS ad hoc, inline styles e hex literais; envolver em primitivas.

### 5. Public API Summary das Primitivas

| Primitiva         | Largura travada     | Contexto de variante    | Gerencia CSS? |
| ----------------- | ------------------- | ----------------------- | ------------- |
| `Prose`           | `w-full min-w-0 max-w-[Xch]` | consome via `tone`     | só utilitárias |
| `Card`            | `w-full min-w-0`    | consome via `useVariant`| só utilitárias |
| `Metric`          | `w-full min-w-0`    | consome via `useVariant`| só utilitárias |
| `Stack`           | `w-full min-w-0`    | agnóstico               | só utilitárias |
| `PageContainer`   | `max-w-[1400px]`    | agnóstico               | só utilitárias |
| `ContentContainer`| `max-w-[1200px]`    | agnóstico               | só utilitárias |
| `ProseContainer`  | `max-w-[70ch]`      | agnóstico               | só utilitárias |
| `ChapterHeader`   | (via Stack + Prose) | consome via prop        | só utilitárias |

### 6. Migration Order

A ordem abaixo mantém o repositório "verde" a cada checkpoint. Cada etapa é
um commit/PR atômico, com build + testes passando antes da próxima.

1. **Infra** — criar `src/components/primitives/` (todas as primitivas),
   `src/hooks/useVariant.ts`, `variantContract` em `theme.ts`, role tokens em
   `index.css`. Barrel exportando tudo. **Sem tocar em seções ainda.**
2. **Piloto** — migrar `CoverSection.tsx` (maior visibilidade, é o caso
   canônico de C1). Validar Property A/C manualmente + nos testes.
3. **Infraestrutura compartilhada** — migrar `SectionRenderer.tsx` para usar
   `ChapterHeader`. Valida Property A no cabeçalho de cada capítulo.
4. **Narrativa** — migrar `NarrativeSection.tsx` (usada por várias seções).
   Valida Property A/B/C de uma vez.
5. **Resumo Executivo** — reescrever `ExecutiveSummarySection.tsx` **e
   deletar** `ExecutiveSummary.css` no mesmo commit. Valida Property F.1 e
   F.2 pela primeira vez.
6. **Sections batch 1** (variante `light`): `ProductOverviewSection`,
   `TechnicalThesisSection`, `GradualProtocolsSection`, `OERAFounderSection`,
   `ProductModulesSection`.
7. **Sections batch 2** (variante `teal`): `MarketUrgencySection`,
   `MarketRevenueSection`.
8. **Sections batch 3** (variante `dark`): `ProjectionsSection`,
   `ProposalTranchesSection`, `PaymentProofSection`,
   `ExpectedReturnSection`, `PreScaleReturnSection`.
9. **Sections batch 4** (variante `light` de execução):
   `WhyGradualSection`, `TeamSection`, `GovernanceSection`,
   `ExecutionPlanSection`, `ObjectionsSection`, `DecisionFrameworkSection`.
10. **Sections batch 5** (variante `dark` de fecho): `SummaryTermsSection`,
    `NextStepsSection`.
11. **Verificação estática final** — executar o linter regex de Property F
    (F.1/F.2/F.3) em CI. Zero ocorrências. Remover o import do CSS legado
    de qualquer arquivo remanescente.

### 7. Inline Style Patterns to Remove (inventário explícito)

Regex que devem ter zero match em `src/components/sections/**` após o
refactor (usados em F.2 e F.3):

- `style=\{\{\s*display\s*:` — qualquer estilo inline de `display`.
- `style=\{\{[^}]*width\s*:` — qualquer `width` inline em elemento de layout.
- `text-\[#[0-9A-Fa-f]{6}\]` — classe Tailwind arbitrária com hex de marca.
- `bg-\[#[0-9A-Fa-f]{6}\]` — idem para background.
- `(#1B3A6B|#2D9B8A|#F5A623|#8B7EC8|#102642|#F8F9FA)` (case-insensitive) em
  qualquer `.tsx` ou `.css` local de `sections/**`.
- `!important` em qualquer `.css` sob `sections/**`.

## Testing Strategy

### Validation Approach

A estratégia de teste segue dois momentos. Primeiro, executamos a fase
**exploratória** em cima do código **não-refatorado** para confirmar que as
sub-condições C1/C2/C3 realmente se manifestam onde a hipótese diz que se
manifestam (e para refinar o diagnóstico se algum caso não reproduzir).
Depois, com o refactor iniciado, rodamos **fix checking** (Property A–C) sobre
o código refatorado e **preservation checking** (Property D–E) comparando o
comportamento de F com F' em inputs não-buggy. A Property F roda em
inspeção estática contínua (CI) durante toda a migração.

### Exploratory Bug Condition Checking

**Objetivo**: antes de tocar em código de produção, escrever testes que
**falhem na base atual** e confirmem empiricamente as sub-condições C1, C2 e
C3. Se alguma não reproduzir, voltamos à análise de causa raiz (hipóteses 1–4
em _Hypothesized Root Cause_).

**Plano de teste**: usar `jsdom` + `@testing-library/react` + medição de
`getBoundingClientRect` (com o polyfill de layout do vitest/jsdom) para C1 e
C2; usar uma tabela de pares de cor extraídos do código atual com cálculo de
contraste (biblioteca `wcag-contrast` ou equivalente) para C3.

**Test Cases (rodam na base não-refatorada e devem falhar):**

1. **C1 — Subtítulo da capa**: renderizar `CoverSection` em jsdom viewport
   `1440×900`, consultar o `<p>` com texto "Transforme o futuro da terapia
   ABA digital com o Grupo Gradual", assertar `wordsPerLine ≥ 2` (esperamos
   que falhe ou que seja classificado como "suspeito" no estado atual por
   falta de contrato de largura).
2. **C1 — ChapterHeader subtítulo**: renderizar `SectionRenderer` em
   qualquer página, viewport `768×1024`, assertar que o subtítulo do
   capítulo tem `width > min-content` e `wordsPerLine ≥ 2`.
3. **C2 — Linha de cards da NarrativeSection**: renderizar
   `NarrativeSection` com `tone="dark"` e 4 cards em viewport `1024×768`,
   assertar que `card.width ≈ (parent − gap) / 2` para cada card e que o
   texto interno tem `wordsPerLine ≥ 3`.
4. **C2 — Grid financeiro do ExecutiveSummary**: renderizar
   `ExecutiveSummarySection`, assertar que cada `.fin-item` tem largura
   `≈ parent/3 − gap` (esperamos falha por causa de `min-width: 300px` em
   `.exec-financials`).
5. **C3 — Pares de cor da paleta**: iterar sobre todos os pares
   `(text-role, bg)` extraídos de `CoverSection`, `SectionRenderer`,
   `NarrativeSection` e `ExecutiveSummarySection`, assertar contraste
   `≥ 4.5:1`. Esperamos ao menos um par falhar
   (`#a5b4fc` sobre `#1b3a6b→#102642`).

**Expected Counterexamples**:

- Parágrafos com `wordsPerLine < 2` em viewports ≥ 768px, confirmando C1.
- Cards em grid com largura medida diferente do esperado, confirmando C2.
- Ao menos um par `(fg, bg)` com ratio `< 4.5`, confirmando C3.
- Possíveis causas raiz confirmadas: ausência de `width: 100%` nas primitivas,
  grids multi-coluna sem `min-width: 0` nos filhos, tokens subutilizados.

Se algum desses testes **passar** na base atual, re-hipotetizamos antes de
prosseguir com o refactor.

### Fix Checking

**Objetivo**: verificar que, para todos os inputs onde a bug condition se
aplica (renderizações afetadas por C1/C2/C3), o código refatorado produz o
comportamento esperado descrito em Property A/B/C.

**Pseudocode:**

```
FOR ALL rendering r WHERE C1(r) ∨ C2(r) ∨ C3(r) DO
  result := renderWithPrimitives(r.input)
  ASSERT Property_A(result)
  ASSERT Property_B(result)
  ASSERT Property_C(result)
END FOR
```

**Como aplicamos:**

- Os mesmos testes da fase exploratória (1–5 acima) passam a rodar sobre
  `F'` e devem **passar**.
- Adicionamos casos de estresse gerados por property-based testing (ver
  seção _Property-Based Tests_).

### Preservation Checking

**Objetivo**: para todos os inputs onde a bug condition **não** se aplica, o
render de `F'` é equivalente ao render de `F` (e as 7 PBTs existentes
continuam passando).

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT F(input).textContent   == F'(input).textContent
  ASSERT F(input).landmarks     == F'(input).landmarks
  ASSERT F(input).headingOrder  == F'(input).headingOrder
  ASSERT F(input).ariaLabels    == F'(input).ariaLabels
  ASSERT existing_PBTs(F')      all pass
END FOR
```

**Testing Approach**: property-based testing é recomendado para preservation
checking porque:

- gera muitos inputs (slugs de página, variantes, viewports, combinações de
  tone/role) que varrem o domínio muito além dos casos unit;
- captura regressões sutis (ex.: `ChapterHeader` perder um landmark, uma
  seção perder um `aria-label`);
- oferece garantia forte de que nenhum comportamento "não-buggy" foi
  alterado pelo refactor.

**Test Plan**: observar o comportamento de `F` em uma snapshot de `textContent`
+ estrutura de landmarks para cada seção, **antes** do refactor; depois do
refactor rodar property-based tests que verificam que `F'` produz a mesma
snapshot para o mesmo input (excluindo apenas regiões onde `C` se aplicava).

**Test Cases:**

1. **Preservação de textContent**: para cada uma das 22 seções × 3 viewports
   (`375`, `768`, `1440`), concatenar `textContent` visível, comparar
   substring por substring com a snapshot `F`. Propriedade: todos os
   substrings presentes em `F` estão presentes em `F'`.
2. **Preservação de landmarks e hierarquia**: para cada página (6), extrair
   `role="banner" | "main" | "navigation" | "contentinfo" | "article"` e a
   sequência de `h1 → h2 → h3`, comparar igualdade.
3. **Preservação de props de interativos**: para cada um dos 8 componentes
   interativos, renderizar isoladamente dentro de uma seção refatorada e
   de uma seção base, snapshot de props montadas, comparar igualdade.
4. **Preservação das 7 PBTs**: executar a suíte atual sem alteração.
   Propriedade: todas passam em `F'`.
5. **Preservação de modos e motion**: alternar `landing` ↔ `presentation`
   várias vezes, assertar mesma seção ativa; setar `matchMedia('prefers-
   reduced-motion: reduce')`, assertar ausência de animações não-essenciais
   em `F'`.
6. **Preservação do colapso responsivo**: para cada grid
   (`NarrativeSection`, `ExecutiveSummarySection`, métricas), viewport
   `375px` ⇒ uma coluna, ordem semântica preservada.

### Unit Tests

- `Prose.test.tsx`: renderiza dentro de pais `flex`/`grid` com mocks de
  `getBoundingClientRect`, assertar `width > min-content`.
- `Card.test.tsx`: renderiza dentro de grid de `N` colunas, assertar
  `width ≈ (parent − (N-1)×gap) / N`.
- `Metric.test.tsx`: renderiza com `tone="urgency"`, assertar classes/vars
  resolvidas corretamente por variante.
- `Stack.test.tsx`: `direction='grid'` com `cols={{ base:1, md:3 }}`,
  assertar classes `grid-cols-1 md:grid-cols-3`.
- `variantContract.test.ts`: iterar sobre todos os pares
  `(variant, role)`, calcular contraste, assertar `≥ 4.5` normal /
  `≥ 3.0` large.
- `ChapterHeader.test.tsx`: smoke + landmarks + ausência de hex literal.

### Property-Based Tests

- **PBT-A (C1 — largura de Prose)**: gerador (`fast-check`) produz triplas
  `(viewport ∈ [320, 1920], measure ∈ {default, lead, wide}, parent ∈
  {flex, grid, flow})`. Renderiza `<Prose>` com texto-exemplar de 30–200
  palavras dentro do pai gerado. Propriedade: `wordsPerLine ≥ 2`, sem nunca
  cair a `min-content`.
- **PBT-B (C2 — largura de Card em grid)**: gerador produz
  `(viewport, cols ∈ [1..4], gap ∈ {sm, md, lg, xl}, numCards ∈ [1..12])`.
  Renderiza `<Stack direction='grid'>` com `<Card>`s. Propriedade:
  `|cardWidth − expected| ≤ 4px` para cada card, e `wordsPerLine ≥ 3` no
  texto interno.
- **PBT-C (C3 — contraste do contrato de variante)**: gerador itera
  exaustivamente `(variant ∈ {light, dark, teal}, role ∈ {primary,
  secondary, muted, accent}, large ∈ {true, false})`. Propriedade: para
  cada combinação usada em ao menos uma primitiva, o contraste resolvido
  é `≥ 4.5` normal / `≥ 3.0` large.
- **PBT-D (preservação de conteúdo)**: gerador produz `(pageSlug ∈ 6
  páginas, viewport ∈ {375, 768, 1440})`. Propriedade: `textContent(F')
  ⊇ textContent(F)` (mesmo conjunto de substrings em ordem).
- **PBT-E (preservação de landmarks e motion)**: gerador produz
  `(pageSlug, mode ∈ {landing, presentation}, reducedMotion ∈ {true,
  false})`. Propriedade: mesmo conjunto de landmarks + mesmo comportamento
  de motion que `F`.
- **PBT-F (inspeção estática)**: não usa gerador randômico; itera sobre o
  resultado de `glob('src/components/sections/**/*.{tsx,css}')` e aplica
  os regex de Property F, assertando zero matches.

### Integration Tests

- **Fluxo de página completa**: abrir cada uma das 6 páginas, rolar
  ponta-a-ponta em viewports `375` / `768` / `1440`, capturar screenshots
  sanitários, assertar que o snapshot visível contém as seções esperadas
  na ordem esperada.
- **Alternância Landing ↔ Presentation**: navegar de uma página para a
  outra em ambos os modos, assertar que a seção ativa, o `scrollIntoView`
  e o foco continuam idênticos ao pré-refactor.
- **Acessibilidade**: rodar `axe-core` em cada página, assertar zero
  violações de contraste (WCAG AA) e zero violações de estrutura de
  landmarks.
- **Animações**: com `prefers-reduced-motion: no-preference`, assertar que
  cada seção aplica o `variants` de entrada definido em `Section.tsx`;
  com `prefers-reduced-motion: reduce`, assertar ausência de animações não
  essenciais (mesma asserção hoje existente em
  `Section.animation.test.tsx`).
