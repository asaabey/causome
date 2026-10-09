import fixture from '../../../knowledge/diseases/sle/releases/sle-illustrative-001.json';
import type { ReleaseBundle } from './types';

// CI validates the complete JSON bundle before the application build.
export const illustrativeRelease = fixture as ReleaseBundle;
export default illustrativeRelease;
