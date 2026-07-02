/**
 * Parse roadmap/roadmap.md and detect staleness vs latest insights.
 */
import fs from 'node:fs';

export const ROADMAP_PATH = 'roadmap/roadmap.md';
export const LEGACY_QUEUE_PATH = 'queue/next.md';

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function parseDate(value) {
  if (!value) return null;
  const ms = Date.parse(value.trim());
  return Number.isNaN(ms) ? null : ms;
}

function parseUpNextTable(content) {
  const sectionMatch = content.match(/## Up next\s*\n([\s\S]*?)(?=\n## |\s*$)/i);
  if (!sectionMatch) return [];

  const lines = sectionMatch[1].split('\n');
  const rows = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || /^\|[\s\-:|]+\|$/.test(trimmed)) continue;
    const cells = trimmed
      .split('|')
      .map(c => c.trim())
      .filter((_, i, arr) => i > 0 && i < arr.length - 1);
    if (cells.length < 3) continue;
    const rank = Number.parseInt(cells[0], 10);
    if (Number.isNaN(rank)) continue;
    rows.push({
      rank,
      item: cells[1] || null,
      source_suggestion: cells[2] || null,
      brief: cells[3]?.replace(/^—$/, '') || cells[3] || null,
    });
  }
  return rows.sort((a, b) => a.rank - b.rank);
}

function parseNowSection(content) {
  const sectionMatch = content.match(/## Now\s*\n([\s\S]*?)(?=\n## |\s*$)/i);
  if (!sectionMatch) {
    return {
      status: null,
      item: null,
      source_suggestion: null,
      brief: null,
      has_handoff: false,
    };
  }

  const section = sectionMatch[1];
  const field = name => section.match(new RegExp(`^${name}:\\s*(.+)$`, 'im'))?.[1]?.trim() || null;
  return {
    status: field('Status'),
    item: field('Item'),
    source_suggestion: field('From suggestion'),
    brief: field('Brief'),
    has_handoff: /### Hand off/i.test(section),
  };
}

export function readRoadmapSummary(roadmapAbs) {
  if (!exists(roadmapAbs)) {
    return { exists: false, path: ROADMAP_PATH };
  }

  const content = fs.readFileSync(roadmapAbs, 'utf8');
  const updatedRaw = content.match(/^Updated:\s*(.+)$/m)?.[1]?.trim() || null;
  const fromSession = content.match(/^From:\s*(.+)$/m)?.[1]?.trim() || null;
  const now = parseNowSection(content);
  const up_next = parseUpNextTable(content);

  return {
    exists: true,
    path: ROADMAP_PATH,
    updated: updatedRaw,
    updated_ms: parseDate(updatedRaw),
    from_session: fromSession,
    now,
    up_next,
    up_next_count: up_next.length,
    top_queued: up_next[0] || null,
    has_active_handoff:
      now.status === 'ready' || now.status === 'in_progress' || now.has_handoff,
  };
}

export function roadmapIsStale(roadmap, latestInsightsMtime) {
  if (!roadmap?.exists) return true;
  if (!latestInsightsMtime) return false;
  if (!roadmap.updated_ms) return true;
  return latestInsightsMtime > roadmap.updated_ms;
}

export function readLegacyQueue(queueAbs) {
  if (!exists(queueAbs)) return null;
  const content = fs.readFileSync(queueAbs, 'utf8');
  const statusMatch = content.match(/^Status:\s*(.+)$/m);
  const briefMatch = content.match(/^Brief:\s*(.+)$/m);
  const insightMatch = content.match(/^Source insight:\s*(.+)$/m);
  return {
    path: LEGACY_QUEUE_PATH,
    status: statusMatch?.[1]?.trim() || 'unknown',
    brief_path: briefMatch?.[1]?.trim() || null,
    source_insight: insightMatch?.[1]?.trim() || null,
  };
}
