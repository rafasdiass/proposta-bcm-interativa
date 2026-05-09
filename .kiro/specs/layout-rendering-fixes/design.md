# layout-rendering-fixes Bugfix Design

## Overview

Este bugfix endereça quatro classes de defeito observáveis hoje na Proposta BCM Interativa (1.1–1.5 do `bugfix.md`): (a) ausência de respiro vertical entre o conteúdo e as barras fixas (`header` no topo e `StickyCTA` no rodapé), (b) uso inadequado do espaço horizontal com parágrafos colapsando em colunas estreitas demais, (c) renderização de 17 das 22 seções como `PlaceholderSection` (e não 15 como mencionado no `bugfix.md` — ver nota abaixo) e (d) falta de espaçamento vertical entre cabeçalho da Section e o primeiro bloco de conteúdo.

**Atualização de escopo durante implementação:** além dos defeitos de layout/renderização, foi identificado um gap de experiência: renderizar 22 seções como uma rolagem única e com moldura de slide torna a proposta cansativa e pouco premium. O resultado final esperado passou a ser uma ferramenta interativa de apresentação, com navegação global por páginas/capítulos e sem header/footer interno repetido em cada seção.

A estratégia é concentrada em três pontos cirúrgicos, sem tocar em componentes interativos já estabilizados:

1. **Wrapper `Section`** (`src/components/sections/Section.tsx`) — corrigir o padding vertical do slot de conteúdo para considerar a sobreposição das barras fixas (`header` `fixed top-0` e `StickyCTA` `fixed bottom-0`) e introduzir um sistema de slots de largura (`container` vs `prose`).
2. **Tipografia e larguras utilitárias** (`src/index.css`) — declarar utilitárias `prose-measure` (~65–75ch) e ajustar `container-content` / `scroll-mt` para o offset do header fixo.
3. **Conteúdo das 17 seções pendentes** — substituir os `PlaceholderSection` por implementações reais, reutilizando os componentes interativos já existentes (`ROISimulator`, `SofthouseCalculator`, `TrancheTimeline`, `CountdownTimer`, `ComparisonTable`, `IntentForm`) e adotando o padrão narrativo já estabelecido em `ExecutiveSummarySection` e `ObjectionsSection`.
4. **Experiência paginada por capítulos** — introduzir `proposalPages` e `ProposalNavbar`, agrupando as 22 seções em 6 páginas navegáveis. `SectionRenderer` passa a renderizar a página ativa, não a sequência inteira, e cada página remove a moldura interna de slide (`showHeader=false`, `showFooter=false`).

Nota sobre o escopo: o `bugfix.md` (bloco 1.4) lista 15 seções pendentes, mas a varredura do workspace (ver _Root Cause Analysis_) identificou 17. As seções extras `projecoes` e `governanca` também renderizam `PlaceholderSection`. O usuário confirmou que o escopo abrange as 17 seções e que todas devem receber conteúdo real — não estado intermediário.

## Glossary

- **Bug_Condition (C)**: A condição composta que produz qualquer dos cinco sintomas observáveis — `C = C_topSpacing ∨ C_bottomSpacing ∨ C_proseWidth ∨ C_placeholder ∨ C_headerGap`. Um input (render de uma Section em um viewport) satisfaz `C` quando pelo menos um dos sub-sintomas ocorre.
- **Property (P)**: Respiro vertical adequado, largura horizontal usada corretamente, ausência de `PlaceholderSection` em produção, e espaçamento header→conteúdo ≥ limiar. Definido formalmente na seção _Correctness Properties_.
- **Preservation**: As 5 seções já implementadas (`capa`, `resumo-executivo`, `produto-modulos`, `protocolos-gradual`, `objecoes`), a lógica dos 8 componentes interativos (`ROISimulator`, `SofthouseCalculator`, `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`, `ObjectionAccordion`, `IntentForm`, `StickyCTA`), a alternância Landing/Presentation, o respeito a `prefers-reduced-motion`, a paleta institucional e os landmarks semânticos continuam iguais após o fix.
- **Section (wrapper)**: O componente `Section` em `src/components/sections/Section.tsx`, que encapsula cada slide com header/content/footer e aplica a variante cromática (`light | dark | teal`). É o ponto único onde o padding do slot de conteúdo é decidido.
- **SectionRenderer**: O componente em `src/components/sections/SectionRenderer.tsx` que itera `sectionConfigs` e hospeda cada seção dentro de um `ErrorBoundary` + `Suspense`.
- **PlaceholderSection**: Componente em `src/components/sections/PlaceholderSection.tsx` usado como stub em 17 seções, exibindo "Em desenvolvimento" — alvo principal do sintoma 1.3/1.4.
- **Sticky_CTA**: Barra fixa no rodapé (`fixed bottom-0`) de altura aproximada 72px desktop / 56px mobile, que é a fonte direta do defeito 1.1 (respiro inferior insuficiente).
- **Fixed_Header**: O elemento `<header id="navigation-controls">` em `App.tsx` com `fixed top-0` e `z-50`, altura aproximada 56px desktop / 48px mobile, fonte direta do defeito 1.1 (respiro superior).
- **Proposal_Page**: Novo agrupamento de seções por intenção de decisão. Ex.: `produto` contém definição do BCM, módulos, tese técnica, protocolos e OERA fundador.
- **ProposalNavbar**: Nova navegação global fixa, substituindo o controle de modo/indicador de progresso no topo por marca, capítulos, seletor mobile e botões anterior/próximo.
- **max-w-prose**: Utilitária Tailwind nativa v4 (≈ 65ch) usada para texto corrido para preservar legibilidade.
- **max-w-7xl**: Utilitária Tailwind (1280px) usada no container principal da Section para grids, cards e tabelas.

