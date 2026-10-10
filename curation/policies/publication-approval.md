# Scientific review and publication

Milestone 1 is an internal illustrative demo. Preview validation may accept candidate records; it does not authorize scientific publication. The sample release must remain marked illustrative and unreviewed.

For the first public scientific release in Milestone 3:

1. Configure an explicit allowlist of domain reviewers in protected repository publication policy. Until a reviewer is configured, scientific publication remains unavailable.
2. A domain reviewer other than the proposal author verifies every scientific assertion, context, source relationship, therapeutic status, and limitation against directly relevant primary evidence.
3. Generate the map preview and scientific review report from the exact candidate release. For a root release, the report is an initial release note rather than a comparison.
4. Obtain an authenticated repository approval tied to the reviewed commit, candidate revision, content digest, and null base for the initial release. An author-supplied approval field is not evidence of review.
5. Run schema, reference, geometry, accessibility, build, and applicable release checks against the approved content.
6. Finalize a self-contained immutable release and archive the matching deployment artifact. Public release routing must never consume candidate working records.

Changes to scientific or view content invalidate approval. Adding a source, changing therapy metadata, or recalculating an assessment must appear in the reviewed change set. No automated process may approve its own proposal.

Public numerical scores require a separately recorded, approved calibration under PRD Section 8.5. Missing assessments remain null and are labelled “Not assessed”. Keep canonical entity identity separate from disease-context assessments.

The disease-independent root/successor publisher verifies live GitHub review events and the required CI check from a clean default-branch checkout. Scientific proposals cannot change trusted policy, publisher, workflows or frontend files. Changed records require new revision IDs; successors bind the exact current parent. Reviewers may be limited to qualified `diseaseIds`. The reviewer policy is still disabled and empty, so the current candidate cannot be published. See [the Milestone 3 launch procedure](../launch/PUBLICATION.md) for setup, exact approval binding, immutable finalization, acceptance checks and deployment.
