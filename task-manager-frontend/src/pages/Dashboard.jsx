// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Heading,
  Badge,
  Grid,
  Input,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";

const COLORS = ["#3182CE", "#ECC94B", "#38A169"];

const KPI_ICONS = {
  tasks: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  check: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  reopen: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  clock: (color) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    api
      .get("/analytics/dashboard")
      .then((res) => setData(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  if (!data) {
    return (
      <Flex h="100vh" bg="white">
        <Sidebar />
        <Flex flex={1} align="center" justify="center">
          <VStack spacing={4}>
            <Box w={12} h={12} border="3px" borderColor="blue.500" borderTopColor="transparent" rounded="full" style={{ animation: "spin 1s linear infinite" }} />
            <Text color={theme.text.secondary}>Loading dashboard...</Text>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  const statusChartData = data.charts.statusChart.labels.map((label, i) => ({
    name: label, value: data.charts.statusChart.data[i],
  }));

  const completionData = data.charts.completionReopenChart.labels.map((label, i) => ({
    name: label, value: data.charts.completionReopenChart.data[i],
  }));

  const sections = [
    {
      id: "overview", label: "Overview", count: data.cards.totalTasks, strokeColor: "#3182CE",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
    },
    {
      id: "completed", label: "Completed Tasks", count: data.cards.completedTasks, strokeColor: "#38A169",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
    },
    {
      id: "pending", label: "Pending Tasks", count: data.charts.statusChart.data[0], strokeColor: "#D69E2E",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    },
    {
      id: "reopened", label: "Reopened Tasks", count: data.cards.reopenedTasks, strokeColor: "#DD6B20",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
    },
  ];

  const kpiCards = [
    { label: "Total Tasks", value: data.cards.totalTasks, iconKey: "tasks", stroke: "#3182CE" },
    { label: "Completed", value: data.cards.completedTasks, iconKey: "check", stroke: "#38A169" },
    { label: "Reopened", value: data.cards.reopenedTasks, iconKey: "reopen", stroke: "#DD6B20" },
    { label: "Avg Time (min)", value: data.cards.avgCompletionTimeMinutes ?? "—", iconKey: "clock", stroke: "#805AD5" },
  ];

  const tooltipStyle = {
    background: theme.isDark ? "#2D3748" : "#fff",
    border: `1px solid ${theme.isDark ? "#4A5568" : "#E2E8F0"}`,
    borderRadius: "8px",
    color: theme.isDark ? "#E2E8F0" : "#2D3748",
    fontSize: "13px",
  };

  return (
    <Flex h="100vh" bg={theme.isDark ? "gray.900" : "white"}>
      <Sidebar />

      {/* Middle Panel */}
      <Box w="340px" bg={theme.isDark ? "gray.800" : "white"} borderRight="1px" borderColor={theme.border.primary} display="flex" flexDirection="column" h="100vh" flexShrink={0}>
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor={theme.border.primary}>
          <Heading size="md" mb={3} color={theme.text.primary}>Dashboard</Heading>
          <Input
            placeholder="Search sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={theme.isDark ? "gray.700" : "gray.50"}
            border="1px" borderColor={theme.border.secondary}
            color={theme.text.primary} size="sm" borderRadius="lg"
            _focus={{ borderColor: "blue.500" }}
            _placeholder={{ color: theme.text.tertiary }}
          />
        </Box>

        {/* Section List */}
        <Box flex={1} overflowY="auto">
          {sections
            .filter((s) => s.label.toLowerCase().includes(search.toLowerCase()))
            .map((section) => {
              const isActive = activeSection === section.id;
              return (
                <Box
                  key={section.id}
                  p={4} borderBottom="1px" borderColor={theme.border.primary}
                  cursor="pointer"
                  bg={isActive ? (theme.isDark ? "gray.700" : "white") : (theme.isDark ? "gray.800" : "white")}
                  borderLeft={isActive ? "3px solid" : "3px solid transparent"}
                  borderLeftColor={isActive ? "blue.500" : "transparent"}
                  _hover={{ bg: theme.isDark ? "gray.700" : "gray.50" }}
                  onClick={() => setActiveSection(section.id)}
                  transition="all 0.15s"
                >
                  <HStack spacing={3}>
                    <Box
                      w={10} h={10} bg={theme.isDark ? "gray.700" : "white"}
                      border="1px" borderColor={theme.border.primary}
                      rounded="lg" display="flex" alignItems="center" justifyContent="center"
                      flexShrink={0} color={isActive ? "blue.500" : theme.text.secondary}
                    >
                      {section.icon}
                    </Box>
                    <Box flex={1}>
                      <HStack justify="space-between" mb={0.5}>
                        <Text fontWeight={isActive ? "bold" : "semibold"} fontSize="sm" color={isActive ? "blue.500" : theme.text.primary}>
                          {section.label}
                        </Text>
                        <Badge colorScheme={isActive ? "blue" : "gray"} fontSize="xs" px={2} rounded="full">
                          {section.count}
                        </Badge>
                      </HStack>
                      <Text fontSize="xs" color={theme.text.tertiary}>Click to view details</Text>
                    </Box>
                  </HStack>
                </Box>
              );
            })}
        </Box>

        {/* Stats Summary */}
        <Box p={4} borderTop="1px" borderColor={theme.border.primary} bg={theme.isDark ? "gray.800" : "white"}>
          <HStack justify="space-around">
            {[
              { label: "Total", value: data.cards.totalTasks, color: theme.text.primary },
              { label: "Done", value: data.cards.completedTasks, color: "green.500" },
              { label: "Reopened", value: data.cards.reopenedTasks, color: "orange.500" },
            ].map((s) => (
              <VStack key={s.label} spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color={s.color}>{s.value}</Text>
                <Text fontSize="xs" color={theme.text.tertiary}>{s.label}</Text>
              </VStack>
            ))}
          </HStack>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box flex={1} display="flex" flexDirection="column" bg={theme.isDark ? "gray.900" : "white"}>
        {activeSection === "overview" ? (
          <Box flex={1} overflowY="auto">
            <Box bg={theme.isDark ? "gray.800" : "white"} px={6} py={5} borderBottom="1px" borderColor={theme.border.primary}>
              <Heading size="lg" color={theme.text.primary} mb={1}>Dashboard Overview</Heading>
              <Text color={theme.text.secondary} fontSize="sm">Here's what's happening with your tasks today.</Text>
            </Box>

            <Box p={6}>
              {/* KPI Cards — white with border, colored icon only */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4} mb={6}>
                {kpiCards.map((card) => (
                  <Box key={card.label} bg={theme.isDark ? "gray.800" : "white"} p={5} rounded="xl" shadow="sm" border="1px" borderColor={theme.border.primary} _hover={{ shadow: "md", borderColor: "gray.300" }} transition="all 0.2s">
                    <HStack spacing={4}>
                      <Box w={11} h={11} bg={theme.isDark ? "gray.700" : "white"} border="1px" borderColor={theme.border.primary} rounded="xl" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                        {KPI_ICONS[card.iconKey](card.stroke)}
                      </Box>
                      <Box>
                        <Text fontSize="xs" color={theme.text.secondary} fontWeight="medium">{card.label}</Text>
                        <Text fontSize="2xl" fontWeight="bold" color={theme.text.primary}>{card.value}</Text>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </Grid>

              {/* Charts */}
              <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5}>
                <Box bg={theme.isDark ? "gray.800" : "white"} p={6} rounded="xl" shadow="sm" border="1px" borderColor={theme.border.primary}>
                  <Text fontSize="md" fontWeight="bold" mb={5} color={theme.text.primary}>Task Status Distribution</Text>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <ChartTooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box bg={theme.isDark ? "gray.800" : "white"} p={6} rounded="xl" shadow="sm" border="1px" borderColor={theme.border.primary}>
                  <Text fontSize="md" fontWeight="bold" mb={5} color={theme.text.primary}>Completion vs Reopen</Text>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={completionData}>
                      <XAxis dataKey="name" stroke={theme.text.tertiary} />
                      <YAxis stroke={theme.text.tertiary} />
                      <ChartTooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" fill="#3182CE" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Box>
          </Box>
        ) : (
          <Flex flex={1} align="center" justify="center" direction="column" p={12}>
            <Box w={20} h={20} bg={theme.isDark ? "gray.700" : "white"} border="2px" borderColor={theme.border.primary} rounded="full" display="flex" alignItems="center" justifyContent="center" mb={6}>
              <Box color={sections.find((s) => s.id === activeSection)?.strokeColor || "blue.500"}>
                {sections.find((s) => s.id === activeSection)?.icon}
              </Box>
            </Box>
            <Heading size="xl" color={theme.text.primary} mb={2} textAlign="center">
              {sections.find((s) => s.id === activeSection)?.label}
            </Heading>
            <Text color={theme.text.secondary} textAlign="center" maxW="md" mb={4}>
              Analytics for {sections.find((s) => s.id === activeSection)?.label?.toLowerCase()}
            </Text>
            <Badge colorScheme="blue" fontSize="lg" px={4} py={2} rounded="full">
              {sections.find((s) => s.id === activeSection)?.count} Total
            </Badge>
          </Flex>
        )}
      </Box>
    </Flex>
  );
}