## Bug Details

### Bug Condition

O bug manifesta-se em qualquer render de Section dentro de `SectionRenderer`. O wrapper `Section.tsx` aplica `px-4 py-6 sm:px-6 sm:py-8` no slot de conteúdo, que produz **16–24px de padding vertical no slot interno**, enquanto a `header` fixa consome ~56px no topo e o `StickyCTA` consome ~72px no rodapé — logo o conteúdo é **cortado/sobreposto**. Separadamente, 17 das 22 seções renderizam um componente `PlaceholderSection` com `min-h-[60vh] flex items-center justify-center` que centraliza um ícone + "Em desenvolvimento", produzindo a aparência de "página em branco". Finalmente, os blocos textuais das seções implementadas não usam `max-w-prose`, então parágrafos herdam a largura do `max-w-7xl` (1280px) e renderizam numa coluna muito larga em alguns casos ou (mais frequente) num grid que colapsa em 2 colunas com paragrafos verticalizados sem respiro horizontal quando o conteúdo é escasso.

**Formal Specification:**

```
FUNCTION isBugCondition(render)
  INPUT: render — result of rendering a Section (id, variant, viewport) within SectionRenderer
  OUTPUT: boolean

  LET contentSlot       = render.querySelector('[data-section-content]')
  LET header            = document.querySelector('header[id="navigation-controls"]')
  LET stickyCTA         = document.querySelector('[id="sticky-cta"]')
  LET viewport          = render.viewportWidth

  LET topPadding        = computedStyle(contentSlot).paddingTop
  LET bottomPadding     = computedStyle(contentSlot).paddingBottom
  LET headerHeight      = header.offsetHeight            // ≈ 56 desktop / 48 mobile
  LET ctaHeight         = stickyCTA.offsetHeight         // ≈ 72 desktop / 56 mobile
  LET minTop            = viewport >= 768 ? 64 : 32
  LET minBottom         = viewport >= 768 ? 64 : 32
  LET minHeaderGap      = viewport >= 768 ? 48 : 24

  LET C_topSpacing      = topPadding < headerHeight + minTop
  LET C_bottomSpacing   = bottomPadding < ctaHeight + minBottom
  LET C_placeholder     = render.contains(component "PlaceholderSection")
                           OR render.textContent.includes("Em desenvolvimento")
  LET C_proseWidth      = viewport >= 768
                           AND EXISTS paragraph p IN render.textParagraphs
                           WHERE getBoundingClientRect(p).width > 75ch
  LET C_headerGap       = showHeader
                           AND gapBetween(headerSlot, firstContentChild) < minHeaderGap

  RETURN C_topSpacing
      OR C_bottomSpacing
      OR C_placeholder
      OR C_proseWidth
      OR C_headerGap
END FUNCTION
```

### Examples

- **Defeito 1.1 (respiro superior)**: Em desktop (1440×900), a Section `resumo-executivo` renderiza `<h2>Uma Oportunidade Única de Parceria</h2>` começando a ~32px do topo do viewport. O `header` fixo (`position: fixed; top: 0; height: ~56px; z-index: 50`) sobrepõe os primeiros ~24px do título. **Esperado**: título inicia ao menos a `64 + 56 = 120px` do topo da viewport em desktop, ou `32 + 48 = 80px` em mobile.
- **Defeito 1.1 (respiro inferior)**: Em mobile (375×667), o último parágrafo da Section `objecoes` é coberto pelo `StickyCTA` (altura ~56px em mobile com menu fechado). **Esperado**: último bloco visível da Section termina a ao menos `56 + 32 = 88px` do `bottom:0`.
- **Defeito 1.2 (parágrafos verticalizados)**: Em tablet (768×1024), a Section `resumo-executivo` exibe o parágrafo "O BCM representa a próxima geração..." dentro de uma `div` `text-center max-w-4xl` (aproximadamente 896px), mas sem classe de largura de leitura; em conjunto com `leading-relaxed`, a linha fica longa demais (~115ch). **Esperado**: parágrafos de texto corrido usam `max-w-prose` (~65ch) e ficam entre 45ch e 75ch.
- **Defeito 1.3 (urgência-mercado placeholder)**: Na URL `#urgencia-mercado`, o conteúdo visível é apenas um ícone `FileText` cinza, o título `MarketUrgency` (em inglês) e "Em desenvolvimento". **Esperado**: conteúdo substantivo sobre dor do setor + janela de fundador + escassez, com ao menos um componente interativo (ex.: `CountdownTimer`) e ≥ 3 blocos narrativos.
- **Defeito 1.4 (varredura de 17 placeholders)**: 77% das seções configuradas (`17/22`) renderizam o mesmo placeholder genérico. **Esperado**: 100% das seções exibem implementação real com conteúdo narrativo coerente à proposta.
- **Edge case (Cover)**: A Section `capa` tem `showHeader: false` e `showFooter: false`, logo não deve sofrer as penalidades de respiro superior (o próprio componente gerencia sua altura com `min-h-screen` e centraliza). O fix não deve alterar esse comportamento.

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Todas as 5 seções já implementadas (`CoverSection`, `ExecutiveSummarySection`, `ProductModulesSection`, `GradualProtocolsSection`, `ObjectionsSection`) continuam renderizando seu conteúdo atual — títulos, copy, ordem dos blocos e componentes interativos incorporados.
- Todos os 8 componentes interativos (`ROISimulator`, `SofthouseCalculator`, `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`, `ObjectionAccordion`, `IntentForm`) mantêm assinatura de props, lógica e valores calculados. Os 7 testes PBT existentes (`ROISimulator.property.test.ts`, `SofthouseCalculator.property.test.ts`, `TrancheTimeline.property.test.ts`, `CountdownTimer.property.test.ts`, `ModuleCards.property.test.ts`, `formatting.property.test.ts`, `NavigationProvider.property.test.tsx`) continuam passando sem alteração nos arquivos de teste ou de produção que eles cobrem.
- A alternância entre Landing_Mode e Presentation_Mode e o comportamento de navegação por teclado (ArrowRight/PageDown/Home/End/Esc) permanecem idênticos.
- A paleta institucional (`#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA`, `#102642`) e as três variantes cromáticas de Section (`light | dark | teal`) continuam sendo aplicadas via `sectionVariants` em `src/styles/theme.ts` e via `@theme` em `src/index.css`.
- `prefers-reduced-motion` continua desabilitando as animações de scroll-reveal (`useReducedMotion` + `whileInView` no Section wrapper) e as transições do Framer Motion nos novos conteúdos.
- A hierarquia semântica (`header > main > aside`, `h1` único por Section, landmarks `banner`/`main`/`complementary`) é mantida.

