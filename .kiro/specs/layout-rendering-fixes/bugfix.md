# Bugfix Requirements Document

## Introduction

A proposta BCM Interativa apresenta um conjunto de falhas de layout e renderização que degradam a experiência do decisor (Grupo Gradual) e comprometem a narrativa persuasiva. Em uso real, o usuário relatou:

1. O conteúdo fica "colado" nos limites verticais (sem respiro entre a barra de navegação fixa no topo, o StickyCTA fixo no rodapé e o conteúdo principal).
2. Os textos não aproveitam o espaço horizontal disponível — parágrafos e listas renderizam em colunas estreitas demais, quase verticais, com linhas muito curtas.
3. A Seção 2 ("Urgência de Mercado") aparece "basicamente em branco", exibindo apenas um placeholder "Em desenvolvimento" em vez do conteúdo persuasivo esperado.
4. Esse padrão de conteúdo ausente se repete em múltiplas outras seções (varredura): 15 das 22 seções estão atualmente renderizando `PlaceholderSection` em vez da implementação real.

Estas falhas ocorrem apesar dos requisitos 1.2 (renderização das 22 seções), 14.1/14.2 (responsividade e uso do espaço) e 16.2 (animações de revelação) já estarem declarados no spec principal `proposta-bcm-interativa`. O escopo deste bugfix é restaurar a renderização correta, o respiro vertical e o uso do espaço horizontal, sem alterar comportamento já funcional (seções já implementadas continuam funcionando; calculadoras, timeline, countdown, acordeão, seletor de protocolos, formulário e CTA permanecem inalterados em sua lógica).

## Bug Analysis

### Current Behavior (Defect)

O layout da proposta hoje apresenta quatro classes de defeito observáveis pelo leitor.

1.1 WHEN a Proposta_Interativa é aberta em qualquer modo THEN o conteúdo principal fica sem margem superior e inferior suficientes, resultando em sobreposição visual com a barra fixa de navegação no topo e com a barra StickyCTA no rodapé.

1.2 WHEN uma Section é renderizada em viewports médios e grandes (≥ 768px) THEN os blocos textuais (parágrafos, listas, cards de destaque) renderizam em larguras reduzidas que produzem linhas muito curtas e aparência "quase vertical", desperdiçando o espaço horizontal do container.

1.3 WHEN o usuário navega até a Seção 2 ("Urgência de Mercado", slug `urgencia-mercado`) THEN a seção exibe apenas um placeholder "Em desenvolvimento" com o título "MarketUrgency", sem o conteúdo persuasivo de urgência de mercado previsto na proposta.

1.4 WHEN o usuário navega até qualquer uma das seções ainda não implementadas (15 de 22: `o-que-e-bcm`, `urgencia-mercado`, `tese-tecnica`, `oera-fundador`, `mercado-receita`, `por-que-gradual`, `time`, `proposta-tranches`, `pagamento-prova`, `retorno-esperado`, `retorno-pre-escala`, `plano-execucao`, `quadro-decisao`, `termos-resumidos`, `proximos-passos`) THEN a seção exibe o mesmo placeholder genérico, resultando em páginas "basicamente em branco" ao longo da proposta.

1.5 WHEN o leitor rola entre seções em Landing_Mode THEN não há separação vertical consistente entre seções nem respiro entre o cabeçalho interno da Section e o primeiro bloco de conteúdo, fazendo os títulos colarem no topo e os conteúdos colarem nos rodapés.

### Additional Gaps Found During Implementation

Durante a implementação do bugfix, a varredura visual e estrutural revelou um problema de produto maior do que os sintomas originais:

1.6 WHEN todas as 22 seções são renderizadas em sequência dentro de uma única experiência contínua THEN a proposta fica longa demais para uma tomada de decisão executiva, exigindo que o cliente leia uma página extensa com esforço alto de navegação.

