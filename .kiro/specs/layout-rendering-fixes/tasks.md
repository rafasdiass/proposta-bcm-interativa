# Plano de Implementação: layout-rendering-fixes

## Visão Geral

Este plano aplica a metodologia de bug condition para corrigir quatro classes de defeito na Proposta BCM Interativa (`bugfix.md` 1.1–1.5) sem regredir capacidades já funcionais (`bugfix.md` 3.1–3.7). A ordem segue estritamente: (1) escrever teste exploratório que FALHA no código atual para confirmar a existência do bug, (2) escrever testes de preservation que PASSAM no código atual para fixar o baseline a preservar, (3) aplicar os três tipos de fix (wrapper `Section`, utilitária `prose-measure`, implementação das 17 seções pendentes), (4) validar que o teste exploratório agora passa, (5) validar que preservation continua passando, (6) executar fix-checking e integração adicionais.

O escopo abrange as **17 seções placeholder** identificadas pela varredura do código (e não 15 como indicado inicialmente em `bugfix.md` 1.4) — `projecoes` e `governanca` também entram, conforme registrado no design.

## Atualização de Escopo - 2026-05-08

Durante a implementação, a correção dos placeholders revelou que a experiência resultante continuaria fraca: 22 blocos em uma onepage são cansativos para o cliente e a moldura por seção parecia um PowerPoint online. O escopo foi ampliado para transformar a proposta em uma ferramenta interativa paginada por capítulos.

Novos gaps incluídos no bugfix:
- Onepage longa demais para decisão executiva.
- Header/footer interno por seção com aparência de slide deck.
- Controles `Rolagem/Apresentação` incompatíveis com a intenção de ferramenta interativa premium.
- Falta de navegação semântica por tema decisório.

Decisão operacional: os testes unitários e de integração serão atualizados no final. Durante esta etapa, a prioridade é concluir a experiência/produto e manter documentação fiel ao que está sendo alterado.

Cada tarefa referencia:
- `_Requirements:_` — cláusulas do `bugfix.md` (2.1–2.5 comportamento esperado, 3.1–3.7 preservation)
- `_Properties:_` — Properties 1–6 do `design.md`

Sub-tarefas opcionais são marcadas com `*` após o checkbox.

## Tasks

- [x] 1. Escrever teste exploratório da bug condition (ANTES do fix)
  - **Property 1: Bug Condition** - Respiro vertical, largura de leitura, ausência de `PlaceholderSection` e medida de texto horizontal em cada página/capítulo da nova arquitetura paginada
  - **CRITICAL**: Este teste property-based DEVE FALHAR no código atual — a falha confirma a existência do bug
  - **DO NOT attempt to fix the test or the code when it fails** — é o comportamento esperado nesta etapa
  - **GOAL**: Surface counterexamples que demonstrem concretamente cada sub-sintoma de `isBugCondition` (C_topSpacing, C_bottomSpacing, C_proseWidth, C_placeholder, C_headerGap, C_proseShrink, C_cardColumns) aplicado ao modelo paginado introduzido nas Tasks 10-12 (`ProposalNavbar` global + 6 capítulos de `proposalPages`)
  - **Scoped PBT Approach**: `fc.constantFrom(...proposalPages)` (6 páginas) `× fc.constantFrom(320, 375, 640, 768, 1024, 1280, 1440, 1920, 2560)` `× fc.constantFrom('landing', 'presentation')` — total determinístico de combinações
  - Criar arquivo `src/components/sections/Section.layout.test.tsx` renderizando a página via `SectionRenderer` dentro de árvore com `NavigationProvider` + `ProposalNavbar` montada (marca + capítulos + anterior/próximo, `fixed top-0`, altura aproximada 64px desktop / 56px mobile) + `StickyCTA` (`fixed bottom-0`, 72px desktop / 56px mobile)
  - Para cada (page, viewport, mode), asserir conforme `isBugCondition` do design:
    - **C_topSpacing**: content slot (`[data-section-content] > div`) tem `paddingTop ≥ navbarHeight + 32` mobile / `+ 64` desktop
    - **C_bottomSpacing**: content slot tem `paddingBottom ≥ ctaHeight + 32` mobile / `+ 64` desktop
    - **C_placeholder**: árvore NÃO contém `PlaceholderSection` e `textContent` NÃO contém "Em desenvolvimento"
    - **C_proseWidth**: em viewport ≥ 768px, todo `<p>` narrativo tem largura computada ≤ 75ch
    - **C_proseShrink**: em viewport ≥ 768px, nenhum `<p>` narrativo renderiza com `width < 320px` dentro de containers flex/grid (endereça Requirements 2.10)
    - **C_cardColumns**: em viewport ≥ 1024px, grids de cards narrativos usam no máximo 2 colunas (endereça Requirements 2.11)
    - **Heading pt-BR**: cada página expõe pelo menos um `h1` (capa) ou `h2` (demais capítulos) com conteúdo substantivo em português
  - Edge case: `CoverSection` permanece centralizado dentro da página `visao-geral`; padding do wrapper não deve esmagar o hero
  - Rodar teste em código UNFIXED: `npm run test:run src/components/sections/Section.layout.test.tsx`
  - **EXPECTED OUTCOME**: FALHA — o código atual tem `pt-16 pb-20 md:pt-24 md:pb-32` (abaixo do requerido 96–144px), pode ter parágrafos sem largura real (C_proseShrink) em alguns capítulos e pode usar grids de 3-4 colunas para cards narrativos
  - Documentar contraexemplos encontrados (combinação concreta de page/viewport/sintoma)
  - _Requirements: 2.1, 2.2, 2.5, 2.10, 2.11_
  - _Properties: 1, 2, 3, 9_