**Scope:**

Todos os inputs que **não** violam a `isBugCondition` acima ficam intocados pelo fix. Especificamente:

- A lógica de cálculo e o layout interno dos 8 componentes interativos. Não alteramos nenhum arquivo em `src/components/interactive/**`.
- O `SectionRenderer.tsx` permanece inalterado (responsabilidades de roteamento, Suspense e ErrorBoundary são ortogonais ao defeito).
- As seções `capa`, `resumo-executivo`, `produto-modulos`, `protocolos-gradual` e `objecoes` só recebem alteração de wrapping (aplicação do novo slot `prose` onde há texto corrido), não alteração de conteúdo.
- A configuração de `sectionConfigs` em `src/data/sections.ts` — ordem, slugs, variantes e flags `showHeader/showFooter` — permanece idêntica.

## Hypothesized Root Cause

Com base na inspeção do código e nos sintomas, as causas raízes são:

1. **Padding do slot de conteúdo insuficiente no wrapper Section** (causa 1.1 e 1.5).
   - O arquivo `src/components/sections/Section.tsx`, linhas 131–133, aplica `className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8"` ao container interno. Isso resulta em 24px (`py-6`) a 32px (`py-8`) de padding vertical, insuficiente para compensar:
     - o `header` em `App.tsx` com `fixed top-0 z-50` e altura efetiva ~56px,
     - o `StickyCTA` com `fixed bottom-0 z-40` e altura 56–72px (com `container-content py-4` em desktop, `py-3` + expandable em mobile).
   - Resultado: o conteúdo "passa por baixo" das barras fixas. A utilitária `scroll-mt-16` (64px) aplicada na section tenta compensar na navegação por âncora, mas não compensa a visualização em rolagem livre.

2. **Ausência de utilitária de largura de leitura** (causa 1.2).
   - Não há nenhuma aplicação de `max-w-prose` ou `container-prose` (que já existe em `src/index.css` linha ~230, usando `max-w-65ch`) nos blocos de texto corrido das seções implementadas. Os parágrafos herdam a largura do pai (`max-w-4xl` = 896px, ou mesmo `max-w-7xl` = 1280px), superando a zona confortável de leitura de 45–75 caracteres por linha em viewports ≥ 768px.

3. **17 seções stub não implementadas** (causa 1.3 e 1.4).
   - Grepping por `PlaceholderSection` retorna 17 arquivos em `src/components/sections/` que fazem `return <PlaceholderSection title="..." />`. O título em inglês (`MarketUrgency`, `TechnicalThesis`, etc.) e a mensagem genérica "Em desenvolvimento" do placeholder produzem a aparência de 77% da proposta incompleta. Esses arquivos foram deixados como stubs durante a implementação inicial (tasks 6.x–12.x do spec principal marcaram como concluídas sem preencher esses componentes — verificável pela ausência de import/uso real dos componentes interativos correspondentes em cada arquivo).
   - Nota de discrepância: o `bugfix.md` indica 15 pendentes, mas a varredura de código mostra 17 (inclui `projecoes` e `governanca`, que o bugfix.md listava entre as já implementadas). O design assume a realidade do código — 17 seções.

4. **Gap entre header interno da Section e primeiro filho do conteúdo inexistente** (causa 1.5).
   - No `Section.tsx` linhas 119–138, o `<header>` interno da seção termina com `border-b` e o `<div>` de conteúdo inicia imediatamente depois, com apenas o `py-6/py-8` do container como respiro. Não há espaçamento semântico extra entre "cabeçalho da Section" e "primeiro bloco", o que produz a colagem visual descrita em 1.5.

5. **Modelo de navegação excessivamente linear** (causa 1.6 e 1.9).
   - `SectionRenderer` renderizava todas as 22 seções na mesma superfície. Mesmo com conteúdo real, isso cria uma onepage longa, difícil de revisar e pouco orientada à decisão.
   - A estrutura anterior obrigava o usuário a consumir a narrativa como sequência fixa; para uma proposta executiva, o cliente precisa acessar rapidamente Produto, Investimento, Governança ou Próximos Passos.

6. **Moldura visual de slide deck** (causa 1.7 e 1.8).
   - `Section` adicionava header/footer em cada seção, repetindo marca e confidencialidade como se cada bloco fosse um slide.
   - `App.tsx` exibia controles de modo `Rolagem`/`Apresentação`, reforçando a percepção de PowerPoint online. Esse modelo conflita com o objetivo declarado: uma ferramenta interativa para impressionar o cliente.