1.7 WHEN cada seção é encapsulada com header/footer próprios (`BCM · LaVita Code`, título de seção, "Proposta de Parceria Estratégica · Confidencial") THEN a interface parece um PowerPoint online, não uma ferramenta interativa premium de apresentação comercial.

1.8 WHEN o controle principal do topo oferece alternância entre "Rolagem" e "Apresentação" THEN o modelo mental reforça a sensação de slide deck, enquanto o objetivo real é uma navegação de produto/aplicação por capítulos.

1.9 WHEN o usuário quer revisar uma parte específica da proposta (produto, investimento, governança, próximos passos) THEN a experiência atual obriga varrer a sequência inteira ou usar controles de seção pouco orientados à decisão.

1.10 WHEN blocos de texto com `max-w-prose` são colocados dentro de containers `flex` ou grids multi-coluna sem largura explícita (`width: 100%`) THEN o navegador pode encolher o bloco até a largura mínima do conteúdo, fazendo frases renderizarem como uma coluna estreita/quase vertical.

1.11 WHEN cards narrativos são distribuídos em quatro colunas no desktop THEN cada card fica estreito demais para copy executiva, produzindo leitura picotada e desperdiçando a largura horizontal disponível da página.

1.12 WHEN uma página/capítulo usa fundo `dark` ou `teal` e renderiza seções internas escritas para fundo claro THEN títulos e parágrafos podem aparecer com baixo contraste ou com texto da mesma família cromática do fundo.

1.13 WHEN `App.css` legado é importado junto com Tailwind THEN classes utilitárias globais como `.text-gray-600`, `.text-sm`, `.text-xs` podem ser sobrescritas fora do sistema Tailwind, causando contraste incorreto e comportamento visual inconsistente.

### Expected Behavior (Correct)

A proposta deve preservar a narrativa e exibir cada seção de forma respirável e legível.

2.1 WHEN a Proposta_Interativa é aberta em qualquer modo THEN o sistema SHALL garantir margem/padding superior suficiente para não cobrir o início do conteúdo com a barra fixa de navegação, e margem/padding inferior suficiente para não cobrir o final do conteúdo com o StickyCTA (respiro mínimo ≥ 32px em mobile e ≥ 64px em desktop, em cada lado).

2.2 WHEN uma Section é renderizada em viewports médios e grandes (≥ 768px) THEN o sistema SHALL usar a largura disponível do container (`max-w-7xl`), respeitando uma largura máxima de leitura (`prose`/`max-w-prose` ou equivalente ~65–75ch) apenas para blocos de texto corrido, enquanto grids, cards e tabelas ocupam toda a largura horizontal do container.

2.3 WHEN o usuário navega até a Seção 2 ("Urgência de Mercado", slug `urgencia-mercado`) THEN o sistema SHALL exibir conteúdo substantivo correspondente à urgência de mercado (dor do setor, janela de oportunidade, posição de fundador, escassez) no lugar do placeholder.

2.4 WHEN o usuário navega até qualquer seção hoje renderizada como placeholder THEN o sistema SHALL exibir uma implementação real — ou, quando o conteúdo ainda não está completamente definido, um estado intermediário respirável e coerente com a identidade visual (não apenas "Em desenvolvimento" centralizado) que cubra a altura mínima da tela sem aparentar "vazio".

2.5 WHEN o leitor rola entre seções em Landing_Mode THEN o sistema SHALL aplicar espaçamento vertical consistente entre seções e entre o cabeçalho da Section e o conteúdo (respiro top/bottom ≥ 48px em desktop, ≥ 24px em mobile), garantindo que títulos não colem no topo e conteúdos não colem nos rodapés.

2.6 WHEN a proposta é aberta THEN o sistema SHALL apresentar uma experiência de aplicação interativa com navegação global por capítulos, não uma sequência de slides.

2.7 WHEN o cliente navega pela proposta THEN o sistema SHALL dividir as 22 seções em páginas/capítulos menores e semânticos: Visão Geral, Mercado, Produto, Investimento, Execução, Termos e Próximos Passos.

