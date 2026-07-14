import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { ROUTER_INSTRUCTIONS } = require('../../hooks/router-instructions.js');

export default async () => {
  const skillsDir = path.resolve(__dirname, '../../skills');

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.system.transform': async (_input, output) => {
      if (output.system.length > 0) {
        output.system[output.system.length - 1] += `\n\n${ROUTER_INSTRUCTIONS}`;
      } else {
        output.system.push(ROUTER_INSTRUCTIONS);
      }
    },
  };
};
