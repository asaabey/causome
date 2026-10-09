# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Source-linked SLE candidate with 21 entities, 27 relationships, 40 claims and three therapies, including study systems, source locations and qualifying or negative evidence. Human domain review remains pending and all scores remain unassessed.
- Focused mechanism views, entity focus controls, therapy inspection and a complete static evidence outline accessible without JavaScript.
- Review packet and candidate validation tests covering provenance, therapy integrity and rejection of publication before domain review.

### Changed

- The atlas now displays the Milestone 2 candidate while preserving the original illustrative snapshot for regression checks.
- Extended the snapshot contract and validator to distinguish source checking from domain approval and verify therapy status sources and claim references.

### Deprecated

### Removed

### Fixed

- Clip graph connections to receptor and substrate shapes and route downstream feedback around the focused circuit.

### Security

- Ignore private key, credential and secret configuration files alongside existing environment-file exclusions.
