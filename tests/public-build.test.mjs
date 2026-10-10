import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { contentDigest, collections } from '../scripts/validation.mjs';
import { reviewBinding, sha256 } from '../scripts/github-approval.mjs';
import { storeRootRelease, storeSuccessorRelease } from '../scripts/release-store.mjs';

test('public static build uses the immutable root, correct subpath links and reviewed labels; an absent root fails closed', t => {
  const temporary = mkdtempSync(join(tmpdir(), 'causome-public-build-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const bundle = JSON.parse(readFileSync('knowledge/diseases/sle/candidates/sle-curated-candidate-001.json', 'utf8'));
  bundle.formatVersion = '0.3.0'; bundle.manifest.schemaVersion = '0.3.0'; bundle.id = 'sle-synthetic-build-test'; bundle.status = 'approved'; bundle.title = 'Synthetic public build fixture'; bundle.releaseNote = 'Synthetic initial release note for build verification only.';
  for (const name of collections) for (const record of bundle[name]) record.status = 'approved';
  for (const claim of bundle.claims) {
    claim.verification = 'reviewed'; claim.reviewDisposition = { decision: 'accepted', reviewerId: 'synthetic-reviewer', reviewedAt: '2026-10-10' };
  }
  bundle.manifest.contentDigest = contentDigest(bundle);
  const store = join(temporary, 'store');
  storeRootRelease(store, bundle, { version: 1, ...reviewBinding(bundle), reviewedCommit: 'a'.repeat(40), frontendCommit: 'b'.repeat(40), policyDigest: sha256({ synthetic: true }), approvals: [{ eventId: 1 }] });
  const rootBundle = structuredClone(bundle);
  bundle.id='sle-synthetic-successor-test';bundle.revisionId='sle-synthetic-successor-test-r1';bundle.parentReleaseId=rootBundle.id;bundle.parentContentDigest=rootBundle.manifest.contentDigest;bundle.manifest.contentDigest=contentDigest(bundle);
  storeSuccessorRelease(store,bundle,{version:1,...reviewBinding(bundle),reviewedCommit:'a'.repeat(40),frontendCommit:'b'.repeat(40),policyDigest:sha256({synthetic:true}),approvals:[{eventId:1}]});
  const output = join(temporary, 'output');
  const build = releaseStore => execFileSync('pnpm', ['--filter', '@causome/web', 'exec', 'astro', 'build', '--outDir', output], {
    cwd: resolve('.'), env: { ...process.env, CAUSOME_BUILD_MODE: 'publication', CAUSOME_BASE_PATH: '/causome', CAUSOME_RELEASE_STORE: releaseStore }, stdio: 'pipe', timeout: 60_000,
  });
  build(store);
  const metadata = JSON.parse(readFileSync(join(output, 'release.json'), 'utf8'));
  assert.equal(metadata.mode, 'publication'); assert.equal(metadata.releaseId, bundle.id); assert.equal(metadata.contentDigest, bundle.manifest.contentDigest);
  const disease = readFileSync(join(output, 'diseases/sle/index.html'), 'utf8');
  assert.match(disease, /Reviewed/);
  assert(existsSync(join(output,`diseases/sle/releases/${rootBundle.id}/index.html`)));
  assert(existsSync(join(output,`diseases/sle/releases/${bundle.id}/index.html`)));
  assert(!existsSync(join(output,'curation/index.html')));assert(!existsSync(join(output,'testing/stress/index.html')));assert(!existsSync(join(output,'diseases/sle/candidates'))); assert.ok(disease.includes(bundle.releaseNote));
  assert.ok(disease.includes('href="/causome/methodology/"'));
  assert.ok(!disease.includes('noindex, nofollow')); assert.ok(!disease.includes('Review pending'));
  assert.throws(() => build(join(temporary, 'absent-store')), error => error.status !== 0 && error.stderr.toString().includes('current.json'));
});
