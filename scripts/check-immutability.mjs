import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { listDiseases } from './curation/diseases.mjs';
import { listPublishedReleases,loadPublishedRelease } from './release-store.mjs';
try {
 const base=process.argv[2];if(!/^[a-f0-9]{40}$/.test(base??''))throw new Error('Supply the full trusted base commit for immutable-file comparison');
 const files=execFileSync('git',['ls-tree','-r','--name-only',base,'knowledge/diseases'],{encoding:'utf8'}).trim().split('\n').filter(path=>/^knowledge\/diseases\/[^/]+\/releases\//.test(path));
 for(const path of files){const original=execFileSync('git',['show',`${base}:${path}`]);if(!existsSync(path)||!original.equals(readFileSync(path)))throw new Error(`Immutable snapshot or receipt changed: ${path}`);}
 for(const profile of listDiseases('knowledge/diseases')){const directory=`knowledge/diseases/${profile.id}`;const releases=listPublishedReleases(directory);if(releases.length||existsSync(`${directory}/current.json`)){const {bundle}=loadPublishedRelease(directory);if(bundle.diseaseId!==profile.id)throw new Error('Store disease differs from registry');}}
 console.log('Immutable snapshots and receipts preserved; every disease lineage is consistent. Current-pointer changes require authenticated publication verification.');
}catch(error){console.error(error.message);process.exitCode=1;}
