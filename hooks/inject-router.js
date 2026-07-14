#!/usr/bin/env node
'use strict';

const { ROUTER_INSTRUCTIONS } = require('./router-instructions');

const event = process.argv[2] || 'SessionStart';
const isCodex = Boolean(process.env.PLUGIN_DATA);

function writeOutput() {
  if (isCodex) {
    process.stdout.write(JSON.stringify({
      systemMessage: 'ENGINEERING-CYBERNETICS:ROUTER',
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: ROUTER_INSTRUCTIONS,
      },
    }));
    return;
  }

  if (event === 'SubagentStart') {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: ROUTER_INSTRUCTIONS,
      },
    }));
    return;
  }

  process.stdout.write(ROUTER_INSTRUCTIONS);
}

try {
  writeOutput();
} catch (_) {
  // A routing reminder must never block the host Agent.
}