7. **Medida de leitura sem largura real** (causa 1.10).
   - Usar apenas `max-w-prose` limita a largura máxima, mas não garante largura disponível quando o elemento é filho de `flex` ou de grids com colunas estreitas. O item pode sofrer shrink e assumir largura mínima, fazendo o texto renderizar quase verticalmente.
   - A correção é uma utilitária explícita `prose-measure` com `width: 100%`, `max-width: 70ch` e `min-width: 0`.

8. **Cards narrativos em colunas demais** (causa 1.11).
   - A grade narrativa usava até quatro colunas (`xl:grid-cols-4`). Isso é adequado para métricas curtas, mas ruim para parágrafos persuasivos.
   - A correção limita cards narrativos a duas colunas em desktop (`lg:grid-cols-2`), mantendo métricas e tabelas com suas próprias grades.

9. **Contraste quebrado por shell colorido e CSS legado** (causa 1.12 e 1.13).
   - Ao agrupar seções diferentes em uma página, manter o shell da página em `dark`/`teal` quebrou seções internas escritas para fundo claro.
   - `App.css` continha overrides globais para classes Tailwind (`.text-gray-600`, `.text-sm`, `.text-xs`, `.mt-4`), fazendo textos ficarem claros dentro de cards claros.
   - A correção remove o import de `App.css` do `App.tsx`, preserva o CSS Tailwind como fonte de verdade e define páginas/capítulos com shell claro neutro.

## Correctness Properties

Property 1: Bug Condition - Respiro vertical mínimo em todas as Sections

_For any_ Section renderizada pelo `SectionRenderer` em qualquer variante (`light | dark | teal`) e qualquer viewport na faixa [320px, 2560px], após o fix o padding vertical do slot de conteúdo SHALL satisfazer `paddingTop ≥ headerHeight + 32px (mobile) | 64px (desktop)` e `paddingBottom ≥ stickyCTAHeight + 32px (mobile) | 64px (desktop)`. Em termos de classes Tailwind aplicadas, o container de conteúdo SHALL expor `pt-24 pb-28 md:pt-32 md:pb-36` (ou valores equivalentes que produzam esses pixels computados).

**Validates: Requirements 2.1, 2.5**

Property 2: Bug Condition - Largura de leitura limitada em texto corrido

_For any_ bloco de texto corrido (elemento com o papel semântico de parágrafo — `p`, `li` em listas narrativas, e headings `h2/h3` acompanhando um parágrafo) renderizado dentro de qualquer Section em viewport ≥ 768px, após o fix a largura computada do bloco SHALL ser ≤ 75ch (aproximadamente 65ch alvo via `max-w-prose`). Grids, cards e tabelas (`role="table"` ou componentes que empilham cards em múltiplas colunas) NÃO estão sujeitos a essa propriedade e continuam usando `max-w-7xl` do container.

**Validates: Requirements 2.2**

Property 3: Bug Condition - Nenhuma Section renderiza PlaceholderSection

_For any_ `sectionConfig` em `sectionConfigs` (todas as 22 seções), o render do componente associado SHALL satisfazer ambos: (a) não conter o componente `PlaceholderSection` na árvore React resultante, e (b) não conter a string literal "Em desenvolvimento" no `textContent`. Adicionalmente, cada seção SHALL expor um heading `h2` (ou `h1` no caso de `capa`) em pt-BR com conteúdo narrativo substantivo.

**Validates: Requirements 2.3, 2.4**

Property 4: Preservation - Seções já implementadas preservam conteúdo e estrutura

_For any_ Section em `{capa, resumo-executivo, produto-modulos, protocolos-gradual, objecoes}`, o conjunto de textos-chave (títulos, copy persuasiva, rótulos de botões, labels de componentes interativos) presente antes do fix SHALL continuar presente após o fix, e a árvore de componentes interativos embutidos (`ModuleCards`, `ProtocolSelector`, `ObjectionAccordion`) SHALL continuar sendo montada com as mesmas props.

**Validates: Requirements 3.1, 3.7**

Property 5: Preservation - Lógica dos componentes interativos inalterada

_For any_ input nos 8 componentes interativos (`ROISimulator`, `SofthouseCalculator`, `TrancheTimeline`, `CountdownTimer`, `ModuleCards`, `ProtocolSelector`, `ObjectionAccordion`, `IntentForm`), o resultado (valor calculado, estado de toggle, evento emitido, formato de output) SHALL ser idêntico ao resultado antes do fix. Os 7 testes PBT existentes no repositório SHALL continuar passando sem modificações.

**Validates: Requirements 3.3**

Property 6: Preservation - Comportamento de modo, movimento e paleta

_For any_ combinação de (modo de navegação ∈ {landing, presentation}, `prefers-reduced-motion` ∈ {true, false}, variante cromática ∈ {light, dark, teal}, viewport ≤ 640px), após o fix o sistema SHALL preservar exatamente: (a) a regra de visibilidade `block/hidden` por seção em presentation mode, (b) a substituição das animações decorativas por transições ≤ 100ms quando reduced motion está ativo, (c) o mapeamento de cada variante para os tokens de cor/background correspondentes e (d) o colapso de grids multi-coluna em coluna única em viewports ≤ 640px.

**Validates: Requirements 3.2, 3.4, 3.5, 3.6**

Property 7: Experience - Proposta dividida em capítulos navegáveis

_For any_ acesso à proposta, a primeira superfície visível SHALL conter uma navbar global com os capítulos `Visão Geral`, `Mercado`, `Produto`, `Investimento`, `Execução`, `Termos e Próximos Passos`. Navegar entre capítulos SHALL trocar a página ativa e atualizar o fragmento semântico da URL.

