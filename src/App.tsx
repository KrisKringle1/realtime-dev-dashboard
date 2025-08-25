import {
  Activity,
  GitBranch,
  BarChart3,
  Users,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Dashboard } from "./components/dashboard/Dashboard";
import { MetricCard } from "./components/dashboard/MetricCard";
import { useMockWebSocket } from "./hooks/useMockWebSocket";

function App() {
  const { metrics, latestMessage, messageHistory, isConnected } =
    useMockWebSocket();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Dashboard spacing="lg">
          <Dashboard.Header>
            <Dashboard.Title>Development Analytics</Dashboard.Title>
            <Dashboard.Actions>
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Disconnected</span>
                  </>
                )}
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </Dashboard.Actions>
          </Dashboard.Header>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Active Developers"
              value={metrics?.activeDevs ?? 12}
              icon={Users}
              trend={{ value: 8.1, direction: "up" }}
              color="green"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Open Pull Requests"
              value={metrics?.openPRs ?? 23}
              icon={GitBranch}
              trend={{ value: 2.3, direction: "down" }}
              color="blue"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Commits Today"
              value={metrics?.commitsToday ?? 156}
              icon={BarChart3}
              trend={{ value: 12.5, direction: "up" }}
              color="purple"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Build Success Rate"
              value={`${metrics?.buildSuccessRate ?? 94.2}%`}
              icon={Activity}
              trend={{ value: 1.2, direction: "up" }}
              color="green"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Live Activity Feed</h3>
              <div className="space-y-3 h-48 overflow-y-auto">
                {messageHistory
                  .slice(-5)
                  .reverse()
                  .map((message, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            {message.type.replace("_", " ").toLowerCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {message.type === "COMMIT_PUSHED" &&
                            `${message.data.author} pushed to ${message.data.repository}`}
                          {message.type === "BUILD_STATUS_CHANGED" &&
                            `Build ${message.data.status}: ${message.data.buildId}`}
                          {message.type === "PR_STATUS_CHANGED" &&
                            `PRs updated: ${message.data.openPRs} open, ${message.data.activeDevs} devs active`}
                          {message.type === "METRICS_UPDATE" &&
                            `Metrics updated: ${message.data.activeDevs} devs active`}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Dashboard.Widget>

          <Dashboard.Widget span={2}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Latest Event</h3>
              {latestMessage ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">
                      {latestMessage.type.replace("_", " ")}
                    </span>
                    <span className="text-sm text-blue-700">
                      {new Date(latestMessage.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">
                    {JSON.stringify(latestMessage.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-gray-500">No events yet...</p>
              )}
            </div>
          </Dashboard.Widget>
        </Dashboard>
      </div>
    </div>
  );
}

export default App;
