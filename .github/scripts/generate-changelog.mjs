#!/usr/bin/env node
/**
 * Generate CHANGELOG.md section + release-notes.md from git commits since last tag.
 *
 * Usage: VERSION=0.1.0 TAG=v0.1.0 node .github/scripts/generate-changelog.mjs
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const version = process.env.VERSION || process.argv[2];
const tag = process.env.TAG || process.argv[3] || `v${version}`;

if (!version) {
  console.error('Usage: VERSION=x.y.z TAG=vx.y.z node generate-changelog.mjs');
  process.exit(1);
}

function sh(cmd, { optional = false } = {}) {
  try {
    return execSync(cmd, {
      cwd: root,
      encoding: 'utf8',
      stdio: optional ? ['pipe', 'pipe', 'ignore'] : 'pipe',
    }).trim();
  } catch {
    if (optional) return '';
    throw new Error(`Command failed: ${cmd}`);
  }
}

function previousTag(currentTag) {
  return sh(`git describe --tags --abbrev=0 ${currentTag}^`, { optional: true });
}

function tagExists(currentTag) {
  return Boolean(sh(`git rev-parse ${currentTag}^{commit}`, { optional: true }));
}

function commitsSince(prev, currentTag) {
  let range;
  if (prev) {
    range = `${prev}..${currentTag}`;
  } else if (tagExists(currentTag)) {
    range = currentTag;
  } else {
    range = 'HEAD';
  }

  let raw = '';
  try {
    raw = sh(`git log ${range} --pretty=format:%H%x09%s%x09%an --no-merges`);
  } catch {
    return [];
  }
  if (!raw) return [];
  return raw.split('\n').map(line => {
    const [hash, subject, author] = line.split('\t');
    return { hash: hash.slice(0, 7), subject, author };
  });
}

function categorize(subject) {
  const m = subject.match(/^(\w+)(?:\([^)]+\))?!?:\s*/);
  return m?.[1]?.toLowerCase() || 'other';
}

function groupCommits(commits) {
  const groups = {
    feat: [],
    fix: [],
    docs: [],
    chore: [],
    other: [],
  };
  for (const c of commits) {
    const key = categorize(c.subject);
    const bucket = groups[key] ? key : 'other';
    groups[bucket].push(c);
  }
  return groups;
}

const LABELS = {
  feat: '### Features',
  fix: '### Fixes',
  docs: '### Documentation',
  chore: '### Chores',
  other: '### Other',
};

function formatSection(commits) {
  const groups = groupCommits(commits);
  const lines = [];
  for (const key of ['feat', 'fix', 'docs', 'chore', 'other']) {
    if (!groups[key].length) continue;
    lines.push(LABELS[key], '');
    for (const c of groups[key]) {
      const text = c.subject.replace(/^(\w+)(?:\([^)]+\))?!?:\s*/, '');
      lines.push(`- ${text} (${c.hash})`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd();
}

const prev = previousTag(tag);
const commits = commitsSince(prev, tag);
const date = new Date().toISOString().slice(0, 10);
const compareUrl = prev
  ? `https://github.com/manojbajaj95/ai-pm-skill/compare/${prev}...${tag}`
  : `https://github.com/manojbajaj95/ai-pm-skill/releases/tag/${tag}`;

const section = `## [${version}] - ${date}

${formatSection(commits) || '- See commit history for details.'}

**Full diff:** ${compareUrl}

**Install:**
\`\`\`bash
npx darin@${version} install
\`\`\`
`;

const changelogPath = path.join(root, 'CHANGELOG.md');
const header = '# Changelog\n\nAll notable changes to the [darin](https://www.npmjs.com/package/darin) npm package and AI PM skill.\n\n';

let existing = '';
if (fs.existsSync(changelogPath)) {
  const content = fs.readFileSync(changelogPath, 'utf8');
  const idx = content.indexOf('\n## [');
  if (idx !== -1) existing = content.slice(idx + 1);
}

fs.writeFileSync(changelogPath, `${header}${section}\n${existing}`.trimEnd() + '\n');
fs.writeFileSync(path.join(root, 'release-notes.md'), section);

console.log(`Changelog written for ${tag} (${commits.length} commits since ${prev || 'first release'})`);
