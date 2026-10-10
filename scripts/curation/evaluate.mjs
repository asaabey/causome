import { assert, hash, validDate } from './io.mjs';

const rate = (numerator, denominator) => ({ numerator, denominator, value: denominator ? numerator / denominator : 0 });
const normalize = value => typeof value === 'string' ? value.normalize('NFKC').trim().toLowerCase() : JSON.stringify(value);
export function evaluateExtraction(reference, predictions, adjudication) {
  assert(reference.version === 1 && typeof reference.id === 'string' && Array.isArray(reference.cases), 'Invalid held-out reference set');
  assert(predictions.version === 1 && predictions.referenceId === reference.id && Array.isArray(predictions.cases) && predictions.promptVersion && predictions.modelVersion, 'Invalid prediction envelope');
  assert(adjudication.version === 1 && adjudication.predictionDigest === hash(predictions) && adjudication.reviewerId?.trim() && validDate(adjudication.reviewedAt) && Array.isArray(adjudication.cases), 'Entailment adjudication must bind the exact predictions and identify its reviewer');
  const errors = [], referenceIndex = new Map(), predictionIndex = new Map(), judgements = new Map();
  for (const item of reference.cases) {
    assert(item.id && !referenceIndex.has(item.id) && item.studyFamilyId && item.split === 'held-out', 'Reference cases must be unique and held out by study family');
    assert(typeof item.insufficientEvidence === 'boolean' && (item.insufficientEvidence || (item.claim && ['subjectId', 'objectId', 'predicate', 'polarity'].every(key => typeof item.claim[key] === 'string') && item.claim.context && typeof item.claim.context === 'object')), 'Reference claim/context is incomplete');
    referenceIndex.set(item.id, item);
  }
  for (const item of predictions.cases) { assert(item.id && !predictionIndex.has(item.id), 'Duplicate prediction case'); predictionIndex.set(item.id, item); }
  for (const item of adjudication.cases) { assert(item.id && !judgements.has(item.id) && typeof item.citationEntailed === 'boolean' && typeof item.unsupportedScoreChange === 'boolean', 'Invalid or duplicate reviewer adjudication'); judgements.set(item.id, item); }
  const developmentFamilies = new Set(reference.developmentStudyFamilies ?? []);
  const allFamilies = new Set(reference.cases.map(item => item.studyFamilyId));
  if ([...allFamilies].some(id => developmentFamilies.has(id))) errors.push('Study/dataset leakage between development and held-out data');
  const sufficient = reference.cases.filter(item => !item.insufficientEvidence);
  const families = new Set(sufficient.map(item => item.studyFamilyId));
  const associative = sufficient.filter(item => item.claim?.predicate === 'is_associated_with');
  const qualifying = sufficient.filter(item => ['qualifying', 'contradicting'].includes(item.category));
  const insufficient = reference.cases.filter(item => item.insufficientEvidence);
  if (sufficient.length < 100 || families.size < 30 || associative.length < 20 || qualifying.length < 20 || insufficient.length < 20) errors.push('Held-out coverage needs 100 claims, 30 study families, 20 associative, 20 qualifying/contradictory and 20 separate insufficient-evidence cases');
  const extracted = predictions.cases.filter(item => item.claim && !item.abstained);
  let correct = 0, directions = 0, contexts = 0, entailed = 0, qualifyingFound = 0, abstentions = 0, escalations = 0;
  const carriesScores = value => value && typeof value === 'object' && Object.entries(value).some(([key, nested]) => /score|confidence|weight|rating|leverage/i.test(key) || carriesScores(nested));
  const unsupportedScores = predictions.cases.filter(item => carriesScores(item) || judgements.get(item.id)?.unsupportedScoreChange).length;
  for (const predicted of extracted) {
    const expected = referenceIndex.get(predicted.id), decision = judgements.get(predicted.id);
    if (!decision) errors.push(`Missing entailment adjudication: ${predicted.id}`);
    if (decision?.citationEntailed) entailed++;
    if (!expected || expected.insufficientEvidence) continue;
    const endpoints = claim => [normalize(claim.subjectId), normalize(claim.objectId)];
    const associative = expected.claim.predicate === 'is_associated_with';
    const endpointMatch = associative ? endpoints(expected.claim).sort().join('|') === endpoints(predicted.claim).sort().join('|') : endpoints(expected.claim).join('|') === endpoints(predicted.claim).join('|');
    const match = endpointMatch && expected.claim.predicate === predicted.claim.predicate;
    const directionMatch = match && expected.claim.polarity === predicted.claim.polarity && (!predicted.claim.directionality || predicted.claim.directionality === (associative ? 'symmetric' : 'directed'));
    const contextMatch = Object.entries(expected.claim.context).every(([key, value]) => normalize(predicted.claim.context?.[key]) === normalize(value));
    if (directionMatch && contextMatch && expected.category === predicted.category) correct++;
    if (!associative && directionMatch) directions++;
    if (associative && (predicted.claim.predicate !== 'is_associated_with' || (predicted.claim.causalInterpretation && predicted.claim.causalInterpretation !== 'association') || predicted.claim.directionality === 'directed')) escalations++;
    if (contextMatch) contexts++;
    if (directionMatch && contextMatch && ['qualifying', 'contradicting'].includes(expected.category) && predicted.category === expected.category) qualifyingFound++;
  }
  // Missing outputs remain failures in recall, context and direction denominators.
  const directedExpected = sufficient.filter(item => item.claim.predicate !== 'is_associated_with').length;
  for (const expected of insufficient) if (predictionIndex.get(expected.id)?.abstained === true) abstentions++;
  const metrics = { precision: rate(correct, extracted.length), recall: rate(correct, sufficient.length), directionPolarity: rate(directions, directedExpected), context: rate(contexts, sufficient.length), citationEntailment: rate(entailed, extracted.length), qualifyingRecall: rate(qualifyingFound, qualifying.length), abstention: rate(abstentions, insufficient.length) };
  const thresholds = { precision: .95, recall: .85, directionPolarity: .95, context: .90, citationEntailment: .95, qualifyingRecall: .90, abstention: .90 };
  for (const [key, threshold] of Object.entries(thresholds)) if (metrics[key].value < threshold) errors.push(`${key} below ${threshold * 100}%`);
  if (escalations) errors.push('Association-to-causation escalation detected');
  if (unsupportedScores) errors.push('Unsupported score change detected');
  return { version: 1, evaluatorVersion: 'causome-extraction-evaluation-v1', referenceId: reference.id, referenceDigest: hash(reference), predictionDigest: hash(predictions), promptVersion: predictions.promptVersion, modelVersion: predictions.modelVersion,
    adjudicationDigest: hash(adjudication), sampleSize: reference.cases.length, studyFamilies: families.size, metrics, thresholds, associationEscalations: escalations, unsupportedScoreChanges: unsupportedScores, valid: !errors.length, launchEligible: !errors.length && reference.synthetic !== true, errors };
}