2.8 WHEN uma página/capítulo é renderizada THEN o sistema SHALL remover o header/footer interno repetitivo de seção, preservando apenas uma navbar global fixa e um CTA persistente.

2.9 WHEN o usuário acessa um link direto THEN o sistema SHALL usar slugs semânticos de página (`#produto`, `#investimento`, `#termos`) em vez de depender apenas de índices de seção (`#secao-5`).

2.10 WHEN qualquer bloco narrativo é renderizado THEN o sistema SHALL usar uma medida de leitura com largura real (`width: 100%; max-width: ~70ch; min-width: 0`) para impedir shrink indevido em flex/grid.

2.11 WHEN cards narrativos são renderizados em desktop THEN o sistema SHALL limitar a composição a no máximo duas colunas para preservar linhas horizontais legíveis e densidade de proposta premium.

2.12 WHEN páginas/capítulos agrupam seções heterogêneas THEN o shell da página SHALL usar fundo claro neutro, e blocos escuros/teal SHALL ser aplicados apenas em componentes que controlam seu próprio contraste.

2.13 WHEN Tailwind está ativo THEN o sistema SHALL evitar CSS legado que redefine utilitárias globais (`.text-gray-*`, `.text-sm`, etc.), preservando a escala visual e contraste esperados.

### Unchanged Behavior (Regression Prevention)

As seguintes capacidades já funcionais devem ser preservadas integralmente.

3.1 WHEN as seções já implementadas (Capa, Resumo Executivo, Produto Módulos, Protocolos Gradual, Projeções, Governança, Objeções) são renderizadas THEN o sistema SHALL CONTINUAR A exibir seu conteúdo atual com a mesma estrutura e hierarquia visual.

3.2 WHEN o usuário alterna entre Landing_Mode e Presentation_Mode THEN o sistema SHALL CONTINUAR A respeitar o comportamento de modos definido no spec principal (uma seção por vez em presentation, rolagem contínua em landing).

3.3 WHEN o usuário interage com componentes interativos (ROI_Simulator, Softhouse_Calculator, timeline de tranches, Countdown_Timer, Module_Cards, Protocol_Selector, Objection_Accordion, Intent_Form, Sticky_CTA) THEN o sistema SHALL CONTINUAR A executar a lógica, os cálculos e as propriedades de correctness já validadas (monotonicidade do ROI, soma das tranches, idempotência do toggle, pureza da formatação etc.) sem alteração de comportamento.

3.4 WHEN a Proposta_Interativa é renderizada em viewports ≤ 640px THEN o sistema SHALL CONTINUAR A reorganizar grids multi-coluna em coluna única preservando a ordem semântica do conteúdo, conforme requisito 14.2 do spec principal.

3.5 WHEN o usuário tem `prefers-reduced-motion` ativo THEN o sistema SHALL CONTINUAR A desativar animações decorativas, preservando apenas transições essenciais conforme requisito 15.4 do spec principal.

3.6 WHEN os tokens de cor da paleta institucional são aplicados (`#1B3A6B`, `#2D9B8A`, `#F5A623`, `#8B7EC8`, `#F8F9FA`, `#102642`) THEN o sistema SHALL CONTINUAR A preservar a paleta e as variantes cromáticas (`light`, `dark`, `teal`) conforme requisito 1.3 do spec principal, sem alterar o significado hierárquico das cores durante os ajustes de layout.

3.7 WHEN o conteúdo da proposta é lido por leitor de tela THEN o sistema SHALL CONTINUAR A expor landmarks semânticos (`header`, `main`, `nav`, `footer`), hierarquia de cabeçalhos e rótulos acessíveis conforme requisito 15 do spec principal.

3.8 WHEN os componentes interativos já existentes são usados dentro das novas páginas/capítulos THEN o sistema SHALL CONTINUAR A preservar sua lógica interna; a mudança é de composição/navegação, não de cálculo.
