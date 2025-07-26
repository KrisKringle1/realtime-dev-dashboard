import { Activity, GitBranch, BarChart3, Users, RefreshCw } from "lucide-react";
import { Dashboard } from "./components/dashboard/Dashboard";
import MetricCard from "./components/dashboard/MetricCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Dashboard spacing="lg">
          <Dashboard.Header>
            <Dashboard.Title>Development Analytics</Dashboard.Title>
            <Dashboard.Actions>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </Dashboard.Actions>
          </Dashboard.Header>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Active Developers"
              value={12}
              icon={Users}
              trend={{ value: 8.1, direction: "up" }}
              color="green"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Open Pull Requests"
              value={23}
              icon={GitBranch}
              trend={{ value: 2.3, direction: "down" }}
              color="blue"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Commits Today"
              value={156}
              icon={BarChart3}
              trend={{ value: 12.5, direction: "up" }}
              color="purple"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={1}>
            <MetricCard
              title="Build Success Rate"
              value="94.2%"
              icon={Activity}
              trend={{ value: 1.2, direction: "up" }}
              color="green"
            />
          </Dashboard.Widget>

          <Dashboard.Widget span={2}>
            <div className="h-64 flex items-center justify-center text-gray-500">
              📊 Real-time commit activity chart will go here
            </div>
          </Dashboard.Widget>

          <Dashboard.Widget span={2}>
            <div className="h-64 flex items-center justify-center text-gray-500">
              🔄 Live PR pipeline will go here
            </div>
          </Dashboard.Widget>
        </Dashboard>
      </div>
    </div>
  );
}

export default App;
