# Success Metrics: Demo and MVP

---

## Demo Success Metrics

These define "demo complete" from the evaluator's perspective. Every metric must pass before presenting.

| Metric | Target | How to verify |
|--------|--------|--------------|
| End-to-end bet flow | Completes reliably in < 60 seconds | Run demo script Step 4-6 three times |
| Match browse to bet confirmation | Completes on constrained Android emulator | Android 8 / 2GB RAM emulator, no crashes or ANRs |
| Full lifecycle visible | Draft → Queued → Processing → Confirmed → Settled → Won/Lost | Observe status transitions during demo |
| Offline behavior coherent | Cache browsing, draft bets, reconnect revalidation all work | Demo script Step 8 with airplane mode |
| Receipts readable | All fields populated, advanced proof expandable | Verify receipt after settlement |
| Localization complete | No English fallback strings in Creole mode | Full app walkthrough in Creole |
| Operator tooling functional | Bet lookup, settlement audit, hold flag all work | Demo script Step 9 |
| Balance accuracy | Available / Reserved / Pending settlement all correct after each transition | Check balance after placement, settlement, and cancellation |

---

## MVP Product Metrics

If the product were to go beyond demo into pilot, these are the metrics that matter.

| Metric | Target | Measurement |
|--------|--------|-------------|
| First session to first bet completion rate | > 60% | Count users who place a bet in their first session |
| Bet submission success rate | > 95% | Successful submissions / total attempts |
| Duplicate submission prevention rate | 100% | Zero duplicate bets on-chain from retries |
| Settlement success rate | > 99% | Successful settlements / total settlement attempts |
| Time from match result to visible settlement | < 5 minutes | Timestamp delta: result ingestion → user sees "Won/Lost" |
| Support incidents per 100 settled bets | < 2 | Manual investigation count / settled bet count |
| Cache hit rate for match browsing | > 80% | Requests served from local cache / total requests |
| App startup to first meaningful paint | < 3 seconds | Measured on Android 8 / 2GB RAM emulator |

---

## Production Metrics (Phase 4-5)

For reference only — not required for demo.

| Metric | Target |
|--------|--------|
| Uptime per service | > 99.5% |
| RPC failover recovery time | < 10 seconds |
| Reconciliation mismatch rate | < 0.1% |
| Abuse detection precision | > 90% (low false positives) |
| Operator dispute resolution time | < 24 hours |