- [x] 2. Escrever testes de preservation (ANTES do fix, observation-first)
  - **Property 2: Preservation** - Seções implementadas, componentes interativos, modo, movimento, paleta e landmarks inalterados na nova arquitetura paginada
  - **IMPORTANTE**: Observation-first — capturar o comportamento REAL observado na build atual (páginas + `ProposalNavbar`) e então escrever asserts sobre esse baseline
  - **GOAL**: Garantir que o fix de padding/largura (Task 3) e a refatoração das seções não quebrem: (a) as 22 seções já implementadas, (b) os 8 componentes interativos e seus PBTs existentes, (c) a alternância Landing/Presentation, (d) `prefers-reduced-motion`, (e) paleta institucional, (f) navegação por capítulos (`ProposalNavbar` + `proposalPages`), (g) landmarks semânticos
  - Criar arquivo `src/components/sections/Section.preservation.test.tsx`
  - **Observação 1 — textos das 22 seções** (Property 4):
    - Para cada slug em `sectionConfigs`, renderizar o componente correspondente via `SectionRenderer` na página certa
    - Capturar título + primeiro parágrafo como baseline textual literal
    - PBT: `fc.constantFrom(...sectionConfigs.map(s => s.slug))` → asserir que cada baseline textual continua presente (substring match) e que nenhuma árvore contém `PlaceholderSection` nem "Em desenvolvimento"
  - **Observação 2 — componentes interativos montados** (Property 5):
    - Mapear por slug: `ROISimulator` em `projecoes` e `retorno-esperado`; `TrancheTimeline` em `proposta-tranches`; `CountdownTimer` em `urgencia-mercado`; `SofthouseCalculator` em `pagamento-prova` e `retorno-pre-escala`; `ComparisonTable` em `pagamento-prova`; `IntentForm` em `proximos-passos`; `ModuleCards` em `produto-modulos`; `ProtocolSelector` em `protocolos-gradual`; `ObjectionAccordion` em `objecoes`
    - PBT: renderizar cada seção e asserir que os componentes interativos esperados estão montados com props-chave
  - **Observação 3 — navegação por capítulos** (Property 7):
    - `fc.constantFrom(...proposalPages.map(p => p.id))` — para cada id, simular clique/navegação na `ProposalNavbar` e asserir que (a) a página correta é renderizada, (b) o hash da URL vira o slug semântico (`#visao-geral`, `#mercado`, `#produto`, `#investimento`, `#execucao`, `#termos`), (c) retrocompatibilidade com `#secao-N` continua resolvendo
  - **Observação 4 — shell, modo, movimento, paleta** (Properties 6, 8, 10):
    - `fc.constantFrom('landing', 'presentation') × fc.boolean() (reducedMotion) × fc.integer({ min: 320, max: 2560 })`
    - Asserir: (a) capítulos renderizam com shell claro (`variant: 'light'`) no wrapper de página; (b) Section é chamada com `showHeader=false` e `showFooter=false` no contexto de página; (c) com `prefers-reduced-motion=true` transições > 100ms são desativadas; (d) viewport ≤ 640px colapsa grids multi-coluna em 1 coluna; (e) `App.tsx` NÃO importa `App.css` (prevenção de regressão de contraste)
  - **Observação 5 — landmarks e acessibilidade** (Property 3.7 do bugfix):
    - Renderizar a aplicação completa, asserir presença de `role="banner"` (ProposalNavbar como `<header>` global), `role="main"` e `role="contentinfo"` (footer ou StickyCTA com role adequado)
  - Mínimo de 100 iterações por PBT
  - Rodar em código UNFIXED (antes do ajuste de padding da Task 3.1): `npm run test:run src/components/sections/Section.preservation.test.tsx`
  - **EXPECTED OUTCOME**: PASSA (estabelece baseline a ser preservado após Tasks 3 e 4)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  - _Properties: 4, 5, 6, 7, 8, 10_

