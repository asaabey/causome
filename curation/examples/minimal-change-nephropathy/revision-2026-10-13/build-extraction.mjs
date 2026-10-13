// Builds the papers file and the manual extraction for the 2026-10-13 revision.
// Every quote is an exact passage of the inspected source snapshot.
import { readFileSync, writeFileSync } from 'node:fs';
import { contentDigest } from '../../../../../scripts/validation.mjs';
import { hash } from '../../../../../scripts/curation/io.mjs';
const W = 'curation/workspace/minimal-change-nephropathy/revisions/2026-10-13';
const base = JSON.parse(readFileSync('knowledge/diseases/minimal-change-nephropathy/candidates/minimal-change-nephropathy-candidate-5855e3a9d51f.json', 'utf8'));
const imported = JSON.parse(readFileSync('curation/workspace/minimal-change-nephropathy/imports/import-92446234bc5e3053932a7a57/papers.json', 'utf8'));
const scanned = JSON.parse(readFileSync('curation/workspace/minimal-change-nephropathy/scans/scan-92648b4de56bb6786d52b7f2/papers.json', 'utf8')).filter(p => p.pmid === '41736774');
const papers = [...imported, ...scanned];
for (const p of papers) if (p.flags.length) console.warn(`${p.pmid} flags: ${p.flags}`);
const byPmid = pmid => papers.find(p => p.pmid === pmid);
const check = { checkedBy: 'claude-opus-5-5-agent-source-check', checkedAt: '2026-10-12' };
const abstractOnly = 'Abstract-only agent inspection; independent domain review pending.';
const human = 'context-mcn-overview', exp = 'context-mcn-experimental';
const findings = [];
const add = (id, pmid, f) => findings.push({ id: `mcn-r2-${id}`, paperKey: byPmid(pmid).key, paperDigest: hash(byPmid(pmid)), sourceCheck: check,
  quoteLocation: pmid === '39820038' ? 'PMC full-text research letter body' : 'Europe PMC abstract; Results or Conclusions', ...f });

// Hengel et al., NEJM 2024 (PMID 38804512)
add('nejm-prevalence', '38804512', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'novel',
  text: 'In a multicentre cohort, anti-nephrin autoantibodies were detected in 46 of 105 adults (44%) with MCD, rising to 69% in active MCD without immunosuppressive treatment.',
  quote: 'In the subgroup of patients with active minimal change disease or idiopathic nephrotic syndrome who were not receiving immunosuppressive treatment, the prevalence of antinephrin autoantibodies was as high as 69% and 90%, respectively.',
  studySystem: 'Multicentre cohort of 539 patients (357 adults, 182 children) and 117 controls; serum anti-nephrin assay',
  limitations: [abstractOnly, 'Prevalence is cohort- and assay-dependent; the overall adult MCD figure (46/105, 44%) is lower than the active untreated subgroup.', 'Antibody-negative MCD is not explained by this finding.'],
  distinctFindingRationale: 'Cross-sectional prevalence is a separate result from the longitudinal disease-activity correlation in the same study.' });
add('nejm-activity', '38804512', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'supporting',
  text: 'Anti-nephrin autoantibody levels correlated with disease activity at inclusion and during follow-up.',
  quote: 'At study inclusion and during follow-up, antinephrin autoantibody levels were correlated with disease activity.',
  studySystem: 'Multicentre cohort of adults with MCD/FSGS and children with idiopathic nephrotic syndrome; serial antibody measurements',
  limitations: [abstractOnly, 'Correlation with activity does not by itself establish pathogenicity in humans.'],
  distinctFindingRationale: 'Longitudinal correlation with disease activity is a separate result from the cross-sectional prevalence in the same study.' });
add('nejm-immunization', '38804512', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'contributes_to', causalInterpretation: 'causal', contextId: exp, evidenceType: 'animal_experiment', category: 'novel',
  text: 'Active immunization of mice with recombinant nephrin induced nephrotic syndrome with an MCD-like phenotype, IgG at the slit diaphragm, nephrin phosphorylation and severe podocyte cytoskeletal changes.',
  quote: 'Experimental immunization induced a nephrotic syndrome, a minimal change disease-like phenotype, IgG localization to the podocyte slit diaphragm, nephrin phosphorylation, and severe cytoskeletal changes in mice.',
  studySystem: 'Mice actively immunized with recombinant murine nephrin',
  limitations: [abstractOnly, 'Experimental sufficiency in mice; does not establish the mechanism or its prevalence in every human case.', 'Active immunization with murine nephrin differs from spontaneous human autoimmunity.'] });

