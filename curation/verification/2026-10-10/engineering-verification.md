# Local engineering verification

These reports measure local candidate or synthetic maps; they are not scientific approval, actual held-out model evaluations, human usability results or production-launch acceptance. Each JSON retains runner/browser, network/CPU settings, fixture identity, bundle inventory and raw measurements.

Budgets: median LCP ≤2,500 ms; keyboard readiness ≤5,000 ms; hydrated inspector response ≤200 ms across 20 selections. Five cold-cache navigations are measured per viewport.

| Fixture / viewport | LCP | Keyboard readiness | Inspector |
| --- | --- | --- | --- |
| atlas / desktop | 436 ms | 2226 ms | 42.1 ms |
| atlas / mobile | 432 ms | 2220 ms | 41.4 ms |
| stress / desktop | 472 ms | 2641 ms | 167.7 ms |
| stress / mobile | 456 ms | 2642 ms | 166.6 ms |

The stress fixture has 200 entities and 400 relationships, including grouped and fully expanded views. The ordinary local build excludes its testing route. Reports bind their measured fixtures and generated bundle inventories; changes require applicable re-verification before publishing an approved artifact.

See ../../../PROGRESS.md for all milestone gates and ./checks.json for local check results.
