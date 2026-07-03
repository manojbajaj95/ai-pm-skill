/**
 * Roadmap session setup — latest insights + roadmap path for rank-and-brief flow.
 */
import path from 'node:path';
import { ROADMAP_PATH, resolveTopItem } from './lib/roadmap.mjs';
import { noInsightsPayload, setupPlanRoute } from './lib/plan-route.mjs';

const setup = setupPlanRoute(process.argv, {
  positionalKey: 'item',
  positionalFlag: '--item',
});
const {
  args,
  storageRoot,
  latest,
  roadmapAbs,
  roadmap,
  needs_roadmap,
  positional: item,
  insightSessionFields,
} = setup;
const { top_item, top_has_brief } = resolveTopItem(roadmap);

const result = {
  workspace_root: storageRoot,
  cwd: args.cwd,
  item: item || null,
  roadmap_path: ROADMAP_PATH,
  roadmap,
  needs_roadmap,
  top_item,
  top_has_brief,
  ...insightSessionFields,
};

if (!latest) {
  Object.assign(
    result,
    noInsightsPayload(setup, 'Run `/darin insights` first — roadmap ranks the latest suggestions.'),
  );
}

if (args.json) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`Workspace: ${storageRoot}`);
  console.log(`Roadmap: ${roadmapAbs}`);
  if (latest) {
    console.log(`Latest insights: ${path.join(storageRoot, latest.session_dir)}`);
    console.log(`Suggestions: ${latest.insight_files.length}`);
    console.log(`Needs roadmap: ${needs_roadmap}`);
  } else {
    console.log(result.message);
  }
  if (item) console.log(`Item: ${item}`);
}

if (!latest) process.exit(1);
