import React, { createContext, useContext } from "react";
import { Container, Grid, Card, Title, Group } from "@mantine/core";
import { DashboardContextValue, WidgetProps } from "../../types/dashboard";

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
  const spacingMap = {
    sm: "sm",
    md: "md",
    lg: "lg",
  };

  return (
    <DashboardContext.Provider value={{ layout, spacing, isLoading }}>
      <Container size="xl" className={className ?? ""}>
        {layout === "grid" ? (
          <Grid gutter={spacingMap[spacing]}>{children}</Grid>
        ) : (
          <Group gap={spacingMap[spacing]} style={{ flexWrap: "wrap" }}>
            {children}
          </Group>
        )}
      </Container>
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
    <Group justify="space-between" mb="xl" className={className ?? ""}>
      {children}
    </Group>
  );
};

Dashboard.Title = function DashboardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Title order={1} size="h1" className={className ?? ""}>
      {children}
    </Title>
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
    <Group gap="md" className={className ?? ""}>
      {children}
    </Group>
  );
};

Dashboard.Widget = function DashboardWidget({
  span = 1,
  children,
  className,
}: WidgetProps) {
  const { layout } = useDashboard();
  const spanMap = {
    1: 3,
    2: 6,
    3: 9,
    4: 12,
  };

  if (layout === "grid") {
    return (
      <Grid.Col
        span={{ base: 12, md: 6, lg: spanMap[span as keyof typeof spanMap] }}
      >
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          className={className ?? ""}
        >
          {children}
        </Card>
      </Grid.Col>
    );
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className={className ?? ""}
      style={{ flex: "1 1 300px" }}
    >
      {children}
    </Card>
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
  const spacingMap = {
    sm: "sm",
    md: "md",
    lg: "lg",
  };

  return (
    <Grid gutter={spacingMap[spacing]} className={className ?? ""}>
      {children}
    </Grid>
  );
};