// Hengel et al., JCI 2025 (PMID 39820038) — research letter, full text inspected
const jciLimits = ['IgG from a single patient was transferred to one rabbit, with one control rabbit; total IgG rather than purified nephrin-specific IgG was transferred.', 'Experimental induction in rabbits does not establish the mechanism in every human case or in antibody-negative disease.', 'Supplementary figures not inspected; independent domain review pending.'];
add('jci-effacement', '39820038', { subject: 'entity-anti-nephrin', object: 'entity-effacement', predicate: 'contributes_to', causalInterpretation: 'causal', contextId: exp, evidenceType: 'animal_experiment', category: 'novel',
  text: 'Passive transfer of IgG from an anti-nephrin-positive MCD patient to a rabbit caused proteinuria and podocyte foot-process effacement without electron-dense deposits, absent in the control rabbit.',
  quote: 'Further morphological workup revealed moderate podocyte foot process effacement in the absence of electron-dense deposits in the anti-nephrin rabbit by electron microscopy',
  studySystem: 'New Zealand White rabbits given purified human IgG from plasma-exchange fluid of an anti-nephrin-positive MCD patient or control IgG; 5-day observation', limitations: jciLimits });
add('jci-phosphorylation', '39820038', { subject: 'entity-anti-nephrin', object: 'entity-nephrin', predicate: 'stimulates', causalInterpretation: 'mechanistic', contextId: exp, evidenceType: 'animal_experiment', category: 'novel',
  text: 'Patient-derived anti-nephrin IgG bound glomerular nephrin and strongly increased nephrin tyrosine phosphorylation in the recipient rabbit.',
  quote: 'Nephrin tyrosine phosphorylation strongly increased in response to human anti-nephrin autoantibodies',
  studySystem: 'Rabbit passive-transfer model; glomerular nephrin immunoprecipitation and phosphorylation analysis', limitations: [...jciLimits, 'The downstream sequence from phosphorylation to cytoskeletal change and effacement was not established.'] });

// Chinese adult cohort, Kidney Int 2025 (PMID 40147632)
add('china-longitudinal', '40147632', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'supporting',
  text: 'In 596 biopsy-diagnosed adult Chinese patients with MCD or primary FSGS, anti-nephrin antibodies fell during clinical remission and reappeared before proteinuria relapse.',
  quote: 'Longitudinal analysis revealed that anti-nephrin antibodies significantly decreased during clinical remission, while they reappeared preceding proteinuria relapse.',
  studySystem: '596 adults (436 MCD, 160 primary FSGS); ELISA for anti-nephrin IgG and IgM with antigen-inhibition and Western blot validation',
  limitations: [abstractOnly, 'Mixed MCD and primary FSGS cohort; MCD-specific longitudinal estimates are not separated in the abstract.', 'Different assay (ELISA, including IgM) from the multicentre immunoprecipitation-based cohort; prevalence is assay-dependent.'] });

// Bi-centric study, Annals of Medicine 2026 (PMID 42015820)
add('ann-th2', '42015820', { subject: 'entity-anti-nephrin', object: 'entity-il13', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'novel',
  text: 'Anti-nephrin-positive MCD patients had a predominant IgG4 subclass with elevated serum IL-4 and IL-13 and an increased IL-4/IFN-gamma ratio, consistent with Th2 skewing.',
  quote: 'anti-nephrin antibody-positive MCD patients displayed a predominant IgG4 subclass alongside elevated serum IL-4 and IL-13 levels and an increased IL-4/IFN-γ ratio, supporting a Th2-skewed immune status.',
  studySystem: '60 patients with biopsy-confirmed MCD (including children), 125 other glomerular diseases, 40 controls; affinity capture-elution ELISA and Olink cytokine proteomics',
  limitations: [abstractOnly, 'Cross-sectional association; does not show that Th2 cytokines drive antibody production or podocyte injury.', 'Small single-disease sample; links humoral and Th2 findings without establishing their sequence.'] });
