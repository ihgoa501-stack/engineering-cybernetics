import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

function run(file, env = {}) {
  return execFileSync(process.execPath, [file], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    encoding: 'utf8',
  });
}

const claudeSession = run('hooks/activate.js');
assert.match(claudeSession, /ENGINEERING CYBERNETICS ACTIVE/);
assert.match(claudeSession, /工程控制论总纲/);

const claudeSubagent = JSON.parse(run('hooks/subagent.js'));
assert.equal(claudeSubagent.hookSpecificOutput.hookEventName, 'SubagentStart');
assert.match(claudeSubagent.hookSpecificOutput.additionalContext, /工程控制论总纲/);

const codexSession = JSON.parse(run('hooks/activate.js', { PLUGIN_DATA: '/tmp/engineering-cybernetics-test' }));
assert.equal(codexSession.hookSpecificOutput.hookEventName, 'SessionStart');
assert.equal(codexSession.systemMessage, 'ENGINEERING_CYBERNETICS:ACTIVE');

console.log('ok: session and subagent context injection');
