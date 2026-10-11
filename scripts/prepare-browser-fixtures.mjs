import { join } from 'node:path';
import { assert, readJSON, writeImmutableJSON } from './curation/io.mjs';

// CI starts without the ignored local literature cache. Seed only the committed
// example passages used to exercise browser exports, never scientific candidates.
assert(process.env.CAUSOME_BROWSER_FIXTURES === '1', 'Enable CAUSOME_BROWSER_FIXTURES=1 explicitly for browser-test input preparation');
assert(process.env.CAUSOME_BUILD_MODE !== 'publication', 'Browser curation fixtures belong to internal preview tests');
const directory = join('curation/workspace/iga-nephropathy/imports', 'browser-fixtures');
const papers = readJSON('curation/examples/iga-source-snapshots.json');
writeImmutableJSON(join(directory, 'papers.json'), papers);
writeImmutableJSON(join(directory, 'provenance.json'), {
  version: 1, sourceKind: 'browser-test-fixture',
  input: 'curation/examples/iga-source-snapshots.json',
  purpose: 'Deterministic browser export tests using committed example passages; no new source checks or scientific approval.',
  cursorAdvanced: false, graphChanged: false,
});
console.log(`Prepared ${papers.length} committed example source fixtures for browser tests.`);
