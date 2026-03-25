# Demo Script: Nclusion Sports Betting Platform

Target duration: 8-10 minutes. Each step has talking points and what the evaluator should see.

---

## Step 1: The Problem (30 seconds)

**Talking points:**
- Sports betting demand already exists in Haiti — mostly through informal, untraceable channels.
- Users face: no payout guarantee, no receipts, no transparency.
- Mobile infrastructure: low-end Android phones, 2G/3G, intermittent connectivity, daily data budgets.

**Show:** Nothing on-screen. This is the verbal setup.

---

## Step 2: The Product (60 seconds)

**Talking points:**
- We built a mobile-first betting app that feels like a fintech product, not a crypto app.
- Blockchain handles escrow and settlement behind the scenes — the user never sees it.
- Haitian Creole by default, optimized for low bandwidth.

**Show:** App launch → home screen loads from cache. Point out:
- Nclusion branding (gold accent, dark theme)
- Haitian Creole UI
- Balance breakdown: Available / In active bets / Pending settlement
- Top matches with current odds
- Connectivity banner showing "Synced"

---

## Step 3: Browse Matches (45 seconds)

**Talking points:**
- Real football fixtures from a live odds provider.
- Compact payloads — the match list is under 5KB for 20 matches.
- Data cached locally for offline access.

**Show:** Scroll through match list → tap into a match detail. Point out:
- Teams, kick-off time, match status
- Three outcome options (Home / Draw / Away) with decimal odds
- Odds freshness indicator

---

## Step 4: Place a Bet (90 seconds)

**Talking points:**
- User selects an outcome, enters a stake, sees the potential payout.
- One confirmation screen with clear stake, odds, payout, and balance impact.
- No wallet creation, no seed phrases, no gas fees visible anywhere.

**Show:**
1. Tap an outcome (e.g., Home win at 2.10)
2. Enter stake (e.g., 500 HTGN)
3. Confirmation screen shows: stake 500, odds 2.10, payout 1,050, balance after 1,500 → 1,000
4. Tap "Konfime pari" (Confirm bet)
5. Status changes: Queued → Processing → Confirmed

**Key moment:** Point out that the user just placed a bet on Solana without knowing it.

---

## Step 5: Status Transitions (45 seconds)

**Talking points:**
- The app shows explicit status at every stage. No false finality.
- "Processing" means the transaction is on-chain but not confirmed.
- "Confirmed" means chain confirmation received — funds are escrowed.

**Show:** Open the bet from history. Point out:
- Status chip (green "Confirmed")
- Balance now shows: Available 1,000 / In active bets 500

---

## Step 6: Settlement (90 seconds)

**Talking points:**
- Match ends. Settlement service ingests the result from the odds provider.
- Settlement transaction executes on Solana devnet — pays the winner from escrow.
- Balance updates automatically.

**Show:**
1. Trigger settlement (via operator dashboard or backend)
2. Bet status changes: Confirmed → Pending settlement → Won
3. Balance updates: In active bets 500 → 0, Available jumps to 2,050
4. Point out the green "Genyen" (Won) status chip

---

## Step 7: Receipt and Proof (45 seconds)

**Talking points:**
- Every bet has a receipt with plain-language summary.
- For transparency: an optional "Advanced proof" section shows the Solana transaction signature and settlement proof.
- This is how we build trust — proof is available, but never forced.

**Show:** Tap into the settled bet receipt. Point out:
- Match, selection, stake, payout, status, timestamps
- Expand "Advanced proof" section
- Transaction signature, settlement signature

---

## Step 8: Offline Behavior (60 seconds)

**Talking points:**
- This app is designed for 200kbps and frequent disconnections.
- Cached data keeps the app useful even without network.
- Users can draft bets offline — they're submitted and revalidated when connectivity returns.

**Show:**
1. Toggle airplane mode (or simulate network loss)
2. Connectivity banner changes to "Òfliy" (Offline)
3. Browse cached matches — freshness label shows
4. View cached balance and bet history
5. Start a bet draft — shows "Pa soumèt" (Not submitted)
6. Restore network — draft revalidates and submits

---

## Step 9: Operator Dashboard (60 seconds)

**Talking points:**
- A support operator can look up any bet and see the full lifecycle.
- Transaction signatures link to Solana explorer.
- Disputed matches can be held for manual review before settlement.

**Show:** Open operator dashboard in browser. Point out:
- Search by bet ID or user
- Full bet lifecycle with timestamps
- Transaction signature with copy button
- Settlement audit view for the match
- Manual hold flag toggle

---

## Step 10: Architecture Summary (30 seconds)

**Talking points:**
- Solana is used only for the trust-critical path: escrow and settlement.
- Everything else — odds, caching, UX, support — is off-chain.
- This is a product designed for a real market, not a chain demo.

**Show:** Nothing on-screen. Close with the positioning:

> "A low-bandwidth, Android-first sportsbook that uses Solana only for escrow and settlement, while making blockchain invisible to the end user."

---

## Acceptance Checklist

Before the demo, verify ALL of the following:

- [ ] App launches and shows localized home screen
- [ ] Match list loads with real odds
- [ ] Bet placement flow completes (slip → confirm → status transitions)
- [ ] Bet confirmed on Solana devnet
- [ ] Balance updates correctly after placement
- [ ] Settlement executes and bet shows Won/Lost
- [ ] Balance updates correctly after settlement
- [ ] Receipt shows all fields including advanced proof
- [ ] Offline mode works (cached browsing, draft bets, connectivity banner)
- [ ] Operator dashboard shows bet lookup and settlement audit
- [ ] All UI text in Haitian Creole (no English fallbacks)
- [ ] No crashes or ANRs during the full flow