**Validates: Requirements 2.6, 2.7, 2.9**

Property 8: Experience - Sem aparência de slide deck

_For any_ página renderizada pelo `SectionRenderer`, o wrapper SHALL renderizar `showHeader=false` e `showFooter=false`, evitando cabeçalho/rodapé interno repetitivo. A identidade da proposta SHALL aparecer na navbar global e no CTA persistente, não em molduras por seção.

**Validates: Requirements 2.8**

Property 9: Reading Width - Texto sempre horizontal e legível

_For any_ bloco narrativo renderizado em `SectionRenderer` ou `NarrativeSection`, o elemento SHALL receber largura real (`width: 100%`) e limite de leitura (`max-width: 70ch`), evitando shrink para coluna mínima em contextos flex/grid. Cards com parágrafos SHALL renderizar em no máximo duas colunas em desktop.

**Validates: Requirements 2.10, 2.11**

Property 10: Contrast - Shell claro e utilitárias Tailwind preservadas

_For any_ página/capítulo renderizado, o shell SHALL usar variante `light`, evitando conflito de contraste entre seções heterogêneas. O app SHALL NOT importar CSS legado que redefina utilitárias Tailwind globais de cor/tipografia.

**Validates: Requirements 2.12, 2.13**

## Fix Implementation

### Changes Required

O fix é dividido em 4 tipos de mudança, listados do mais impactante ao mais pontual.

---

**File**: `src/components/sections/Section.tsx`

**Function**: componente `Section` (default export)

**Specific Changes**:

1. **Aumentar padding vertical do slot de conteúdo** (endereça Property 1). Substituir `className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8"` por `className="max-w-7xl mx-auto px-4 pt-24 pb-28 sm:px-6 md:pt-32 md:pb-36"`. Valores escolhidos:
   - Mobile: `pt-24` = 96px (≥ 56px header + 32px respiro). `pb-28` = 112px (≥ 56px StickyCTA + 32px respiro + 24px colchão para menu expandido).
   - Desktop: `md:pt-32` = 128px (≥ 56px header + 64px respiro + 8px colchão). `md:pb-36` = 144px (≥ 72px StickyCTA + 64px respiro + 8px colchão).
   - Exceção para `capa`: essa Section tem `showHeader: false` e `showFooter: false`, e seu componente interno já gerencia `min-h-screen flex items-center`. O ajuste do wrapper não a prejudica, pois o filho ignora o padding do wrapper ao centralizar-se. Validação: o render visual da capa continua centralizado.

2. **Adicionar slot de gap entre header interno e conteúdo** (endereça Property 1 – clause 2.5). Entre o `<header>` de Section (linhas 119–138 do arquivo atual) e o `<div>` de conteúdo, garantir que a classe do content container exponha `pt-*` suficiente. Como `showHeader=true` já adiciona um bloco com `py-3 sm:py-4`, o `pt-24 md:pt-32` do content container acima já cobre o gap mínimo (48px desktop / 24px mobile). Adicionalmente, atualizar o atributo `data-section-content` no `<div>` de conteúdo para permitir testes estruturais:
   ```tsx
   <div className="flex-1 w-full" data-section-content>
     <div className="max-w-7xl mx-auto px-4 pt-24 pb-28 sm:px-6 md:pt-32 md:pb-36">
       {children}
     </div>
   </div>
   ```

3. **Atualizar `scroll-mt`** (endereça navegação por âncora). Trocar `scroll-mt-16` (64px) por `scroll-mt-24 md:scroll-mt-32` para que ao saltar para `#secao-x` o header não cubra o topo da seção.

---

**File**: `src/index.css`

**Specific Changes**:

4. **Adicionar utilitária `prose-measure`** dentro do bloco `@layer utilities`. Não substituir a `.container-prose` existente; introduzir uma classe mais leve para uso inline em parágrafos:
   ```css
   .prose-measure {
     width: 100%;
     max-width: 70ch;
     min-width: 0;
   }
   ```
   Valor 70ch (não 65ch) para acomodar bem headings e parágrafos longos sem forçar quebra prematura.

5. **Opcional — não alterar** a utilitária `container-content` existente (já é `max-width: 1200px`). Manter.

---

**File**: `src/data/pages.ts`

**Specific Changes**:

6. **Criar configuração de páginas/capítulos**. Agrupar as 22 seções existentes em 6 páginas:
   - `visao-geral`: `capa`, `resumo-executivo`
   - `mercado`: `urgencia-mercado`, `mercado-receita`
   - `produto`: `o-que-e-bcm`, `produto-modulos`, `tese-tecnica`, `protocolos-gradual`, `oera-fundador`
   - `investimento`: `projecoes`, `proposta-tranches`, `pagamento-prova`, `retorno-esperado`, `retorno-pre-escala`
   - `execucao`: `por-que-gradual`, `time`, `governanca`, `plano-execucao`, `objecoes`, `quadro-decisao`
   - `termos`: `termos-resumidos`, `proximos-passos`

---

**File**: `src/components/navigation/ProposalNavbar.tsx`

**Specific Changes**:

7. **Adicionar navbar global de aplicação** com marca, botões de capítulos no desktop, seletor no mobile e ações anterior/próximo. A navbar substitui o topo anterior baseado em `ModeToggle` + `ProgressIndicator`.

---

**File**: `src/components/sections/SectionRenderer.tsx`

**Specific Changes**:

8. **Renderizar a página ativa em vez de todas as seções**. O renderer obtém `proposalPages[state.currentSection]`, resolve suas seções por `getPageSections(page)` e monta apenas esse grupo.

