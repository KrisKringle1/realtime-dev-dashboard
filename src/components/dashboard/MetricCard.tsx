import { LucideIcon } from "lucide-react";
import { Card, Group, Stack, Text } from "@mantine/core";

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
const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color = "blue",
}: MetricCardProps) => {
  const colorMap = {
    blue: "#1c7ed6",
    green: "#37b24d",
    red: "#f03e3e",
    purple: "#9775fa",
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group>
        <Icon size={32} color={colorMap[color as keyof typeof colorMap]} />
        <Stack gap="xs">
          <Text size="sm" fw={500} c="dimmed">
            {title}
          </Text>
          <Text size="xl" fw={700}>
            {value}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};

export default MetricCard;
