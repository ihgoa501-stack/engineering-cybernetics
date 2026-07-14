const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function read(name) {
  return fs.readFileSync(path.join(ROOT, name), 'utf8').trim();
}

function getInstructions() {
  try {
    return [
      'ENGINEERING CYBERNETICS ACTIVE',
      read('AGENTS.md'),
      read('ENGINEERING_CYBERNETICS.md'),
      read('SCENARIOS.md'),
    ].join('\n\n');
  } catch (_error) {
    return 'ENGINEERING CYBERNETICS ACTIVE\n\nBefore non-trivial project work, define the control objective, constraints, observations, actions, feedback, and safe stopping state. Load the relevant engineering-cybernetics scenario before acting.';
  }
}

module.exports = { getInstructions };