9. **Remover moldura interna de slide**. O wrapper `Section` passa a ser chamado com `showHeader=false` e `showFooter=false`, mantendo apenas o container, padding, tema e error boundaries.

10. **Garantir largura horizontal de leitura**. O cabeçalho da página usa grid (`lg:grid-cols-[minmax(0,1fr)_minmax(32rem,48rem)]`) em vez de flex shrink, e parágrafos principais usam `prose-measure`/`w-full`.

11. **Limitar cards narrativos a duas colunas**. `NarrativeSection` usa `grid-cols-1 lg:grid-cols-2`, evitando cards estreitos em desktop.

---

**File**: `src/App.tsx`

**Specific Changes**:

10. **Substituir controles de apresentação por navbar**. Remover `ModeToggle`, `ProgressIndicator` e `SectionNavigation` da experiência principal; inserir `ProposalNavbar`.

11. **Remover CSS legado global**. Remover `import './App.css'` para impedir overrides de classes Tailwind que causavam baixo contraste.

---

**File**: `src/data/pages.ts`

**Specific Changes**:

12. **Usar shell claro para todos os capítulos**. Definir `variant: 'light'` nos capítulos, deixando cores fortes para componentes autocontidos que controlam seu próprio contraste (ex.: hero da capa).

---

**Files**: 17 arquivos em `src/components/sections/`

**Specific Changes**:

6. **Substituir `PlaceholderSection` por conteúdo real** em cada um dos 17 arquivos. A lista completa e a abordagem narrativa proposta:

   | Arquivo | Slug | Estratégia de conteúdo | Componentes reutilizados |
   |---|---|---|---|
   | `ProductOverviewSection.tsx` | `o-que-e-bcm` | Hero com definição de produto + 4 cards de capacidades-chave | — |
   | `MarketUrgencySection.tsx` | `urgencia-mercado` | Copy de dor + `CountdownTimer` + 3 cards de escassez/janela | `CountdownTimer` |
   | `TechnicalThesisSection.tsx` | `tese-tecnica` | Copy do Kernel + diagrama textual em lista + 3 blocos de diferenciais | — |
   | `OERAFounderSection.tsx` | `oera-fundador` | Narrativa do OERA como protocolo fundador + 4 pilares | — |
   | `MarketRevenueSection.tsx` | `mercado-receita` | Tabela de planos (R$ 297 / R$ 997 / R$ 1.997) + TAM/SAM/SOM | — |
   | `ProjectionsSection.tsx` | `projecoes` | `ROISimulator` em destaque + disclaimer contextual | `ROISimulator` |
   | `WhyGradualSection.tsx` | `por-que-gradual` | Cinco razões em grid + quote do Rafael | — |
   | `TeamSection.tsx` | `time` | 3 cards de time + 1 bloco de governança do cofundador | — |
   | `ProposalTranchesSection.tsx` | `proposta-tranches` | `TrancheTimeline` + resumo das entregas T1/T2/T3 | `TrancheTimeline` |
   | `PaymentProofSection.tsx` | `pagamento-prova` | `ComparisonTable` "entrar agora vs esperar" + `SofthouseCalculator` | `ComparisonTable`, `SofthouseCalculator` |
   | `ExpectedReturnSection.tsx` | `retorno-esperado` | `ROISimulator` (cenários pré-configurados) + 4 blocos de retorno | `ROISimulator` |
   | `PreScaleReturnSection.tsx` | `retorno-pre-escala` | Narrativa do retorno antes da escala + `SofthouseCalculator` | `SofthouseCalculator` |
   | `GovernanceSection.tsx` | `governanca` | 5 pilares de governança (cap table, reporting, voto, saída, confidencialidade) | — |
   | `ExecutionPlanSection.tsx` | `plano-execucao` | Milestones do plano em timeline textual (D+0, D+30, D+60, D+90, D+180) | — |
   | `DecisionFrameworkSection.tsx` | `quadro-decisao` | Matriz 2×2 de critérios + checklist de perguntas-chave | — |
   | `SummaryTermsSection.tsx` | `termos-resumidos` | Tabela de termos (aporte, participação, tranches, governança, validade, jurisdição) | — |
   | `NextStepsSection.tsx` | `proximos-passos` | CTA grande + `IntentForm` inline + cards de contato | `IntentForm` |

   Cada arquivo segue o padrão já estabelecido em `ExecutiveSummarySection` e `ObjectionsSection`: `export default function`, blocos animados com Framer Motion (respeitando `useReducedMotion` via o wrapper `Section`), uso explícito da paleta institucional via tokens (`text-[#1B3A6B]`, `text-[#2D9B8A]`, `bg-[#F5A623]`), e parágrafos de texto corrido envoltos em `<div className="max-w-prose mx-auto">` ou `className="prose-measure"`.

7. **Aplicar `max-w-prose` em parágrafos das 5 seções já implementadas** (endereça Property 2 sem alterar conteúdo). Wrap minimalista dos blocos `<p>` e listas narrativas em `<div className="max-w-prose mx-auto">` nas seções `ExecutiveSummarySection`, `ProductModulesSection`, `GradualProtocolsSection` e `ObjectionsSection`. A seção `capa` não contém texto corrido longo — fica inalterada. Essa mudança é mecânica, não altera hierarquia semântica nem conteúdo.

---

**File**: `src/components/sections/PlaceholderSection.tsx`

**Specific Changes**:

8. **Manter o arquivo existente** — ele não é removido, mas fica sem uso em produção depois do fix. A razão para mantê-lo: evitar quebra do build caso algum teste ou ferramenta referencie o símbolo. Poderá ser removido em limpeza posterior (fora do escopo deste bugfix).

