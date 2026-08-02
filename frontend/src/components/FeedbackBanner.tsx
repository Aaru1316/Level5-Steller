import { useState } from "react";

export function FeedbackBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-brass-500/10 via-brass-500/15 to-ink-800 border border-brass-500/30 p-4 rounded-seal text-xs text-parchment-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brass-500/20 rounded-full text-brass-400 font-bold shrink-0">
          📋
        </div>
        <div>
          <h4 className="font-bold text-brass-300 text-sm">Level 5 — User Feedback & Growth Program</h4>
          <p className="text-ink-300 mt-0.5">
            Tested an escrow? Share your experience in our 2-minute feedback survey. Help us iterate and view live responses!
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
        <a
          href="https://forms.gle/ledger-seal-testnet-feedback"
          target="_blank"
          rel="noreferrer"
          className="flex-1 md:flex-initial text-center bg-brass-500 text-ink-950 font-bold px-3.5 py-1.5 rounded hover:bg-brass-400 transition"
        >
          Take Google Form Survey ↗
        </a>
        <a
          href="https://docs.google.com/spreadsheets/d/ledger-seal-live-responses"
          target="_blank"
          rel="noreferrer"
          className="flex-1 md:flex-initial text-center bg-ink-800 border border-brass-500/30 text-parchment-200 font-medium px-3.5 py-1.5 rounded hover:border-brass-500/60 transition"
        >
          View Live Responses ↗
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-ink-400 hover:text-parchment-200 px-2 py-1 text-base font-bold"
          title="Dismiss banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}
