#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');
const core = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
const skill = fs.readFileSync(path.join(root, 'skills/engineering-cybernetics/SKILL.md'), 'utf8');

const files = new Map([
  ['.clinerules/engineering-cybernetics.md', core],
  ['.github/copilot-instructions.md', core],
  ['.kilo/rules/engineering-cybernetics.md', core],
  ['.qoder/rules/engineering-cybernetics.md', core],
  ['.windsurf/rules/engineering-cybernetics.md', core],
  ['adapters/kilo/AGENTS.md', core],
  ['adapters/kilo/skills/engineering-cybernetics/SKILL.md', skill],
  ['adapters/antigravity/engineering-cybernetics/rules/engineering-cybernetics.md', core],
  ['adapters/antigravity/engineering-cybernetics/skills/engineering-cybernetics/SKILL.md', skill],
  ['.cursor/rules/engineering-cybernetics.mdc', `---\ndescription: Engineering cybernetics core\nalwaysApply: true\n---\n\n${core}`],
  ['.kiro/steering/engineering-cybernetics.md', `---\ninclusion: always\n---\n\n${core}`],
]);

function addScenarioBundle(targetRoot) {
  for (const name of ['ENGINEERING_CYBERNETICS.md', 'SCENARIOS.md']) {
    files.set(path.join(targetRoot, name), fs.readFileSync(path.join(root, name), 'utf8'));
  }

  const sourceRoot = path.join(root, 'control-scenarios');
  const walk = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(source);
      else {
        const relative = path.relative(sourceRoot, source);
        files.set(
          path.join(targetRoot, 'control-scenarios', relative),
          fs.readFileSync(source, 'utf8'),
        );
      }
    }
  };
  walk(sourceRoot);
}

addScenarioBundle('adapters/kilo');
addScenarioBundle('adapters/antigravity/engineering-cybernetics');

let stale = false;
for (const [relative, expected] of files) {
  const target = path.join(root, relative);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== expected) {
      console.error(`stale: ${relative}`);
      stale = true;
    }
    continue;
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, expected);
  console.log(`synced: ${relative}`);
}

if (stale) process.exit(1);
if (check) console.log(`ok: ${files.size} adapters are synchronized`);