## Testing Strategy

### Validation Approach

A estratégia é bifásica: primeiro observar os contraexemplos no código atual (antes do fix) para confirmar a hipótese de causa raiz, depois validar que os fixes satisfazem as 6 propriedades de correctness e preservam as demais.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples que demonstram o bug ANTES do fix. Confirmar/refutar a análise de causa raiz em 4 frentes.

**Test Plan**: Criar um arquivo `src/components/sections/Section.layout.test.tsx` que renderiza cada Section dentro de uma árvore com `NavigationProvider` + header + StickyCTA simulados via stubs, e inspeciona (a) as classes aplicadas ao content slot, (b) a presença de PlaceholderSection em cada seção, (c) as dimensões computadas via jsdom (com mock de `getBoundingClientRect` para viewport ≥ 768px). Rodar contra o código UNFIXED e observar falhas.

**Test Cases**:

1. **Content slot padding inspection** — Para cada sectionConfig, renderizar e asserir `screen.getByTestId('section-content').className` contém `pt-24 pb-28 md:pt-32 md:pb-36`. Falha esperada em código unfixed (classes atuais são `py-6 sm:py-8`). Confirmam C_topSpacing / C_bottomSpacing.

2. **No PlaceholderSection in production** — Para cada sectionConfig, renderizar e asserir `container.querySelector('[data-testid="placeholder-section"]')` é `null` e `container.textContent` não contém "Em desenvolvimento". Falha esperada em 17 seções no código unfixed. Confirma C_placeholder.

3. **Prose width on desktop** — Em viewport ≥ 768px, para cada `<p>` dentro de cada Section, asserir `ancestors(p).some(a => a.classList.contains('prose-measure') || a.classList.contains('max-w-prose'))` é `true`. Falha esperada em todas as 22 seções no código unfixed. Confirma C_proseWidth.

4. **Edge case — capa unaffected** — Renderizar `CoverSection` e asserir que `min-h-screen flex items-center justify-center` continuam aplicados ao wrapper interno. Baseline: esse comportamento NÃO é bug e deve continuar.

**Expected Counterexamples**:

- Código atual falha (1) porque `Section.tsx` aplica `py-6 sm:py-8`.
- Código atual falha (2) em 17/22 renders.
- Código atual falha (3) em 100% dos parágrafos das 5 seções implementadas + 0% nos placeholders (que não têm parágrafos).
- Possíveis causas confirmadas: padding insuficiente no wrapper Section, uso de `PlaceholderSection` como stub, ausência de wrapping `max-w-prose` nos parágrafos narrativos.

### Fix Checking

**Goal**: Verificar que, para todos os inputs onde `isBugCondition` retorna `true` no código unfixed, a função corrigida produz o comportamento esperado.

**Pseudocode:**

```
FOR ALL sectionConfig IN sectionConfigs DO
  FOR ALL viewport IN {320, 640, 768, 1024, 1440, 2560} DO
    render := renderSectionFixed(sectionConfig, viewport)
    ASSERT NOT containsPlaceholderSection(render)
    ASSERT NOT render.textContent.includes("Em desenvolvimento")
    ASSERT contentSlotPaddingTop(render)    >= minTopPadding(viewport)
    ASSERT contentSlotPaddingBottom(render) >= minBottomPadding(viewport)
    IF viewport >= 768 THEN
      FOR ALL paragraph IN narrativeParagraphs(render) DO
        ASSERT computedWidth(paragraph) <= 75ch
      END FOR
    END IF
    ASSERT render.querySelector('h1, h2') != null
  END FOR
END FOR
```

### Preservation Checking

**Goal**: Verificar que, para todos os inputs onde a `isBugCondition` NÃO se aplica (ou seja, comportamento já correto), a função corrigida produz o mesmo resultado que a original.

**Pseudocode:**

```
FOR ALL sectionConfig IN { capa, resumo-executivo, produto-modulos, protocolos-gradual, objecoes } DO
  snapshotBefore := renderSection_original(sectionConfig).textKey()
  snapshotAfter  := renderSection_fixed(sectionConfig).textKey()
  ASSERT snapshotBefore == snapshotAfter  // text content unchanged

  interactivesBefore := renderSection_original(sectionConfig).interactiveComponents()
  interactivesAfter  := renderSection_fixed(sectionConfig).interactiveComponents()
  ASSERT interactivesBefore == interactivesAfter  // same components mounted
END FOR

FOR ALL existingPBTTestFile IN existingPBTTests DO
  ASSERT runTest(existingPBTTestFile, fixedCode) == PASS
END FOR

FOR ALL (mode, reducedMotion, variant, viewport) DO
  ASSERT behaviorUnchanged(mode, reducedMotion, variant, viewport, fixedCode)
END FOR
```

**Testing Approach**: Property-based testing é recomendado para a preservação da estrutura das 5 seções implementadas e para os 8 componentes interativos porque:

- Gera muitos casos de teste automaticamente varrendo o domínio de inputs (viewports, modos, variantes).
- Captura regressões de contrato que snapshots rígidos não capturariam quando a árvore é refatorada por motivos legítimos.
- Os 7 testes PBT existentes já cobrem as propriedades matemáticas dos componentes interativos; rodá-los inalterados é a verificação mais forte de preservação da lógica.

**Test Plan**: Observar o comportamento no código UNFIXED para as 5 seções implementadas + 8 componentes interativos (capturar textos-chave e lista de componentes montados), então escrever testes que verifiquem essas propriedades após o fix.

**Test Cases**:

1. **Implemented sections content preservation** — Para cada uma das 5 seções implementadas, capturar snapshot textual dos títulos e primeiros 2 parágrafos no código unfixed, depois asserir que o mesmo conteúdo continua presente após o fix (e, adicionalmente, está envolto em `max-w-prose` onde é parágrafo).

2. **Interactive components unchanged** — Rodar `npm run test:run` com os 7 arquivos PBT existentes (`*.property.test.*`) e os testes unitários de cada componente interativo antes e depois do fix. Ambos os runs devem terminar com o mesmo número de testes passantes.

3. **Mode switching preservation** — Executar `src/contexts/NavigationProvider.test.tsx`, `src/contexts/NavigationProvider.property.test.tsx` e `src/contexts/KeyboardAccessibility.test.tsx` após o fix. Todos devem passar sem alteração.

4. **Reduced motion preservation** — Executar `src/hooks/useReducedMotion.test.ts` e `src/components/sections/Section.animation.test.tsx` após o fix. Ambos devem passar.

5. **Responsive preservation** — Executar `src/components/interactive/ROISimulator.responsive.test.tsx` após o fix. Deve passar (a mudança no wrapper Section não afeta o ROISimulator interno).

6. **Palette preservation** — Extender `src/components/sections/Section.test.tsx` para asserir que, para cada `variant ∈ {light, dark, teal}`, o background e a cor do texto são os valores definidos em `sectionVariants` de `theme.ts`. Deve passar antes e depois do fix.

### Unit Tests

- Teste de classes aplicadas ao content slot do wrapper `Section` para cada viewport (≥ `pt-24 pb-28 md:pt-32 md:pb-36`).
- Teste de ausência de `PlaceholderSection` para cada uma das 22 seções configuradas (varredura completa de `sectionConfigs`).
- Teste de presença de componente interativo em cada seção que deve contê-lo (ex.: `retorno-esperado` contém `ROISimulator`, `proposta-tranches` contém `TrancheTimeline`).
- Teste de estrutura de texto pt-BR em cada seção: cada uma expõe ≥ 1 heading h2 em português e ≥ 1 parágrafo narrativo.
- Teste de exceção para `capa`: continua com layout full-screen centralizado sem header/footer de Section.

### Property-Based Tests

- **PBT do respiro vertical** (Property 1): `fc.constantFrom(...sectionConfigs)` × `fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1440, 1920, 2560)` × `fc.constantFrom('landing', 'presentation')` — render e assertar que `paddingTop` e `paddingBottom` computados satisfazem os thresholds. Mínimo de 100 iterações.

- **PBT da largura de leitura** (Property 2): `fc.constantFrom(...sectionConfigs.filter(has text))` × `fc.integer({ min: 768, max: 2560 })` — render, coletar todos os `<p>` narrativos e assertar `getBoundingClientRect().width <= 75 * 1rem` (aproximação ch). Mínimo de 100 iterações.

- **PBT de ausência de Placeholder** (Property 3): varredura universal sobre `sectionConfigs` (22 elementos) × `fc.constantFrom('landing', 'presentation')` — assertar que nenhum render contém "Em desenvolvimento" ou o componente `PlaceholderSection`. Mínimo de 100 iterações (na prática testa cada seção múltiplas vezes).

- **PBT de preservação das seções implementadas** (Property 4): `fc.constantFrom('capa', 'resumo-executivo', 'produto-modulos', 'protocolos-gradual', 'objecoes')` × `fc.constantFrom(variants)` — render fixed + capturar conjunto de textos-chave e confrontar com baseline textual fixado no teste. Mínimo de 100 iterações.

- **Os 7 PBTs existentes** (Property 5) devem rodar inalterados: `ROISimulator.property.test.ts`, `SofthouseCalculator.property.test.ts`, `TrancheTimeline.property.test.ts`, `CountdownTimer.property.test.ts`, `ModuleCards.property.test.ts`, `formatting.property.test.ts`, `NavigationProvider.property.test.tsx`.

- **PBT de modo/movimento/paleta** (Property 6): `fc.constantFrom('landing', 'presentation')` × `fc.boolean()` (reducedMotion) × `fc.constantFrom('light', 'dark', 'teal')` × `fc.integer({ min: 320, max: 2560 })` — assertar que em presentation mode apenas uma seção é visível, que reducedMotion desativa transições > 100ms, que a variante mapeia corretamente ao background/text, e que viewports ≤ 640px produzem layout de coluna única. Mínimo de 100 iterações.

### Integration Tests

- **Fluxo completo de navegação pós-fix** — Abrir app em Landing_Mode, rolar da primeira à última seção, asserir que em cada scroll-stop nenhum conteúdo está sobreposto pelo header ou pelo StickyCTA (medição de bounding boxes). Estender `src/App.integration.test.tsx` existente.

- **Switch Landing ↔ Presentation preservando posição** — Navegar até `#urgencia-mercado` em Landing, alternar para Presentation, asserir que a seção 2 está ativa e que seu conteúdo real (não placeholder) é visível. Tenta reproduzir um cenário de usuário completo.

- **Deep link para cada slug** — Para cada `slug` em `sectionConfigs`, abrir `#<slug>` diretamente, asserir que a Section correspondente está visível, que seu título pt-BR está presente, e que nenhum `PlaceholderSection` é renderizado na árvore.

- **Keyboard navigation end-to-end pós-fix** — Em Presentation_Mode, pressionar `End`, asserir que `proximos-passos` está visível e que o `IntentForm` inline é alcançável por Tab. Validar acessibilidade.

- **Accessibility regression** — Rodar `src/App.accessibility.test.tsx` pós-fix. Deve continuar passando (axe sem novas violações introduzidas por `pt-24 pb-28` etc.).
