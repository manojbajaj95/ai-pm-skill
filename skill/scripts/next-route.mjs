/**
 * Next session setup — latest insights session + roadmap for handoff.
 */
import path from 'node:path';
import {
  LEGACY_QUEUE_PATH,
  ROADMAP_PATH,
  readLegacyQueue,
  resolveActiveItem,
} from './lib/roadmap.mjs';
import { noInsightsPayload, setupPlanRoute } from './lib/plan-route.mjs';

const setup = setupPlanRoute(process.argv, {
  positionalKey: 'override',
  positionalFlag: '--override',
});
const {
  args,
  storageRoot,
  latest,
  roadmapAbs,
  roadmap,
  needs_roadmap,
  positional: override,
  insightSessionFields,
} = setup;

const legacyQueueAbs = path.join(storageRoot, LEGACY_QUEUE_PATH);
const legacy_queue = readLegacyQueue(legacyQueueAbs);
const activeItem = resolveActiveItem(roadmap);
const needs_plan = activeItem && (!activeItem.brief || activeItem.brief === '—');

const result = {
  workspace_root: storageRoot,
  cwd: args.cwd,
  override: override || null,
  roadmap_path: ROADMAP_PATH,
  roadmap,
  legacy_queue,
  needs_roadmap,
  needs_plan,
  active_item: activeItem,
  top_queued: roadmap.top_queued,
  has_active_handoff: roadmap.has_active_handoff,
  ...insightSessionFields,
};

if (!latest) {
  Object.assign(
    result,
    noInsightsPayload(setup, 'Run `/darin insights` first — next works from suggestions and the roadmap.'),
  );
}

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Roadmap: ${roadmapAbs}`);
  if (legacy_queue) console.log(`Legacy queue: ${legacyQueueAbs} (migrate on next)`);
  if (latest) {
    console.log(`Latest insights: ${path.join(storageRoot, latest.session_dir)}`);
    console.log(`Suggestions: ${latest.insight_files.length}`);
    console.log(`Needs roadmap: ${needs_roadmap}`);
  } else {
    console.log(result.message);
  }
  if (override) console.log(`Override: ${override}`);
}

if (!latest) process.exit(1);
