import assert from 'assert';
import plugin from '../.opencode/plugins/engineering-cybernetics.mjs';

const hooks = await plugin();
const config = {};
await hooks.config(config);
assert.strictEqual(config.skills.paths.length, 1);
assert.match(config.skills.paths[0], /engineering-cybernetics\/skills$/);

const output = { system: ['base instructions'] };
await hooks['experimental.chat.system.transform']({}, output);
assert.match(output.system[0], /ENGINEERING CYBERNETICS ROUTER/);

process.stdout.write('opencode adapter tests passed\n');
