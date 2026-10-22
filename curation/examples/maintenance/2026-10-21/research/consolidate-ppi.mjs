import fs from 'node:fs';
import {contentDigest} from '../../../../scripts/validation.mjs';
const d='curation/workspace/maintenance-research/2026-10-21';
const b=JSON.parse(fs.readFileSync('knowledge/diseases/calciphylaxis/candidates/calciphylaxis-appraised-candidate-409c9db87504.json'));
b.id='calciphylaxis-maintenance-overview-20261020';b.revisionId=b.id+'-r1';b.changeSetRevision=b.id;
b.releaseNote='Local maintenance: human circulating pyrophosphate associations with calciphylaxis and short-term mortality. Observational findings do not establish causal deficiency or benefit of PPi-raising therapy. Overview includes the new entity; domain review pending.';
const v=b.mapViews.find(v=>v.id==='view-calciphylaxis-overview');v.revisionId=v.id+'-maintenance-20261020';v.entityIds=b.entities.map(e=>e.id);v.relationshipIds=b.relationships.filter(e=>e.contextId===v.contextId).map(e=>e.id);v.assessmentIds=b.assessments.filter(a=>a.contextId===v.contextId && [...v.entityIds,...v.relationshipIds].includes(a.subjectId)).map(a=>a.id);
const l=b.layouts.find(l=>l.id===v.layoutId);l.revisionId=l.id+'-maintenance-20261020';l.positions.push({entityId:'entity-pyrophosphate',x:1190,y:800});
b.manifest.contentDigest=contentDigest(b);fs.writeFileSync(`${d}/ppi-overview-proposal.json`,JSON.stringify(b,null,2)+'\n');