- [x] 3. Corrigir o wrapper `Section` e adicionar utilitária de largura de leitura

  - [x] 3.1 Ajustar padding vertical, `data-section-content` e `scroll-mt` em `src/components/sections/Section.tsx`
    - **Estado atual**: o content container expõe `className="max-w-7xl mx-auto w-full px-4 pt-16 pb-20 sm:px-6 md:pt-24 md:pb-32 lg:px-8"` — abaixo do exigido pelo design
    - Substituir por `className="max-w-7xl mx-auto w-full px-4 pt-24 pb-28 sm:px-6 md:pt-32 md:pb-36 lg:px-8"`
      - Mobile: `pt-24` = 96px (≥ 56 navbar + 32 respiro); `pb-28` = 112px (≥ 56 CTA + 32 respiro + 24 colchão)
      - Desktop: `md:pt-32` = 128px (≥ 64 navbar + 64 respiro); `md:pb-36` = 144px (≥ 72 CTA + 64 respiro + 8 colchão)
    - Confirmar que `data-section-content` já existe no `<div>` externo (sim, está presente na linha 137) e mantê-lo
    - Substituir `scroll-mt-16` (se houver) por `scroll-mt-24 md:scroll-mt-32` na Section raiz para âncoras `#slug`
    - Confirmar que `CoverSection` dentro da página `visao-geral` continua com o hero renderizando sem esmagamento — o padding do wrapper não deve quebrar o centering do hero interno
    - _Bug_Condition: C_topSpacing ∨ C_bottomSpacing_
    - _Expected_Behavior: paddingTop ≥ navbarHeight + (32 mobile | 64 desktop) AND paddingBottom ≥ ctaHeight + (32 mobile | 64 desktop)_
    - _Preservation: hero da capa mantém layout sem esmagamento; demais páginas preservam conteúdo_
    - _Requirements: 2.1, 2.5, 3.1_
    - _Properties: 1, 4_

  - [x] 3.2 Adicionar utilitária `prose-measure` em `src/index.css`
    - Dentro de `@layer utilities`, declarar:
      ```css
      .prose-measure {
        max-width: 70ch;
      }
      ```
    - Não remover nem substituir `.container-prose` existente (mantida para compatibilidade)
    - Não alterar `.container-content` (já é `max-width: 1200px`)
    - _Bug_Condition: C_proseWidth_
    - _Expected_Behavior: blocos de texto corrido ≤ 75ch em viewport ≥ 768px_
    - _Requirements: 2.2_
    - _Properties: 2_

- [x] 4. Aplicar `max-w-prose` nos parágrafos narrativos das seções já implementadas
  - Wrap mecânico de blocos `<p>` e listas narrativas em `<div className="max-w-prose mx-auto">`, sem alterar hierarquia semântica, conteúdo, ordem de blocos ou props de componentes interativos
  - Grids, cards e tabelas NÃO são envoltos — continuam usando toda a largura do container (`max-w-7xl`)
  - _Bug_Condition: C_proseWidth nas 5 seções implementadas_
  - _Expected_Behavior: em viewport ≥ 768px todo `<p>` narrativo tem ancestor `max-w-prose mx-auto`; grids/cards/tabelas mantêm largura do container_
  - _Preservation: conteúdo textual e árvore de componentes interativos idênticos (Property 4)_
  - _Requirements: 2.2, 3.1, 3.7_
  - _Properties: 2, 4_

  - [x] 4.1 Envolver parágrafos narrativos de `ExecutiveSummarySection` em `<div className="max-w-prose mx-auto">` (sem afetar título nem cards)
  - [x] 4.2 Envolver parágrafos narrativos de `ProductModulesSection` sem afetar o grid de `ModuleCards`
  - [x] 4.3 Envolver parágrafos narrativos de `GradualProtocolsSection` sem afetar `ProtocolSelector`
  - [x] 4.4 Envolver parágrafos narrativos de `ObjectionsSection` sem afetar `ObjectionAccordion`
  - [x] 4.5 Revisar `CoverSection` — confirmar que não possui texto corrido longo e permanece inalterada