export function evaluateSearch(reference, retrievedIds) {
  assert(reference.version === 1 && Array.isArray(reference.records) && Array.isArray(retrievedIds), 'Invalid search evaluation');
  const ids = new Set();
  for (const item of reference.records) { assert(item.id && !ids.has(item.id) && typeof item.relevant === 'boolean', 'Search labels require unique IDs and boolean relevance'); ids.add(item.id); }
  const relevant = reference.records.filter(item => item.relevant), irrelevant = reference.records.filter(item => !item.relevant);
  const retrieved = new Set(retrievedIds), recall = rate(relevant.filter(item => retrieved.has(item.id)).length, relevant.length);
  const errors = [];
  if (relevant.length < 30 || irrelevant.length < 30) errors.push('Search evaluation needs at least 30 relevant and 30 irrelevant publications');
  if (recall.value < .9) errors.push('Relevant-publication retrieval recall below 90%');
  return { version: 1, evaluatorVersion: 'causome-search-evaluation-v1', referenceId: reference.id, referenceDigest: hash(reference), responseDigest: hash(retrievedIds), recall, falsePositives: irrelevant.filter(item => retrieved.has(item.id)).map(item => item.id), valid: !errors.length, launchEligible: !errors.length && reference.synthetic !== true, errors };
}
