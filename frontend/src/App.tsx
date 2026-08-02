import { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useJobs } from "./hooks/useJobs";
import { WalletButton } from "./components/WalletButton";
import { CreateJobForm } from "./components/CreateJobForm";
import type { JobFormData } from "./components/CreateJobForm";
import { JobList } from "./components/JobList";
import type { JobItem } from "./components/JobList";
import { NetworkGuard } from "./components/NetworkGuard";
import { FeedbackBanner } from "./components/FeedbackBanner";
import {
  callContractMethod,
  ESCROW_CONTRACT_ID,
  SOROBAN_RPC_URL,
} from "./lib/soroban";
import { Address, nativeToScVal } from "@stellar/stellar-sdk";

export default function App() {
  const wallet = useWallet();
  const { address, sign } = wallet;
  const { jobs, loading, error, refreshJobs } = useJobs();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<string | null>(null);
  const [optimisticJobs, setOptimisticJobs] = useState<JobItem[]>([]);

  // Helper to clear alerts after a timeout
  const setTimedAlerts = (successMsg: string | null, errorMsg: string | null) => {
    setTxSuccess(successMsg);
    setTxError(errorMsg);
    setTimeout(() => {
      setTxSuccess(null);
      setTxError(null);
    }, 8000);
  };

  const handleCreateJob = async (data: JobFormData) => {
    if (!address) return;
    setIsSubmitting(true);
    setTxError(null);
    setTxSuccess(null);

    // Optimistic UI: Create temporary pending job
    const tempId = Date.now();
    const pendingJob: JobItem = {
      id: tempId,
      client: address,
      freelancer: data.freelancer,
      token: data.token,
      amount: data.amount,
      description: data.description,
      deadline: Math.floor(new Date(data.deadlineDate).getTime() / 1000),
      status: "Pending",
      rated: false,
      isPending: true,
    };

    setOptimisticJobs((prev) => [pendingJob, ...prev]);

    try {
      // 1. Parse budget into stroops (Stellar token units with 7 decimals)
      const budgetInStroops = BigInt(Math.floor(parseFloat(data.amount) * 10_000_000));
      
      // 2. Parse deadline into Unix timestamp in seconds
      const deadlineSec = BigInt(Math.floor(new Date(data.deadlineDate).getTime() / 1000));

      // 3. Assemble arguments
      const args = [
        new Address(address).toScVal(), // client
        new Address(data.freelancer).toScVal(), // freelancer
        new Address(data.token).toScVal(), // token
        nativeToScVal(budgetInStroops, { type: "i128" }), // amount
        nativeToScVal(data.description, { type: "string" }), // description
        nativeToScVal(deadlineSec, { type: "u64" }), // deadline
      ];

      // 4. Invoke contract
      await callContractMethod(address, ESCROW_CONTRACT_ID, "create_job", args, sign);
      
      setTimedAlerts("Gig listing submitted & created on-chain!", null);
      await refreshJobs();
    } catch (err) {
      console.error(err);
      setTimedAlerts(null, err instanceof Error ? err.message : "Failed to create job.");
    } finally {
      // Remove optimistic pending job after on-chain call completes
      setOptimisticJobs((prev) => prev.filter((j) => j.id !== tempId));
      setIsSubmitting(false);
    }
  };

  const handleFundJob = async (jobId: number) => {
    if (!address) return;
    setActiveJobId(jobId);
    setTxError(null);
    setTxSuccess(null);

    try {
      const args = [nativeToScVal(BigInt(jobId), { type: "u64" })];
      await callContractMethod(address, ESCROW_CONTRACT_ID, "fund_job", args, sign);
      setTimedAlerts(`Job #${jobId} funded and activated!`, null);
      await refreshJobs();
    } catch (err) {
      console.error(err);
      setTimedAlerts(null, err instanceof Error ? err.message : "Failed to fund job.");
    } finally {
      setActiveJobId(null);
    }
  };

  const handleCompleteJob = async (jobId: number) => {
    if (!address) return;
    setActiveJobId(jobId);
    setTxError(null);
    setTxSuccess(null);

    try {
      const args = [nativeToScVal(BigInt(jobId), { type: "u64" })];
      await callContractMethod(address, ESCROW_CONTRACT_ID, "complete_job", args, sign);
      setTimedAlerts(`Job #${jobId} completed. Payment released & seller reputation updated!`, null);
      await refreshJobs();
    } catch (err) {
      console.error(err);
      setTimedAlerts(null, err instanceof Error ? err.message : "Failed to complete job.");
    } finally {
      setActiveJobId(null);
    }
  };

  const handleRefundJob = async (jobId: number) => {
    if (!address) return;
    setActiveJobId(jobId);
    setTxError(null);
    setTxSuccess(null);

    try {
      const args = [nativeToScVal(BigInt(jobId), { type: "u64" })];
      await callContractMethod(address, ESCROW_CONTRACT_ID, "refund_job", args, sign);
      setTimedAlerts(`Job #${jobId} refunded successfully.`, null);
      await refreshJobs();
    } catch (err) {
      console.error(err);
      setTimedAlerts(null, err instanceof Error ? err.message : "Failed to request refund.");
    } finally {
      setActiveJobId(null);
    }
  };

  const handleRateJob = async (jobId: number, score: number) => {
    if (!address) return;
    setActiveJobId(jobId);
    setTxError(null);
    setTxSuccess(null);

    try {
      const args = [
        nativeToScVal(BigInt(jobId), { type: "u64" }),
        nativeToScVal(score, { type: "u32" }),
      ];
      await callContractMethod(address, ESCROW_CONTRACT_ID, "submit_rating", args, sign);
      setTimedAlerts(`Submitted rating of ${score} stars for Freelancer!`, null);
      await refreshJobs();
    } catch (err) {
      console.error(err);
      setTimedAlerts(null, err instanceof Error ? err.message : "Failed to submit rating.");
    } finally {
      setActiveJobId(null);
    }
  };

  const isConfigured = ESCROW_CONTRACT_ID !== "";
  const combinedJobs = [...optimisticJobs, ...jobs];

  return (
    <div className="min-h-screen bg-ink-900 text-parchment-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-brass-500/15 bg-ink-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-brass-400">Ledger & Seal</h1>
              <span className="bg-brass-500/10 text-brass-400 border border-brass-500/25 px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider font-mono">
                Stellar Testnet
              </span>
              <span className="bg-mint-500/10 text-mint-400 border border-mint-500/25 px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider font-mono">
                Level 5 — Blue Belt
              </span>
            </div>
            <p className="text-xs text-ink-400 font-medium">Escrow + Portable On-Chain Reputation Marketplace</p>
          </div>
          <WalletButton
            address={wallet.address}
            isConnecting={wallet.isConnecting}
            isInstalled={wallet.isInstalled}
            error={wallet.error}
            connect={wallet.connect}
            disconnect={wallet.disconnect}
          />
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        
        {/* Network Guard Warning Banner */}
        <NetworkGuard />

        {/* User Feedback & Onboarding Survey Banner */}
        <FeedbackBanner />

        {/* Global Configuration Check Banner */}
        {!isConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-seal text-xs text-yellow-400 font-medium">
            ⚠️ <strong>Contracts Not Configured:</strong> The escrow contract ID is missing. Build, deploy the contracts using <code>deploy.sh</code> and write them to <code>.env.local</code>.
          </div>
        )}

        {/* Transaction Alerts */}
        {txSuccess && (
          <div className="bg-mint-500/10 border border-mint-500/30 p-4 rounded-seal text-sm text-mint-500 font-bold animate-fade-in shadow-lg flex items-center justify-between">
            <span>✓ {txSuccess}</span>
            <a
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-mint-400 hover:text-mint-300 font-mono"
            >
              Verify on Explorer ↗
            </a>
          </div>
        )}
        {txError && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-seal text-sm text-red-400 font-bold animate-fade-in shadow-lg">
            ✗ Error: {txError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Post Gig Panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <CreateJobForm
              onSubmit={handleCreateJob}
              isSubmitting={isSubmitting}
              walletConnected={!!address}
            />
            
            <div className="bg-ink-800/20 border border-brass-500/5 p-5 rounded-seal text-xs text-ink-400 flex flex-col gap-2 font-medium">
              <span className="font-bold text-brass-500/80">Stellar Testnet Status:</span>
              <span className="break-all font-mono">RPC: {SOROBAN_RPC_URL}</span>
              <span className="break-all font-mono">Escrow ID: {ESCROW_CONTRACT_ID || "Not Deployed"}</span>
            </div>
          </div>

          {/* Active Manifest Panel */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-tight text-parchment-200">Escrow Manifest</h2>
              <button
                onClick={refreshJobs}
                className="text-xs font-semibold text-brass-400 hover:text-brass-300 transition"
              >
                ↻ Refresh List
              </button>
            </div>

            {loading && combinedJobs.length === 0 ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-ink-800/10 border border-brass-500/5 p-6 rounded-seal animate-pulse flex flex-col gap-3">
                    <div className="h-6 bg-ink-800 w-1/3 rounded"></div>
                    <div className="h-12 bg-ink-800 w-full rounded"></div>
                    <div className="h-4 bg-ink-800 w-2/3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-seal text-center text-red-400 text-sm font-semibold">
                {error}
              </div>
            ) : (
              <JobList
                jobs={combinedJobs}
                walletAddress={address}
                onFund={handleFundJob}
                onComplete={handleCompleteJob}
                onRefund={handleRefundJob}
                onRate={handleRateJob}
                activeActionJobId={activeJobId}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
