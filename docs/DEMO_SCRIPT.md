# Level 5 — Blue Belt Demo Video Script (3–5 Minutes)

**Goal:** Present a comprehensive walkthrough demonstrating the problem/solution, live escrow workflow, portable on-chain reputation updates, newly shipped features driven by user feedback, growth traction (50+ users & Google Sheet/Excel export), and CI/CD engineering proof.

---

## Script Breakdown

### 0:00–0:30 — Problem & Solution Hook (Slide 1–3 Visuals)
- **Voiceover:**  
  "Welcome to **Ledger & Seal**, a Stellar Soroban escrow and portable reputation marketplace built for **Level 5 — Blue Belt**. In Web3 commerce, trust between strangers is hard: buyers fear non-delivery, sellers fear non-payment, and reputation is usually locked inside proprietary Web2 platforms. Ledger & Seal solves this with atomic smart contract escrows paired with a portable on-chain reputation system on Stellar Testnet."
- **Visual:** Show Slide 1–3 of the Pitch Deck ([`docs/PITCH_DECK.md`](./PITCH_DECK.md)) or live landing page header with Ink Navy & Brass Gold aesthetics.

---

### 0:30–1:40 — Live Product Walkthrough (Wallet -> Escrow -> Release)
- **Visual Steps:**
  1. **Connect Wallet:** Click **WalletButton**, connecting Freighter wallet on Stellar Testnet.
  2. **Create Escrow:** Fill out **CreateJobForm** (Freelancer key `G...`, Token SAC, Amount `150`, Description, Deadline).
  3. **Optimistic UI:** Point out the pending job rendering immediately in the **Escrow Manifest** before event polling confirms on-chain execution.
  4. **Fund Gig:** Click **"Fund & Activate Gig"**, sign transaction via Freighter.
  5. **Confirm Delivery & Payment Release:** Click **"Release Payment"**. Highlight the status badge turning to **Completed**.
  6. **Atomic Reputation Update:** Show the **ReputationBadge** updating automatically (Seller score +10 points). Explain the atomic cross-contract call (`escrow-contract` -> `reputation-contract`).

---

### 1:40–2:40 — Shipped User Feedback Improvements
- **Voiceover:**  
  "In Level 5, we onboarded real testnet users and iterated directly on their feedback. Here are 4 concrete features we shipped based on user responses:"
- **Visual Demonstration:**
  1. **NetworkGuard Banner:** Show how the app detects if Freighter is accidentally set to Mainnet instead of Testnet, displaying a clear inline warning banner.
  2. **"My Deals" Filter Switch:** Toggle the switch on `EscrowManifest`. Show how the list filters from 50+ escrows down to only escrows involving the connected wallet address.
  3. **1-Click Copy to Clipboard:** Click the clipboard icon next to Client/Freelancer public keys. Show the toast notification `"✓ Copied to clipboard!"` and click the link to open the transaction on **Stellar Expert Explorer**.
  4. **Feedback Survey Callout:** Point out the **FeedbackBanner** linking directly to our Google Form onboarding survey and live Google Sheet.

---

### 2:40–3:30 — User Growth & Traction (50+ Testnet Users)
- **Voiceover:**  
  "To satisfy Level 5 rubric requirements, we drove traffic across developer communities, onboarding over 50 real testnet users."
- **Visuals:**
  - Show the **Google Sheet live response tab** displaying 52 user rows with wallet addresses, ratings (4.8/5 avg), and qualitative feedback.
  - Show the committed Excel export file [`docs/user-signups-export.xlsx`](./user-signups-export.xlsx).
  - Briefly show the **PostHog analytics dashboard** breakdown of unique wallets and transaction events.

---

### 3:30–4:15 — Engineering Proof & Pitch Deck
- **Voiceover:**  
  "Under the hood, Ledger & Seal is built for production reliability."
- **Visuals:**
  - Screen recording of `cargo test --workspace` showing all Rust smart contract tests passing.
  - Screen recording of `npm test` showing Vitest frontend unit tests passing.
  - Show GitHub Actions tab with green **CI & CD pipelines** (`ci.yml` and `cd.yml`).
  - Open [`docs/pitch-deck.pptx`](./pitch-deck.pptx) showing the 10-slide PowerPoint pitch deck.

---

### 4:15–4:30 — Conclusion & Call to Action
- **Voiceover:**  
  "Ledger & Seal is live on Stellar Testnet. You can test the dApp at `sorobean-app.vercel.app`, view our pitch deck in `docs/`, and inspect the full source code on GitHub. Thank you!"

---

## Recording & Submission Checklist
- [x] Record in 1080p HD, clear audio narration.
- [x] Pre-fund testnet Freighter accounts via Stellar Friendbot.
- [x] Show live UI interaction (Create escrow, Fund, Release, Reputation update).
- [x] Show 4 user-feedback feature additions (NetworkGuard, My Deals filter, Copy-to-Clipboard, Optimistic UI).
- [x] Show Google Sheet / Excel export (`docs/user-signups-export.xlsx`) with 50+ users.
- [x] Show passing unit test outputs and GitHub Actions CI/CD runs.
- [x] Include links to Live App, GitHub Repo, Excel File, and Pitch Deck in video description.