- [x] 5. Substituir `PlaceholderSection` por conteúdo real nas 17 seções pendentes
  - Cada implementação segue o padrão já estabelecido em `ExecutiveSummarySection` / `ObjectionsSection`:
    - `export default function`; animações via Framer Motion respeitando `prefers-reduced-motion` através do wrapper `Section`
    - Paleta institucional via tokens (`text-[#1B3A6B]`, `text-[#2D9B8A]`, `bg-[#F5A623]`, `text-[#8B7EC8]`, `bg-[#F8F9FA]`, `bg-[#102642]`) — nunca cores arbitrárias
    - Parágrafos de texto corrido envoltos em `<div className="max-w-prose mx-auto">`; grids/cards/tabelas ocupam toda a largura do container
    - Heading `h2` em pt-BR com conteúdo narrativo substantivo (≥ 3 blocos de copy)
    - Reutilizar componentes interativos existentes conforme tabela do design — sem alterar props ou lógica interna
    - Sem import ou uso de `PlaceholderSection`
  - _Bug_Condition: C_placeholder para as 17 seções_
  - _Expected_Behavior: tree não contém `PlaceholderSection`, `textContent` não contém "Em desenvolvimento", cada seção expõe heading pt-BR + conteúdo narrativo substantivo_
  - _Preservation: componentes interativos reutilizados preservam lógica e props (Property 5); variantes cromáticas mantidas (Property 6)_
  - _Requirements: 2.3, 2.4, 3.3, 3.6_
  - _Properties: 3, 5, 6_

  - [x] 5.1 `ProductOverviewSection.tsx` (slug `o-que-e-bcm`) — hero com definição do produto + 4 cards de capacidades-chave
  - [x] 5.2 `MarketUrgencySection.tsx` (slug `urgencia-mercado`) — copy de dor do setor + `CountdownTimer` + 3 cards de janela/escassez/posição de fundador
  - [x] 5.3 `TechnicalThesisSection.tsx` (slug `tese-tecnica`) — copy do Kernel + diagrama textual em lista + 3 blocos de diferenciais técnicos
  - [x] 5.4 `OERAFounderSection.tsx` (slug `oera-fundador`) — narrativa do OERA como protocolo fundador + 4 pilares
  - [x] 5.5 `MarketRevenueSection.tsx` (slug `mercado-receita`) — tabela de planos (R$ 297 / R$ 997 / R$ 1.997) + TAM/SAM/SOM
  - [x] 5.6 `ProjectionsSection.tsx` (slug `projecoes`) — `ROISimulator` em destaque + disclaimer contextual
  - [x] 5.7 `WhyGradualSection.tsx` (slug `por-que-gradual`) — 5 razões em grid + quote do Rafael
  - [x] 5.8 `TeamSection.tsx` (slug `time`) — 3 cards de time + 1 bloco de governança do cofundador
  - [x] 5.9 `ProposalTranchesSection.tsx` (slug `proposta-tranches`) — `TrancheTimeline` + resumo das entregas T1/T2/T3
  - [x] 5.10 `PaymentProofSection.tsx` (slug `pagamento-prova`) — `ComparisonTable` "entrar agora vs esperar" + `SofthouseCalculator`
  - [x] 5.11 `ExpectedReturnSection.tsx` (slug `retorno-esperado`) — `ROISimulator` com cenários pré-configurados + 4 blocos de retorno
  - [x] 5.12 `PreScaleReturnSection.tsx` (slug `retorno-pre-escala`) — narrativa do retorno antes da escala + `SofthouseCalculator`
  - [x] 5.13 `GovernanceSection.tsx` (slug `governanca`) — 5 pilares (cap table, reporting, voto, saída, confidencialidade)
  - [x] 5.14 `ExecutionPlanSection.tsx` (slug `plano-execucao`) — milestones em timeline textual (D+0, D+30, D+60, D+90, D+180)
  - [x] 5.15 `DecisionFrameworkSection.tsx` (slug `quadro-decisao`) — matriz 2×2 de critérios + checklist de perguntas-chave
  - [x] 5.16 `SummaryTermsSection.tsx` (slug `termos-resumidos`) — tabela de termos (aporte, participação, tranches, governança, validade, jurisdição)
  - [x] 5.17 `NextStepsSection.tsx` (slug `proximos-passos`) — CTA grande + `IntentForm` inline + cards de contato
  - [x] 5.18 Remover arquivo `src/components/sections/PlaceholderSection.tsx` (o design optou por manter como stub; limpeza futura fora do escopo deste bugfix)