add('ann-activity', '42015820', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'supporting',
  text: 'Anti-nephrin autoantibodies were detected in 50% of 60 MCD patients and 70% of those in active phase; levels correlated positively with proteinuria and inversely with serum albumin.',
  quote: 'Anti-nephrin levels positively correlated with proteinuria, and inversely with serum albumin and estimated glomerular filtration rate.',
  studySystem: '60 patients with biopsy-confirmed MCD across disease stages; affinity capture-elution ELISA',
  limitations: [abstractOnly, 'Cross-sectional correlations; assay-dependent prevalence.'] });

// Hengel et al., KI Reports 2026 (PMID 41736774; already cited for the plasmablast finding)
add('kir-steroid', '41736774', { subject: 'entity-anti-nephrin', object: 'entity-nephrotic', predicate: 'is_associated_with', causalInterpretation: 'association', contextId: human, evidenceType: 'human_observational', category: 'supporting',
  text: 'In 17 therapy-naive adults with biopsy-proven MCD, 12 were anti-nephrin positive; all 12 reached complete remission with undetectable antibodies after 8 weeks of steroids.',
  quote: 'All 12 patients (100%) positive for anti-nephrin antibodies achieved complete remission with no anti-nephrin antibodies detectable after 8 weeks of steroid treatment (t 1 ).',
  studySystem: 'Prospective sampling of 17 adults with newly diagnosed MCD at diagnosis and after 8 weeks of steroids; immunoprecipitation assay and B-cell flow cytometry',
  limitations: [abstractOnly, 'Small uncontrolled cohort; antibody clearance and remission are concurrent and do not show that antibody reduction alone explains treatment benefit.', 'The authors’ statement that this explains the steroid response is not adopted as a causal claim.'],
  distinctFindingRationale: 'Antibody clearance with remission is a separate result from the plasmablast comparison already entered from this study.' });

// Lai et al., JASN 2007 (PMID 17429054)
const ratLimits = [abstractOnly, 'Experimental sufficiency of IL-13 overexpression in rats; does not establish that IL-13 is necessary or independently causal in human MCD.'];
add('rat-il13-effacement', '17429054', { subject: 'entity-il13', object: 'entity-effacement', predicate: 'contributes_to', causalInterpretation: 'causal', contextId: exp, evidenceType: 'animal_experiment', category: 'novel',
  text: 'IL-13 overexpression in rats produced albuminuria, hypoalbuminemia and up to 80% podocyte foot-process fusion without significant light-microscopic glomerular change.',
  quote: 'electron microscopy showed up to 80% of podocyte foot process fusion',
  studySystem: 'Wistar rats with IL-13 overexpressed by in vivo electroporation (n = 41) versus controls (n = 17)', limitations: ratLimits });
add('rat-il13-nephrin', '17429054', { subject: 'entity-il13', object: 'entity-nephrin', predicate: 'inhibits', causalInterpretation: 'mechanistic', contextId: exp, evidenceType: 'animal_experiment', category: 'novel',
  text: 'IL-13 overexpression in rats downregulated glomerular nephrin, podocin and dystroglycan and upregulated B7-1 (CD80).',
  quote: 'Glomerular gene expression was significantly upregulated for B7-1, IL-4Ralpha, and IL-13Ralpha2 but downregulated for nephrin, podocin, and dystroglycan.',
  studySystem: 'Wistar rats with IL-13 overexpression; glomerular real-time PCR and immunofluorescence', limitations: [...ratLimits, 'Expression changes do not establish whether nephrin loss is upstream of effacement in this model.'] });

const extraction = { version: 1, diseaseId: base.diseaseId, baseReleaseId: base.id, baseContentDigest: contentDigest(base), mode: 'manual', promptVersion: 'causome-extraction-v1', modelVersion: 'manual-source-check-v1',
  newEntities: [{ id: 'entity-il13', label: 'IL-13', entityClass: 'cytokine', description: 'Th2 cytokine proposed as a candidate MCD mediator; experimental sufficiency in rats, human association only.', synonyms: ['Interleukin-13'], externalIds: [] }],
  findings };
writeFileSync(`${W}/papers.json`, JSON.stringify(papers, null, 2) + '\n');
writeFileSync(`${W}/extraction.json`, JSON.stringify(extraction, null, 2) + '\n');
console.log(`${findings.length} findings, ${papers.length} papers`);
