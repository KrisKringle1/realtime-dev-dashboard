import React, { createContext, useContext } from "react";
import { DashboardContextValue, WidgetProps } from "../../types/dashboard";
import { cn } from "../../utils/cn";

interface DashboardProps {
  layout?: "grid" | "flex";
  spacing?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface DashboardComponent extends React.FC<DashboardProps> {
  Header: React.FC<{ className?: string; children: React.ReactNode }>;
  Title: React.FC<{ className?: string; children: React.ReactNode }>;
  Actions: React.FC<{ className?: string; children: React.ReactNode }>;
  Widget: React.FC<WidgetProps>;
  Grid: React.FC<{ className?: string; children: React.ReactNode }>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a Dashboard");
  }
  return context;
};

export const Dashboard: DashboardComponent = ({
  layout = "grid",
  spacing = "md",
  isLoading = false,
  className,
  children,
}: DashboardProps) => {
  const spacingClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <DashboardContext.Provider value={{ layout, spacing, isLoading }}>
      <div
        className={cn(
          "w-full",
          layout === "grid" &&
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12",
          layout === "flex" && "flex flex-wrap",
          spacingClasses[spacing],
          className
        )}
      >
        {children}
      </div>
    </DashboardContext.Provider>
  );
};

Dashboard.Header = function DashboardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "col-span-full mb-6 flex items-center justify-between,",
        className
      )}
    >
      {children}
    </div>
  );
};

// Title
Dashboard.Title = function DashboardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1 className={cn("text-3xl font-bold text-gray-900", className)}>
      {children}
    </h1>
  );
};

Dashboard.Actions = function DashboardActions({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center space-x-4", className)}>
      {children}
    </div>
  );
};

Dashboard.Widget = function DashboardWidget({
  span = 1,
  children,
  className,
}: WidgetProps) {
  const { layout, isLoading } = useDashboard();
  const spanClasses = {
    1: "lg:col-span-3",
    2: "lg:col-span-6",
    3: "lg:col-span-9",
    4: "lg:col-span-12",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-6",
        layout === "grid" && spanClasses[span as keyof typeof spanClasses],
        layout === "flex" && "flex-1 min-w-[300px]",
        isLoading && "animate-pulse",
        className
      )}
    >
      {children}
    </div>
  );
};

Dashboard.Grid = function DashboardGrid({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { spacing } = useDashboard();
  const spacingClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12",
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};