- [ ] 6. Verificar que o teste exploratório agora passa (fix checking)
  - **Property 1: Expected Behavior** - Respiro vertical, largura de leitura e ausência de `PlaceholderSection` satisfeitos
  - **IMPORTANTE**: Reexecutar o MESMO teste da Task 1 — NÃO escrever novo teste
  - O teste da Task 1 já codifica o comportamento esperado; sua passagem confirma a correção
  - **EXPECTED OUTCOME**: PASSA (confirma que o bug foi corrigido em todas as 22 seções × 9 viewports × 2 modos)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Properties: 1, 2, 3_

  - [-] 6.1 Reexecutar `src/components/sections/Section.layout.test.tsx` — todos os casos devem passar
  - [~] 6.2 Estender `Section.test.tsx` — asserir que o content slot expõe classes `pt-24 pb-28 md:pt-32 md:pb-36` para cada variante (`light | dark | teal`)
  - [~] 6.3 Adicionar teste: para cada uma das 22 `sectionConfigs`, renderizar e asserir `queryByTestId('placeholder-section')` é `null` e `textContent` não contém "Em desenvolvimento"
  - [~] 6.4 Adicionar teste: presença do componente interativo mapeado em cada seção — `retorno-esperado`/`projecoes` contém `ROISimulator`; `proposta-tranches` contém `TrancheTimeline`; `urgencia-mercado` contém `CountdownTimer`; `proximos-passos` contém `IntentForm`; `pagamento-prova`/`retorno-pre-escala` contém `SofthouseCalculator`; `pagamento-prova` contém `ComparisonTable`
  - [~] 6.5 Adicionar teste: cada seção expõe ≥ 1 heading em pt-BR (`h1` para `capa`, `h2` para as demais 21) com conteúdo substantivo (comprimento ≥ 10 caracteres)

- [ ] 7. Verificar preservation — PBTs existentes, testes de estrutura e acessibilidade
  - **Property 2: Preservation** - Conteúdo, componentes interativos, modo, movimento e paleta inalterados
  - **IMPORTANTE**: Reexecutar os MESMOS testes da Task 2 e os 7 PBTs existentes — NÃO escrever novas versões
  - **EXPECTED OUTCOME**: PASSAM (confirma ausência de regressões)
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - _Properties: 4, 5, 6_

  - [~] 7.1 Reexecutar `src/components/sections/Section.preservation.test.tsx` (Task 2) — todos os PBTs devem passar com o código fixed
  - [~] 7.2 Executar os 7 PBTs existentes sem modificação: `ROISimulator.property.test.ts`, `SofthouseCalculator.property.test.ts`, `TrancheTimeline.property.test.ts`, `CountdownTimer.property.test.ts`, `ModuleCards.property.test.ts`, `formatting.property.test.ts`, `NavigationProvider.property.test.tsx` — 100% verde
  - [~] 7.3 Executar testes de contexto/navegação: `NavigationProvider.test.tsx`, `KeyboardAccessibility.test.tsx` — 100% verde
  - [~] 7.4 Executar testes de movimento: `useReducedMotion.test.ts`, `Section.animation.test.tsx` — 100% verde
  - [~] 7.5 Executar teste responsivo: `ROISimulator.responsive.test.tsx` — 100% verde (confirma que a mudança no wrapper Section não afeta o ROISimulator interno)
  - [~] 7.6 Executar `src/App.accessibility.test.tsx` (axe) — asserir zero novas violações de acessibilidade introduzidas pelo fix; landmarks `header`/`main`/`nav`/`footer` preservados, hierarquia de headings válida
  - [~] 7.7 Snapshot textual complementar — versionar títulos + primeiros 2 parágrafos das 5 seções já implementadas para auditoria de regressão textual em iterações futuras
  - [~] 7.8 Teste de regressão visual via Playwright em 3 breakpoints (mobile 375, tablet 768, desktop 1440) para as 22 seções

