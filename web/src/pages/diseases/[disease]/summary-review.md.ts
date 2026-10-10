import { atlas } from '../../../data/atlas';
import { summaryReviewText } from '../../../../../scripts/disease-summary.mjs';
export function getStaticPaths() { return atlas.filter(item => item.bundle.scientificSummary).map(item => ({ params: { disease: item.profile.id }, props: { bundle: item.bundle } })); }
export function GET({ props }: { props: { bundle: (typeof atlas)[number]['bundle'] } }) { return new Response(summaryReviewText(props.bundle), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } }); }
