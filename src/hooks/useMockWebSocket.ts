import { useState, useEffect, useCallback } from "react";
import {
  WebSocketMessage,
  MetricsUpdates,
  CommitEvent,
  BuildEvent,
  PREvent,
} from "../types/websocket";

// Mock data generators
const mockCommitEvent = (): CommitEvent => ({
  type: "COMMIT_PUSHED",
  timestamp: new Date().toISOString(),
  data: {
    repository: "realtime-dev-dashboard",
    author: ["alice-dev", "bob-eng", "charlie-ops", "diana-ux"][
      Math.floor(Math.random() * 4)
    ]!,
    message: [
      "Add real-time chart updates",
      "Fix WebSocket connection issue",
      "Update dashboard styling",
      "Implement new metrics endpoint",
      "Refactor component structure",
    ][Math.floor(Math.random() * 5)]!,
    filesChanged: Math.floor(Math.random() * 8) + 1,
    linesAdded: Math.floor(Math.random() * 200) + 10,
    linesDeleted: Math.floor(Math.random() * 50),
  },
});

const mockBuildEvent = (): BuildEvent => ({
  type: "BUILD_STATUS_CHANGED",
  timestamp: new Date().toISOString(),
  data: {
    buildId: `build-${Date.now()}`,
    status: ["running", "success", "failed"][
      Math.floor(Math.random() * 3)
    ] as "running" | "success" | "failed",
    progress: Math.floor(Math.random() * 100),
    currentStage: ["installing-deps", "running-tests", "building", "deploying"][
      Math.floor(Math.random() * 4)
    ] as string,
  },
});

const mockPREvent = (): PREvent => ({
  type: "PR_STATUS_CHANGED",
  timestamp: new Date().toISOString(),
  data: {
    activeDevs: Math.floor(Math.random() * 10) + 1,
    openPRs: Math.floor(Math.random() * 15) + 1,
    commitsToday: Math.floor(Math.random() * 20),
    buildSuccessRate: Math.floor(Math.random() * 30) + 70,
  },
});

let baseMetrics = {
  activeDevs: 12,
  openPRs: 23,
  commitsToday: 156,
  buildSuccessRate: 94.2,
};

const mockMetricsUpdate = (): MetricsUpdates => {
  // Simulate realistic changes
  baseMetrics = {
    activeDevs: Math.max(5, baseMetrics.activeDevs + (Math.random() - 0.5) * 2),
    openPRs: Math.max(0, baseMetrics.openPRs + (Math.random() - 0.6) * 3),
    commitsToday: baseMetrics.commitsToday + Math.floor(Math.random() * 5),
    buildSuccessRate: Math.min(
      100,
      Math.max(80, baseMetrics.buildSuccessRate + (Math.random() - 0.5) * 2)
    ),
  };

  return {
    type: "METRICS_UPDATE",
    timestamp: new Date().toISOString(),
    data: {
      ...baseMetrics,
      activeDevs: Math.floor(baseMetrics.activeDevs),
      openPRs: Math.floor(baseMetrics.openPRs),
      commitsToday: Math.floor(baseMetrics.commitsToday),
      buildSuccessRate: Math.floor(baseMetrics.buildSuccessRate * 10) / 10,
    },
  };
};

interface UseMockWebSocketReturn {
  latestMessage: WebSocketMessage | null;
  metrics: MetricsUpdates["data"] | null;
  messageHistory: WebSocketMessage[];
  isConnected: boolean;
  status: "connected" | "connecting";
}

export function useMockWebSocket(): UseMockWebSocketReturn {
  const [latestMessage, setLatestMessage] = useState<WebSocketMessage | null>(
    null
  );
  const [metrics, setMetrics] = useState<MetricsUpdates["data"] | null>(
    baseMetrics
  );
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([]);

  const generateRandomEvent = useCallback(() => {
    const eventTypes = [
      mockCommitEvent,
      mockBuildEvent,
      mockPREvent,
      mockMetricsUpdate,
    ];
    const randomIndex = Math.floor(Math.random() * eventTypes.length);
    const randomEventGenerator = eventTypes[randomIndex]!;
    const message = randomEventGenerator();

    setLatestMessage(message);
    setMessageHistory((prev) => [...prev.slice(-49), message]);

    if (message.type === "METRICS_UPDATE") {
      setMetrics(message.data);
    }
  }, []);

  useEffect(() => {
    // Generate initial metrics
    const initialMetrics = mockMetricsUpdate();
    setLatestMessage(initialMetrics);
    setMetrics(initialMetrics.data);

    // Start generating events
    const interval = setInterval(() => {
      generateRandomEvent();
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [generateRandomEvent]);

  return {
    latestMessage,
    metrics,
    messageHistory,
    isConnected: true,
    status: "connected",
  };
}
