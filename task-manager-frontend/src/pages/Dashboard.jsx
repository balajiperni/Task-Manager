import { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import api from "../services/api";

const COLORS = ["#3182CE", "#ECC94B", "#38A169"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/analytics/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);

        // 🔒 Invalid / expired token → force logout
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!data) {
    return (
      <Box p={6}>
        <Text>Loading dashboard...</Text>
      </Box>
    );
  }

  const statusChartData = data.charts.statusChart.labels.map((label, i) => ({
    name: label,
    value: data.charts.statusChart.data[i]
  }));

  const completionData = data.charts.completionReopenChart.labels.map(
    (label, i) => ({
      name: label,
      value: data.charts.completionReopenChart.data[i]
    })
  );

  return (
    <Box p={6}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Text fontSize="2xl" fontWeight="bold">
          Dashboard
        </Text>

        <Box>
          <Button mr={3} onClick={() => navigate("/tasks")}>
            Tasks
          </Button>

          <Button
            colorScheme="red"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* KPI CARDS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={10}
      >
        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text fontSize="sm">Total Tasks</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {data.cards.totalTasks}
          </Text>
        </Box>

        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text fontSize="sm">Completed</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {data.cards.completedTasks}
          </Text>
        </Box>

        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text fontSize="sm">Reopened</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {data.cards.reopenedTasks}
          </Text>
        </Box>

        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text fontSize="sm">Avg Completion (min)</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {data.cards.avgCompletionTimeMinutes ?? "-"}
          </Text>
        </Box>
      </Box>

      {/* CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(320px, 1fr))"
        gap={8}
      >
        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text mb={4} fontWeight="semibold">
            Task Status Distribution
          </Text>

          <PieChart width={300} height={300}>
            <Pie
              data={statusChartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {statusChartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Box>

        <Box p={4} border="1px solid #e2e8f0" borderRadius="md">
          <Text mb={4} fontWeight="semibold">
            Completion vs Reopen
          </Text>

          <BarChart width={300} height={300} data={completionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3182CE" />
          </BarChart>
        </Box>
      </Box>
    </Box>
  );
}
