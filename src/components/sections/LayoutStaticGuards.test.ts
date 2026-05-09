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
  const removedPackagePattern = new RegExp(
    `${'tail'}${'wind'}css|@${'tail'}${'wind'}css`
  );
  const removedCssDirectivePattern = new RegExp(
    `${'tail'}${'wind'}css|@${'tail'}${'wind'}|${'@th'}${'eme'}|${'@ap'}${'ply'}`
  );

  it('does not hide horizontal overflow at the document level', () => {
    expect(read('src/index.css')).not.toMatch(/overflow-x:\s*hidden/);
  });

  it('does not globally tighten heading letter spacing', () => {
    expect(read('src/index.css')).not.toMatch(/letter-spacing:\s*-\d/);
  });

  it('uses Bootstrap instead of the removed utility compiler', () => {
    const packageJson = read('package.json');
    const indexCss = read('src/index.css');

    expect(packageJson).toContain('"bootstrap"');
    expect(packageJson).not.toMatch(removedPackagePattern);
    expect(indexCss).toContain('bootstrap/dist/css/bootstrap.min.css');
    expect(indexCss).not.toMatch(removedCssDirectivePattern);
  });

  it('does not override framework spacing tokens used by width utilities', () => {
    const files = ['src/index.css', 'src/utils/theme.ts'];

    const violations = files.flatMap(file => {
      const source = read(file);
      const matches = source.match(
        /--spacing-(?:xs|sm|md|lg|xl|2xl|3xl|4xl)\b|--spacing-\$\{/g
      );
      return matches?.map(match => `${file}: ${match}`) ?? [];
    });

    expect(violations).toEqual([]);
  });

  it('does not use production text clipping patterns known to hide content', () => {
    const files = [
      ...collectProductionFiles(join(root, 'src/components/sections')),
      ...collectProductionFiles(join(root, 'src/components/interactive')),
    ];

    const forbidden = [/whitespace-nowrap/, /line-clamp-\d/];

    const violations = files.flatMap(file => {
      const source = readFileSync(file, 'utf8');
      return forbidden
        .filter(pattern => pattern.test(source))
        .map(pattern => `${file.replace(`${root}/`, '')}: ${pattern}`);
    });

    expect(violations).toEqual([]);
  });
});