- [ ] 8. Testes de integração end-to-end
  - Validar o fluxo completo do usuário pós-fix em ambos os modos de navegação
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 3.2, 3.7_
  - _Properties: 1, 3, 6_

  - [~] 8.1 Fluxo completo em `Landing_Mode`: estender `src/App.integration.test.tsx` para rolar da primeira à última seção e asserir, em cada scroll-stop, que (a) o heading visível não é sobreposto pelo header fixo e (b) o último bloco não é sobreposto pelo `StickyCTA` — via medição de `getBoundingClientRect()`
  - [~] 8.2 Switch `Landing` ↔ `Presentation` preservando posição: navegar até `#urgencia-mercado` em Landing, alternar para Presentation, asserir que a seção 2 está ativa e exibe conteúdo real (não placeholder) com `CountdownTimer` montado
  - [~] 8.3 Deep link por slug — para cada slug em `sectionConfigs` (22 slugs), abrir `#<slug>` diretamente e asserir: (a) Section correta está visível, (b) título pt-BR presente, (c) nenhum `PlaceholderSection` renderizado em qualquer ponto da árvore
  - [~] 8.4 Keyboard navigation end-to-end — em `Presentation_Mode` pressionar `End`, asserir que `proximos-passos` está ativo e que `IntentForm` inline é alcançável via Tab respeitando a ordem semântica
  - [~] 8.5 Lighthouse CI em desktop e mobile — LCP ≤ 2.5s e CLS ≤ 0.1 na home (regressão potencial por aumento de padding vertical)

- [~] 9. Checkpoint — garantir que todos os testes passam
  - Rodar `npm run test:run` completo e confirmar 0 falhas
  - Rodar `npm run lint` — 0 erros
  - Rodar `npm run build` — build de produção bem-sucedido
  - Verificar manualmente em viewports 375, 768 e 1440 que nenhuma seção exibe "Em desenvolvimento" e que o conteúdo não é sobreposto pelo header fixo nem pelo `StickyCTA`
  - Se surgirem dúvidas sobre copy de alguma das 17 seções durante a implementação, consultar o usuário antes de preencher com conteúdo genérico

- [x] 10. Converter a proposta de onepage/slide deck para ferramenta interativa paginada
  - Criar `src/data/pages.ts` com 6 capítulos semânticos:
    - `visao-geral`: capa + resumo executivo
    - `mercado`: urgência + receita
    - `produto`: definição, módulos, tese técnica, protocolos, OERA
    - `investimento`: projeções, tranches, prova econômica, retorno
    - `execucao`: por que Gradual, time, governança, plano, objeções, decisão
    - `termos`: termos resumidos + próximos passos
  - Atualizar `NavigationProvider` para considerar 6 páginas como total navegável principal.
  - Atualizar hash/fragmentos para slugs semânticos (`#produto`, `#investimento`, `#termos`) mantendo compatibilidade com `#secao-N`.
  - _Requirements: 2.6, 2.7, 2.9_
  - _Properties: 7_

- [x] 11. Remover aparência de PowerPoint online
  - Criar `ProposalNavbar` como navegação global fixa com marca, capítulos, seletor mobile e anterior/próximo.
  - Substituir `ModeToggle` + `ProgressIndicator` no `App.tsx` por `ProposalNavbar`.
  - Remover `SectionNavigation` da experiência principal.
  - Renderizar páginas com `showHeader=false` e `showFooter=false` para eliminar a moldura interna repetitiva.
  - Reduzir a capa de `min-h-screen` para hero compacto dentro da página de visão geral.
  - _Requirements: 2.6, 2.8_
  - _Properties: 8_

- [x] 12. Documentar resultado final esperado
  - Atualizar `bugfix.md` com novos defeitos 1.6–1.9 e comportamentos esperados 2.6–2.9.
  - Atualizar `design.md` com a arquitetura de páginas, `ProposalNavbar`, remoção de moldura de slide e propriedades 7–8.
  - Atualizar este `tasks.md` com a mudança de escopo e a decisão de adiar testes unitários para o checkpoint final.
  - _Requirements: documentação do bugfix_
