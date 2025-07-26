import { useState } from "react";
import { Activity, BarChart3, Users, GitBranch } from "lucide-react";
import { Container, Title, Grid, Card, Text, Button, Group, Stack } from "@mantine/core";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container size="xl" py="xl" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Title order={1} size="h1" mb="xl">
        Real-Time Dev Dashboard
      </Title>

      <Grid mb="xl">
        {[
          { icon: Activity, label: "Active Devs", value: "12" },
          { icon: GitBranch, label: "PRs Open", value: "23" },
          { icon: BarChart3, label: "Commits Today", value: "156" },
          { icon: Users, label: "Team Velocity", value: "85%" },
        ].map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group>
                <stat.icon size={32} color="#1c7ed6" />
                <Stack gap="xs">
                  <Text size="sm" fw={500} c="dimmed">
                    {stat.label}
                  </Text>
                  <Text size="xl" fw={700}>
                    {stat.value}
                  </Text>
                </Stack>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} size="h2" mb="md">
          Setup Test
        </Title>
        <Button
          onClick={() => setCount(count + 1)}
          variant="filled"
          color="blue"
          mb="md"
        >
          Count: {count}
        </Button>
        <Text c="green" fw={500}>
          ✅ Vite + TypeScript + Mantine working!
        </Text>
      </Card>
    </Container>
  );
}

export default App;
