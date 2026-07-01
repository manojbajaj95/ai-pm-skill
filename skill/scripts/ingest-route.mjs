/**
 * Classify ingest input; paths are relative to ~/.darin/workspaces/<id>/
 */
import fs from 'node:fs';
import path from 'node:path';
import { parsePathArgs, workspaceRoot } from './lib/paths.mjs';

const SHAPE_DIRS = {
  interview: 'interviews',
  interviews: 'interviews',
  meeting: 'meetings',
  meetings: 'meetings',
  market: 'market',
  adhoc: 'adhoc',
};

const KEYWORDS = {
  interview: /\b(interview|customer call|user research|discovery call|participant|mom test)\b/i,
  meeting: /\b(1:1|one on one|roadmap review|kickoff|retro|standup|sync|exec review)\b/i,
  market: /\b(competitor|changelog|analyst|market|pricing page|tweet|article|landscape)\b/i,
};

function parseIngestArgs(argv) {
  const base = parsePathArgs(argv);
  const out = { ...base, file: null, hint: null, text: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file' && argv[i + 1]) {
      out.file = argv[++i];
      out.text = fs.readFileSync(path.resolve(out.file), 'utf8');
    } else if (a === '--hint' && argv[i + 1]) out.hint = argv[++i];
    else if (!a.startsWith('--')) out.text += `${a} `;
  }
  return out;
}

function classify(text, hint) {
  if (hint && hint in SHAPE_DIRS) return { shape: hint, confidence: 'hint' };
  const scores = Object.entries(KEYWORDS).map(([shape, re]) => ({
    shape,
    hits: (text.match(re) || []).length,
  }));
  scores.sort((a, b) => b.hits - a.hits);
  if (scores[0]?.hits > 0) return { shape: scores[0].shape, confidence: 'keyword' };
  return { shape: 'adhoc', confidence: 'default' };
}

function shapeDir(shape) {
  return SHAPE_DIRS[shape] || shape;
}

function slugFrom(text, file) {
  if (file) {
    return path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48);
  }
  const words = text.toLowerCase().split(/\s+/).slice(0, 4).join('-');
  return words.replace(/[^a-z0-9-]/g, '').slice(0, 48) || 'note';
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

const args = parseIngestArgs(process.argv);
const storageRoot = workspaceRoot(args);

if (!storageRoot) {
  const err = { error: 'NO_ACTIVE_WORKSPACE', message: 'Run `/darin init` or set active_workspace in ~/.darin/config.json' };
  if (args.json) {
    console.log(JSON.stringify(err, null, 2));
  } else {
    console.error(err.message);
  }
  process.exit(1);
}

const { shape, confidence } = classify(args.text, args.hint);
const slug = slugFrom(args.text, args.file);
const date = today();
const dir = shapeDir(shape);

const rel = {
  source: `source/${dir}/${date}-${slug}.md`,
  ingestion: `ingestion/${dir}/${date}-${slug}.md`,
};

const result = {
  shape,
  shapeDir: dir,
  confidence,
  workspace_root: storageRoot,
  paths: {
    source: rel.source,
    ingestion: rel.ingestion,
    source_abs: path.join(storageRoot, rel.source),
    ingestion_abs: path.join(storageRoot, rel.ingestion),
  },
  durableCandidates: [
    'hypotheses/',
    'STRATEGY.md',
  ],
};

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Shape: ${shape} (${confidence})`);
  console.log(`Source: ${result.paths.source_abs}`);
  console.log(`Ingestion: ${result.paths.ingestion_abs}`);
}
