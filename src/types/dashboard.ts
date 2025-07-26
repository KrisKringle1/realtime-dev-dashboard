export interface DashboardContextValue {
  layout: "grid" | "flex";
  spacing: "sm" | "md" | "lg";
  isLoading: boolean;
}
export interface WidgetProps {
  span?: number;
  className?: string;
  children: React.ReactNode;
}

export interface WidgetContainerProps {
  className?: string;
  children: React.ReactNode;
}
