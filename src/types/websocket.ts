//Websocket Message Types
export type WebSocketMessage =
  | CommitEvent
  | BuildEvent
  | PREvent
  | MetricsUpdates;

export interface CommitEvent {
  type: "COMMIT_PUSHED";
  timestamp: string;
  data: {
    repository: string;
    author: string;
    message: string;
    filesChanged: number;
    linesAdded: number;
    linesDeleted: number;
  };
}

export interface BuildEvent {
  type: "BUILD_STATUS_CHANGED";
  timestamp: string;
  data: {
    buildId: string;
    status: "running" | "success" | "failed";
    progress?: number;
    currentStage?: string;
  };
}

export interface PREvent {
  type: "PR_STATUS_CHANGED";
  timestamp: string;
  data: {
    activeDevs: number;
    openPRs: number;
    commitsToday: number;
    buildSuccessRate: number;
  };
}

export interface MetricsUpdates {
  type: "METRICS_UPDATE";
  timestamp: string;
  data: {
    activeDevs: number;
    openPRs: number;
    commitsToday: number;
    buildSuccessRate: number;
  };
}

//connection states
export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
