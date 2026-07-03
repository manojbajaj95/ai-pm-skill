/**
 * Shared CLI arg parsing and guards for route scripts.
 */
import path from 'node:path';
import { parsePathArgs } from './paths.mjs';

export function parsePositionalRouteArgs(argv, { positionalKey, positionalFlag }) {
  const base = parsePathArgs(argv);
  const out = { ...base, cwd: process.cwd(), [positionalKey]: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (positionalFlag && a === positionalFlag && argv[i + 1]) {
      out[positionalKey] = argv[++i];
    } else if (a === '--cwd' && argv[i + 1]) {
      out.cwd = path.resolve(argv[++i]);
    } else if (!a.startsWith('--')) {
      out[positionalKey] += `${out[positionalKey] ? ' ' : ''}${a}`;
    }
  }
  return out;
}

export function exitNoActiveWorkspace({ json }) {
  const err = {
    error: 'NO_ACTIVE_WORKSPACE',
    message: 'Run `/darin init` or set active_workspace in ~/.darin/config.json',
  };
  if (json) console.log(JSON.stringify(err, null, 2));
  else console.error(err.message);
  process.exit(1);
}
