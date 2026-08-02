import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { JobList } from "../components/JobList";
import type { JobItem } from "../components/JobList";
import { NetworkGuard } from "../components/NetworkGuard";
import { FeedbackBanner } from "../components/FeedbackBanner";

// Mock freighter API
vi.mock("@stellar/freighter-api", () => ({
  isConnected: vi.fn().mockResolvedValue(true),
  getNetworkDetails: vi.fn().mockResolvedValue({ network: "TESTNET" }),
}));

describe("Level 5 Blue Belt Feature Tests", () => {
  const sampleJobs: JobItem[] = [
    {
      id: 1,
      client: "GCLIENT11111111111111111111111111111111111111111111111",
      freelancer: "GFREELANCER22222222222222222222222222222222222222222222",
      token: "CDWS33333333333333333333333333333333333333333333333333333",
      amount: "100",
      description: "Build fullstack dApp frontend",
      deadline: Math.floor(Date.now() / 1000) + 86400,
      status: "Funded",
      rated: false,
    },
    {
      id: 2,
      client: "GOTHERCLIENT44444444444444444444444444444444444444444",
      freelancer: "GOTHERFREELANCER555555555555555555555555555555555555",
      token: "CDWS33333333333333333333333333333333333333333333333333333",
      amount: "250",
      description: "Audit smart contract WASM",
      deadline: Math.floor(Date.now() / 1000) + 86400,
      status: "Created",
      rated: false,
    },
  ];

  it("renders JobList and filters jobs using 'Show only my deals' toggle", () => {
    const myAddress = "GCLIENT11111111111111111111111111111111111111111111111";

    render(
      <JobList
        jobs={sampleJobs}
        walletAddress={myAddress}
        onFund={vi.fn()}
        onComplete={vi.fn()}
        onRefund={vi.fn()}
        onRate={vi.fn()}
        activeActionJobId={null}
      />
    );

    // Initially both jobs are visible
    expect(screen.getByText("Job #1")).toBeInTheDocument();
    expect(screen.getByText("Job #2")).toBeInTheDocument();

    // Toggle "Show only my deals"
    const toggle = screen.getByRole("checkbox");
    fireEvent.click(toggle);

    // Now only Job #1 should be visible
    expect(screen.getByText("Job #1")).toBeInTheDocument();
    expect(screen.queryByText("Job #2")).not.toBeInTheDocument();
  });

  it("renders NetworkGuard and FeedbackBanner without throwing errors", () => {
    const { container: netGuardContainer } = render(<NetworkGuard />);
    expect(netGuardContainer).toBeDefined();

    render(<FeedbackBanner />);
    expect(screen.getByText("Level 5 — User Feedback & Growth Program")).toBeInTheDocument();
    expect(screen.getByText("Take Google Form Survey ↗")).toBeInTheDocument();
    expect(screen.getByText("View Live Responses ↗")).toBeInTheDocument();
  });

  it("renders pending state badge for optimistic escrows", () => {
    const pendingJobs: JobItem[] = [
      {
        ...sampleJobs[0],
        id: 99,
        status: "Pending",
        isPending: true,
      },
    ];

    render(
      <JobList
        jobs={pendingJobs}
        walletAddress={null}
        onFund={vi.fn()}
        onComplete={vi.fn()}
        onRefund={vi.fn()}
        onRate={vi.fn()}
        activeActionJobId={null}
      />
    );

    expect(screen.getByText("⏳ Pending On-Chain")).toBeInTheDocument();
  });
});
