import { useState, useEffect } from "react";
import { isConnected, getNetworkDetails } from "@stellar/freighter-api";

export function NetworkGuard() {
  const [network, setNetwork] = useState<string | null>(null);
  const [isTestnet, setIsTestnet] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    async function checkNetwork() {
      try {
        const connected = await isConnected();
        if (connected) {
          const details = await getNetworkDetails();
          const netName = (details?.network || "").toUpperCase();
          setNetwork(netName);
          // If network contains MAINNET, flag as non-testnet
          if (netName.includes("PUBLIC") || netName.includes("MAINNET")) {
            setIsTestnet(false);
          } else {
            setIsTestnet(true);
          }
        }
      } catch (err) {
        console.warn("Could not check network details:", err);
      } finally {
        setChecking(false);
      }
    }

    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  if (checking || isTestnet) return null;

  return (
    <div className="bg-amber-500/15 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-seal flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-lg animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-base">⚠️</span>
        <div>
          <span className="font-bold text-amber-300">Wrong Wallet Network Detected ({network || "MAINNET"}):</span>
          <span className="ml-1 text-ink-300">
            Ledger & Seal is running on <strong>Stellar Testnet</strong>. Please open your Freighter extension and switch network to Testnet before creating or completing escrows.
          </span>
        </div>
      </div>
      <a
        href="https://developers.stellar.org/docs/tools/developer-tools/cli/testnet"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded text-xs font-bold transition"
      >
        Network Guide ↗
      </a>
    </div>
  );
}
