# Layout Overflow and Card Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir definitivamente cards espremidos, texto escapando/ficando comprimido e estilos globais que mascaram estouro horizontal.

**Architecture:** A correção deve começar pelos contratos de layout compartilhados, não por ajustes pontuais. `src/index.css` define segurança global de quebra de texto; `NarrativeSection` vira o padrão para cards/métricas narrativas; componentes fora do padrão são alinhados a esses contratos.

**Tech Stack:** React 19, TypeScript, Vite, Bootstrap CSS 5, Vitest, Testing Library, fast-check.

---

## Files To Modify

- Modify: `src/index.css` — remover estilos globais que mascaram o bug e adicionar utilitários seguros de texto/largura.
- Modify: `src/components/sections/NarrativeSection.tsx` — impor `min-w-0`, `prose-measure`, quebra segura e no máximo 2 colunas narrativas.
- Modify: `src/components/sections/ExecutiveSummarySection.tsx` — corrigir o bug confirmado de `lg:grid-cols-4`, padding excessivo e textos sem medida.
- Modify: `src/components/sections/CoverSection.tsx` — reduzir risco de hero e CTAs espremidos.
- Modify: `src/components/sections/ProductModulesSection.tsx` — alinhar título/lead à escala segura.
- Modify: `src/components/sections/MarketRevenueSection.tsx` — remover grid `auto-fit/minmax` e proteger preços/textos.
- Modify: `src/components/interactive/ModuleCards.tsx` — remover grid auto-fit e `line-clamp` que esconde texto.
- Modify: `src/components/interactive/ROISimulator.tsx` — remover `whitespace-nowrap` de valores financeiros.
- Modify: `src/components/interactive/SofthouseCalculator.tsx` — remover `whitespace-nowrap` de valores financeiros.
- Modify: `src/components/interactive/CountdownTimer.tsx` — evitar 4 colunas cedo demais.
- Modify: `src/components/interactive/TrancheTimeline.tsx` — proteger linha de valores/gatilhos dentro de flex.
- Create: `src/components/sections/LayoutStaticGuards.test.ts` — bloquear regressões estáticas que causam texto espremido.
- Keep: `src/components/sections/Section.layout.test.tsx` — deve passar sem relaxar as propriedades existentes.

## Task 1: Add Static Regression Guards

**Files:**
- Create: `src/components/sections/LayoutStaticGuards.test.ts`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Create a failing static guard test**

Add this file:

```ts
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function collectProductionFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const full = join(dir, entry);
    const stat = statSync(full);

    if (stat.isDirectory()) return collectProductionFiles(full);
    if (!full.endsWith('.tsx') && !full.endsWith('.css')) return [];
    if (full.includes('.test.') || full.includes('.demo.')) return [];

    return [full];
  });
}

function read(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

describe('layout static guards', () => {
  it('does not hide horizontal overflow at the document level', () => {
    expect(read('src/index.css')).not.toMatch(/overflow-x:\s*hidden/);
  });

  it('does not globally tighten heading letter spacing', () => {
    expect(read('src/index.css')).not.toMatch(/letter-spacing:\s*-\d/);
  });

  it('does not use production layout patterns known to squeeze cards', () => {
    const files = [
      ...collectProductionFiles(join(root, 'src/components/sections')),
      ...collectProductionFiles(join(root, 'src/components/interactive')),
    ];

    const forbidden = [
      /lg:grid-cols-4/,
      /sm:grid-cols-4/,
      /grid-cols-\[repeat\(auto-fit,minmax/,
      /whitespace-nowrap/,
      /line-clamp-\d/,
    ];

    const violations = files.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      return forbidden
        .filter(pattern => pattern.test(source))
        .map(pattern => `${file.replace(`${root}/`, '')}: ${pattern}`);
    });

    expect(violations).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run: `npm run test:run -- src/components/sections/LayoutStaticGuards.test.ts`

Expected: FAIL, listing current violations such as `overflow-x: hidden`, `letter-spacing: -0.025em`, `lg:grid-cols-4`, `whitespace-nowrap`, `line-clamp-2`, and `grid-cols-[repeat(auto-fit,minmax`.

## Task 2: Fix Global CSS Contracts

**Files:**
- Modify: `src/index.css`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Remove the masking styles**

In `src/index.css`, remove `overflow-x: hidden` from `body`.

Change heading `letter-spacing` from:

```css
letter-spacing: -0.025em;
```

to:

```css
letter-spacing: 0;
```

- [ ] **Step 2: Strengthen safe text utilities**

Replace the current `.prose-measure` block with:

```css
.prose-measure {
  width: 100%;
  max-width: 70ch;
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
  text-wrap: pretty;
}

.text-safe {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
}

.metric-value {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: normal;
  text-wrap: balance;
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 3: Run static guards**

Run: `npm run test:run -- src/components/sections/LayoutStaticGuards.test.ts`

Expected: Still FAIL, but global CSS violations are gone. Remaining failures should point to component-level patterns.

## Task 3: Fix Shared Narrative Layout

**Files:**
- Modify: `src/components/sections/NarrativeSection.tsx`
- Test: `src/components/sections/Section.layout.test.tsx`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Make the root and children width-safe**

Change the root wrapper from:

```tsx
<div className={cn('w-full space-y-12', styles.panel)}>
```

to:

```tsx
<div className={cn('w-full min-w-0 space-y-10 md:space-y-12', styles.panel)}>
```

Change the intro wrapper from:

```tsx
<div className="w-full max-w-3xl space-y-6">
```

to:

```tsx
<div className="w-full min-w-0 max-w-3xl space-y-6">
```

- [ ] **Step 2: Remove nowrap from metrics**

Change metric value classes from:

```tsx
'text-3xl md:text-4xl font-bold tabular-nums whitespace-nowrap',
```

to:

```tsx
'metric-value text-2xl sm:text-3xl md:text-4xl font-bold',
```

Change metric card classes from:

```tsx
'w-full rounded-xl p-6 text-center',
```

to:

```tsx
'w-full min-w-0 rounded-xl p-5 sm:p-6 text-center',
```

- [ ] **Step 3: Make card flex children shrink correctly**

Change the card article class from:

```tsx
className={cn('w-full rounded-xl p-6 md:p-8', styles.card)}
```

to:

```tsx
className={cn('w-full min-w-0 rounded-xl p-5 sm:p-6 md:p-7', styles.card)}
```

Change the content wrapper from:

```tsx
<div className="flex-1 w-full">
```

to:

```tsx
<div className="min-w-0 flex-1 w-full">
```

Change the card paragraph classes from:

```tsx
'text-base leading-relaxed',
```

to:

```tsx
'prose-measure text-base leading-relaxed',
```

Change the child wrapper from:

```tsx
{children && <div className="w-full mt-8">{children}</div>}
```

to:

```tsx
{children && <div className="w-full min-w-0 mt-8">{children}</div>}
```

- [ ] **Step 4: Run layout tests**

Run: `npm run test:run -- src/components/sections/Section.layout.test.tsx`

Expected: The `C_proseShrink` and NarrativeSection-related prose failures should pass; `ExecutiveSummarySection` may still fail.

## Task 4: Fix Executive Summary Confirmed Bug

**Files:**
- Modify: `src/components/sections/ExecutiveSummarySection.tsx`
- Test: `src/components/sections/Section.layout.test.tsx`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Reduce oversized hero card pressure**

Change:

```tsx
<div className="w-full bg-gradient-to-br from-[#1b3a6b] to-[#102642] rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-black/20 text-white">
```

to:

```tsx
<div className="w-full min-w-0 bg-gradient-to-br from-[#1b3a6b] to-[#102642] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/20 text-white">
```

Change the lead paragraph from:

```tsx
<p className="text-lg md:text-xl text-blue-100 max-w-3xl leading-relaxed">
```

to:

```tsx
<p className="prose-measure text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
```

- [ ] **Step 2: Delay financial 3-column layout**

Change:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-white/20">
```

to:

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-4 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-white/20">
```

For each financial item, add `min-w-0` and change large values to `metric-value`.

Example:

```tsx
<div className="min-w-0 flex flex-col items-center lg:items-start pt-4 lg:pt-0 lg:px-5 first:pt-0">
  <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wide mb-2 text-safe">
    Investimento Total
  </span>
  <span className="metric-value text-3xl sm:text-4xl md:text-5xl font-black text-amber-400">
    R$ 75.000
  </span>
</div>
```

- [ ] **Step 3: Remove the confirmed 4-column card grid**

Change:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
```

to:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
```

Change each highlight card from:

```tsx
className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 exec-card-hover w-full"
```

to:

```tsx
className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 exec-card-hover w-full min-w-0"
```

Change each highlight paragraph from:

```tsx
<p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.description}</p>
```

to:

```tsx
<p className="prose-measure text-gray-600 leading-relaxed text-sm md:text-base">{item.description}</p>
```

- [ ] **Step 4: Reduce strategic block pressure**

Change:

```tsx
<div className="w-full bg-gray-50 rounded-[2rem] p-8 md:p-12 border border-gray-100">
```

to:

```tsx
<div className="w-full min-w-0 bg-gray-50 rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-100">
```

Add `min-w-0` to the two strategic columns and `text-safe` to list item spans:

```tsx
<span className="text-safe text-gray-700 text-base sm:text-lg leading-relaxed">{text}</span>
```

- [ ] **Step 5: Run layout tests**

Run: `npm run test:run -- src/components/sections/Section.layout.test.tsx src/components/sections/LayoutStaticGuards.test.ts`

Expected: The original two failures are gone. Remaining failures, if any, should identify other production components.

## Task 5: Fix Section-Specific Outliers

**Files:**
- Modify: `src/components/sections/CoverSection.tsx`
- Modify: `src/components/sections/ProductModulesSection.tsx`
- Modify: `src/components/sections/MarketRevenueSection.tsx`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Make CoverSection less brittle**

In `CoverSection.tsx`, change the main headline class to:

```tsx
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight w-full max-w-5xl mx-auto text-safe"
```

Change the investment row from `md:flex-row` to `lg:flex-row`.

Change both investment mini-card wrappers to include `min-w-0`:

```tsx
className="min-w-0 flex-1 bg-black/30 backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-7 border border-white/10 w-full flex flex-col items-center lg:items-start"
```

Change the investment amount class to:

```tsx
className="metric-value text-3xl sm:text-4xl md:text-5xl font-black text-white"
```

Change all CTA buttons to include mobile full-width protection:

```tsx
className="inline-flex w-full sm:w-auto items-center justify-center px-5 py-3 sm:px-6 sm:py-4 bg-amber-500 text-gray-950 font-bold rounded-lg hover:bg-amber-400 transition-all hover:scale-105 shadow-xl"
```

Apply the same `w-full sm:w-auto items-center justify-center px-5 py-3 sm:px-6 sm:py-4 rounded-lg` pattern to the PDF and meeting buttons.

- [ ] **Step 2: Make ProductModulesSection title scale safer**

Change:

```tsx
<div className="w-full space-y-16">
```

to:

```tsx
<div className="w-full min-w-0 space-y-10 md:space-y-12">
```

Change title class to:

```tsx
className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-safe"
```

- [ ] **Step 3: Replace MarketRevenue auto-fit grid**

Change:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
```

to:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-3">
```

Change each plan card class to:

```tsx
className="min-w-0 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r last:border-0 border-gray-200"
```

Change price paragraph class to:

```tsx
className="metric-value text-2xl sm:text-3xl font-bold text-[#2D9B8A] my-3"
```

- [ ] **Step 4: Run static guards**

Run: `npm run test:run -- src/components/sections/LayoutStaticGuards.test.ts`

Expected: Section outlier violations for `grid-cols-[repeat(auto-fit,minmax` are gone.

## Task 6: Fix Interactive Components That Squeeze Text

**Files:**
- Modify: `src/components/interactive/ModuleCards.tsx`
- Modify: `src/components/interactive/ROISimulator.tsx`
- Modify: `src/components/interactive/SofthouseCalculator.tsx`
- Modify: `src/components/interactive/CountdownTimer.tsx`
- Modify: `src/components/interactive/TrancheTimeline.tsx`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Replace ModuleCards auto-fit and remove line clamp**

Change grid wrapper from:

```tsx
className={`grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 sm:gap-6 ${className}`}
```

to:

```tsx
className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 ${className}`}
```

Change card inner content wrapper from:

```tsx
<div className="flex-1 w-full">
```

to:

```tsx
<div className="min-w-0 flex-1 w-full">
```

Change preview paragraph from:

```tsx
<p className="text-xs sm:text-sm text-slate-300 line-clamp-2 w-full">
```

to:

```tsx
<p className="prose-measure text-xs sm:text-sm text-slate-300 w-full">
```

- [ ] **Step 2: Remove financial nowrap in ROISimulator**

In `ROISimulator.tsx`, replace each result value class:

```tsx
className="text-lg sm:text-xl md:text-2xl font-bold text-white tabular-nums whitespace-nowrap"
```

with:

```tsx
className="metric-value text-lg sm:text-xl md:text-2xl font-bold text-white"
```

For the blue 5% value, use:

```tsx
className="metric-value text-lg sm:text-xl md:text-2xl font-bold text-[#60A5FA]"
```

- [ ] **Step 3: Remove financial nowrap in SofthouseCalculator**

In `SofthouseCalculator.tsx`, replace all result value classes containing `tabular-nums whitespace-nowrap` with `metric-value`.

Example:

```tsx
className="metric-value text-lg sm:text-xl md:text-2xl font-bold text-[#5EEAD4]"
```

- [ ] **Step 4: Make CountdownTimer 4-column layout start later**

Change:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
```

to:

```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
```

Change active countdown container padding from:

```tsx
className={`border-2 rounded-lg p-8 transition-colors duration-300 ${colorClass} ${animationClass}`}
```

to:

```tsx
className={`border-2 rounded-lg p-4 sm:p-6 transition-colors duration-300 ${colorClass} ${animationClass}`}
```

- [ ] **Step 5: Protect TrancheTimeline flex rows**

Change:

```tsx
<div className="flex-1">
```

to:

```tsx
<div className="min-w-0 flex-1">
```

Change the tranche header row from:

```tsx
<div className="flex items-center gap-3 mb-2">
```

to:

```tsx
<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
```

Change summary grid from:

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

to:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

- [ ] **Step 6: Run static guards**

Run: `npm run test:run -- src/components/sections/LayoutStaticGuards.test.ts`

Expected: PASS.

## Task 7: Full Layout Verification

**Files:**
- Test: `src/components/sections/Section.layout.test.tsx`
- Test: `src/components/sections/LayoutStaticGuards.test.ts`

- [ ] **Step 1: Run focused layout tests**

Run:

```bash
npm run test:run -- src/components/sections/Section.layout.test.tsx src/components/sections/LayoutStaticGuards.test.ts
```

Expected: PASS. The previous failures for `C_proseWidth` and `C_cardColumns` must be gone.

- [ ] **Step 2: Run all automated tests**

Run:

```bash
npm run test:run
```

Expected: PASS. If unrelated existing failures appear, record them with file/test name before continuing.

- [ ] **Step 3: Run production build**

Run:

```bash
npm run build
```

Expected: PASS with Vite production output generated.

- [ ] **Step 4: Lightweight manual viewport check**

If the machine is stable enough, run the dev server only after automated tests pass:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Check these pages at widths 320, 375, 768, 1024, and 1440:

- `/#visao-geral`
- `/#produto`
- `/#investimento`
- `/#execucao`

Expected: no horizontal scrollbar, no clipped card copy, no numeric values escaping cards, no 4-column narrative card grid.

Stop the dev server after the check.

## Acceptance Criteria

- `npm run test:run -- src/components/sections/Section.layout.test.tsx src/components/sections/LayoutStaticGuards.test.ts` passes.
- `npm run build` passes.
- `src/index.css` no longer hides horizontal overflow at body level.
- Production section/interactive components contain no `lg:grid-cols-4`, `sm:grid-cols-4`, `grid-cols-[repeat(auto-fit,minmax`, `whitespace-nowrap`, or `line-clamp-*`.
- Narrative card grids use at most 2 columns unless the content is purely numeric/compact and explicitly covered by tests.
- Long Portuguese phrases and BRL values wrap inside cards instead of escaping or being clipped.

## Assumptions

- The priority is readability and robustness over fitting more cards per row.
- Two-column desktop narrative grids are acceptable even when this creates taller pages.
- The existing dark visual direction should remain; this plan changes layout safety, not brand palette.
- Browser-based visual verification should be lightweight because the previous dev server/browser attempt made the machine slow.
