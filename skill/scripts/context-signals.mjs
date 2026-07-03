/**
 * JSON signals — reads ~/.darin/workspaces/<slug>/
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  activeWorkspaceFromConfig,
  darinHome,
  listWorkspaces,
  parsePathArgs,
  resolveSlug,
  workspaceRoot,
} from './lib/paths.mjs';
import { exists, firstExisting, listMd, mtime, safeRead } from './lib/fs-utils.mjs';
import { insightSessionsForSignals } from './lib/insights-sessions.mjs';
import { readRoadmapLoop } from './lib/roadmap.mjs';

const STALE_DAYS = 30;
const MS_DAY = 86400000;
const PRODUCT_NAMES = ['PRODUCT.md', 'Product.md'];
const STRATEGY_NAMES = ['STRATEGY.md', 'Strategy.md'];

function walkIngestion(root) {
  const base = path.join(root, 'ingestion');
  const out = [];
  if (!exists(base)) return out;
  for (const shape of fs.readdirSync(base)) {
    const d = path.join(base, shape);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of listMd(d)) {
      out.push({
        shape,
        file: f,
        path: path.join(root, 'ingestion', shape, f),
        mtime: mtime(path.join(d, f)),
      });
    }
  }
  out.sort((a, b) => b.mtime - a.mtime);
  return out;
}

function staleHypotheses(root, now) {
  const dir = path.join(root, 'hypotheses');
  const stale = [];
  for (const f of listMd(dir)) {
    const p = path.join(dir, f);
    const age = (now - mtime(p)) / MS_DAY;
    if (age >= STALE_DAYS) stale.push({ file: f, daysSinceUpdate: Math.floor(age) });
  }
  return stale;
}

function adhocBacklog(root) {
  const d = path.join(root, 'ingestion', 'adhoc');
  return listMd(d).map(f => path.join(root, 'ingestion', 'adhoc', f));
}

function hasEmptySuccessMetrics(content) {
  const idx = content.search(/## Success metrics/i);
  if (idx === -1) return true;
  const section = content.slice(idx).split(/^## /m)[0] || '';
  const rows = section.split('\n').filter(l => l.trim().startsWith('|') && !/^\|[\s\-:|]+\|$/.test(l.trim()));
  const dataRows = rows.slice(1);
  if (dataRows.length === 0) return true;
  return dataRows.every(r => r.replace(/\|/g, '').trim().length === 0);
}

function decisionDebt(root) {
  const hypDir = path.join(root, 'hypotheses');
  const missingMetrics = [];

  for (const f of listMd(hypDir)) {
    const p = path.join(hypDir, f);
    const content = safeRead(p);
    if (hasEmptySuccessMetrics(content)) {
      missingMetrics.push({
        file: f,
        path: p,
        reason: /## Success metrics/i.test(content) ? 'empty_success_metrics' : 'no_success_metrics_section',
      });
    }
  }

  return { missingMetrics, specsWithoutHypothesis: [] };
}

function openTensions(root, now) {
  const strategyPath = path.join(root, 'STRATEGY.md');
  if (!exists(strategyPath)) {
    return { items: [], count: 0, strategyAgeDays: null, stale: false };
  }
  const content = safeRead(strategyPath);
  const match = content.match(/## Open tensions\s*\n([\s\S]*?)(?=\n## |\s*$)/i);
  const section = match?.[1] || '';
  const items = section
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('-') && l.length > 2)
    .map(l => l.replace(/^-\s*/, ''));
  const strategyAgeDays = Math.floor((now - mtime(strategyPath)) / MS_DAY);
  return {
    items,
    count: items.length,
    strategyAgeDays,
    stale: items.length > 0 && strategyAgeDays >= STALE_DAYS,
  };
}

const opts = parsePathArgs(process.argv);
const slug = resolveSlug(opts);
const root = workspaceRoot(opts);
const now = Date.now();
const insightSessions = root ? insightSessionsForSignals(root) : [];
const latestInsightsMtime = insightSessions[0]?.mtime ?? 0;

const signals = {
  darin_home: darinHome(),
  active_workspace: activeWorkspaceFromConfig(),
  slug,
  workspace_root: root,
  workspaces: listWorkspaces(),
  setup: {
    hasActiveWorkspace: !!slug,
    hasProduct: root ? !!firstExisting(root, PRODUCT_NAMES) : false,
    hasStrategy: root ? !!firstExisting(root, STRATEGY_NAMES) : false,
    hasHypotheses: root ? listMd(path.join(root, 'hypotheses')).length > 0 : false,
  },
  ingestion: root
    ? { recent: walkIngestion(root).slice(0, 5), adhocBacklog: adhocBacklog(root) }
    : { recent: [], adhocBacklog: [] },
  hypotheses: root
    ? { stale: staleHypotheses(root, now), count: listMd(path.join(root, 'hypotheses')).length }
    : { stale: [], count: 0 },
  loop: root
    ? {
        insights_sessions: insightSessions,
        latest_insights: insightSessions[0] || null,
        roadmap: readRoadmapLoop(root, latestInsightsMtime),
      }
    : {
        insights_sessions: [],
        latest_insights: null,
        roadmap: { exists: false, active_status: null, up_next_count: 0, needs_roadmap: true },
      },
  maintenance: root
    ? {
        decisionDebt: decisionDebt(root),
        openTensions: openTensions(root, now),
      }
    : {
        decisionDebt: { missingMetrics: [], specsWithoutHypothesis: [] },
        openTensions: { items: [], count: 0, strategyAgeDays: null, stale: false },
      },
};

if (!slug) signals.error = 'NO_ACTIVE_WORKSPACE';

console.log(JSON.stringify(signals, null, 2));
