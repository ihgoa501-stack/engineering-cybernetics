'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

const hook = path.resolve(__dirname, '../hooks/inject-router.js');

function run(event, env = {}) {
  const result = spawnSync(process.execPath, [hook, event], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  assert.strictEqual(result.status, 0, result.stderr);
  assert.match(result.stdout, /ENGINEERING CYBERNETICS ROUTER/);
  return result.stdout;
}

const claudeStart = run('SessionStart', { PLUGIN_DATA: '' });
assert.ok(!claudeStart.trim().startsWith('{'));

const claudeSubagent = JSON.parse(run('SubagentStart', { PLUGIN_DATA: '' }));
assert.strictEqual(
  claudeSubagent.hookSpecificOutput.hookEventName,
  'SubagentStart',
);

const codex = JSON.parse(run('UserPromptSubmit', { PLUGIN_DATA: '/tmp/plugin-data' }));
assert.strictEqual(codex.systemMessage, 'ENGINEERING-CYBERNETICS:ROUTER');
assert.strictEqual(
  codex.hookSpecificOutput.hookEventName,
  'UserPromptSubmit',
);

process.stdout.write('router hook tests passed\n');
