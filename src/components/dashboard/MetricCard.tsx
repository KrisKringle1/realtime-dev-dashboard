import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: "blue" | "green" | "red" | "purple";
}
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
}: MetricCardProps) => {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50",
    green: "text-green-500 bg-green-50",
    red: "text-red-500 bg-red-50",
    purple: "text-purple-500 bg-purple-50",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      {trend && (
        <div className="flex items-center text-sm">
          <span
            className={`font-medium ${
              trend.direction === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.direction === "up" ? "↗" : "↘"} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 ml-2">vs last week</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
