// src/pages/Visualizations.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Heading,
  Flex,
  Grid,
  Badge,
  useToast,
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
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";

const STATUS_COLORS = {
  Pending: "#f56565",
  "In Progress": "#ecc94b",
  Completed: "#48bb78",
};

const PRIORITY_COLORS = {
  High: "#E53E3E",
  Medium: "#DD6B20",
  Low: "#38A169",
};

export default function Visualizations() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || res.data);
      setLoading(false);
    } catch (error) {
      toast({ title: "Error fetching tasks", status: "error", duration: 3000 });
      setLoading(false);
    }
  };

  const statusData = [
    { name: "Pending", value: tasks.filter((t) => t.status === "Pending").length },
    { name: "In Progress", value: tasks.filter((t) => t.status === "In Progress").length },
    { name: "Completed", value: tasks.filter((t) => t.status === "Completed").length },
  ];

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium", value: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
  ];

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split("T")[0]);
    }
    return days;
  };

  const timelineData = getLast7Days().map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tasks: tasks.filter((t) => t.createdAt && t.createdAt.split("T")[0] === date).length,
  }));

  const calendarEvents = tasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      title: t.title,
      date: t.dueDate.split("T")[0],
      status: t.status,
      priority: t.priority,
    }));

  if (loading) {
    return (
      <Flex h="100vh" bg={theme.bg.primary}>
        <Sidebar />
        <Flex flex={1} align="center" justify="center">
          <VStack spacing={4}>
            <Box
              w={14}
              h={14}
              border="4px"
              borderColor="blue.500"
              borderTopColor="transparent"
              rounded="full"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <Text fontSize="lg" color={theme.text.secondary}>
              Loading visualizations...
            </Text>
          </VStack>
        </Flex>
      </Flex>
    );
  }

  const ChartCard = ({ children, title, subtitle, icon }) => (
    <Box
      bg={theme.bg.card}
      p={6}
      rounded="2xl"
      shadow="md"
      border="1px"
      borderColor={theme.border.primary}
    >
      <HStack spacing={3} mb={6}>
        <Box
          w={9}
          h={9}
          bg={theme.isDark ? "gray.700" : "white"}
          border="1px"
          borderColor={theme.border.primary}
          rounded="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
        <Box>
          <Text fontSize="md" fontWeight="bold" color={theme.text.primary}>
            {title}
          </Text>
          <Text fontSize="xs" color={theme.text.secondary}>
            {subtitle}
          </Text>
        </Box>
      </HStack>
      {children}
    </Box>
  );

  return (
    <Flex h="100vh" bg={theme.bg.primary}>
      <Sidebar />

      {/* Main Content */}
      <Box flex={1} overflowY="auto">
        {/* Top Header */}
        <Box
          bg={theme.bg.card}
          px={8}
          py={5}
          borderBottom="1px"
          borderColor={theme.border.primary}
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg" color={theme.text.primary} fontWeight="bold">
                Visualizations
              </Heading>
              <Text color={theme.text.secondary} fontSize="sm" mt={1}>
                Visual insights into your task management
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box p={8}>
          {/* Stats Overview */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={5}
            mb={6}
          >
            {[
              {
                label: "Total Tasks",
                value: tasks.length,
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ),
              },
              {
                label: "Completed",
                value: tasks.filter((t) => t.status === "Completed").length,
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
              },
              {
                label: "In Progress",
                value: tasks.filter((t) => t.status === "In Progress").length,
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DD6B20" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
              },
            ].map((stat) => (
              <Box
                key={stat.label}
                bg={theme.bg.card}
                p={6}
                rounded="2xl"
                shadow="md"
                border="1px"
                borderColor={theme.border.primary}
                _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.2s"
              >
                <HStack spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    bg={theme.isDark ? "gray.700" : "white"}
                    border="1px"
                    borderColor={theme.border.primary}
                    rounded="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={theme.text.secondary} fontWeight="medium">
                      {stat.label}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color={theme.text.primary}>
                      {stat.value}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
          </Grid>

          {/* Charts Grid */}
          <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={5} mb={5}>
            <ChartCard
              title="Status Distribution"
              subtitle="Tasks by current status"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              }
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: theme.isDark ? "#2D3748" : "#fff",
                      border: `1px solid ${theme.isDark ? "#4A5568" : "#E2E8F0"}`,
                      borderRadius: "8px",
                      color: theme.isDark ? "#E2E8F0" : "#2D3748",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Priority Workload"
              subtitle="Tasks by priority level"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              }
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" stroke={theme.text.tertiary} />
                  <YAxis stroke={theme.text.tertiary} />
                  <Tooltip
                    contentStyle={{
                      background: theme.isDark ? "#2D3748" : "#fff",
                      border: `1px solid ${theme.isDark ? "#4A5568" : "#E2E8F0"}`,
                      borderRadius: "8px",
                      color: theme.isDark ? "#E2E8F0" : "#2D3748",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>

          {/* Timeline Chart */}
          <ChartCard
            title="Task Creation Timeline"
            subtitle="Tasks created over the last 7 days"
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={timelineData}>
                <XAxis dataKey="date" stroke={theme.text.tertiary} />
                <YAxis stroke={theme.text.tertiary} />
                <Tooltip
                  contentStyle={{
                    background: theme.isDark ? "#2D3748" : "#fff",
                    border: `1px solid ${theme.isDark ? "#4A5568" : "#E2E8F0"}`,
                    borderRadius: "8px",
                    color: theme.isDark ? "#E2E8F0" : "#2D3748",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#3182CE"
                  strokeWidth={3}
                  dot={{ fill: "#3182CE", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Upcoming Tasks */}
          <Box
            bg={theme.bg.card}
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor={theme.border.primary}
            mt={5}
          >
            <HStack spacing={3} mb={5}>
              <Box
                w={9}
                h={9}
                bg={theme.isDark ? "blue.900" : "blue.50"}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="md" fontWeight="bold" color={theme.text.primary}>Upcoming Tasks</Text>
                <Text fontSize="xs" color={theme.text.secondary}>Tasks with due dates</Text>
              </Box>
            </HStack>

            {calendarEvents.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color={theme.text.tertiary}>No tasks with due dates</Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                {calendarEvents.map((event, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg={theme.bg.secondary}
                    rounded="xl"
                    border="1px"
                    borderColor={theme.border.primary}
                    _hover={{ borderColor: "blue.300", transform: "translateY(-1px)", shadow: "sm" }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <Box flex={1}>
                        <Text fontWeight="semibold" color={theme.text.primary} mb={2}>
                          {event.title}
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <Badge colorScheme="blue" rounded="full" px={3} fontSize="xs">
                            {event.date}
                          </Badge>
                          <Badge
                            colorScheme={event.priority === "High" ? "red" : event.priority === "Medium" ? "orange" : "green"}
                            rounded="full"
                            px={3}
                            fontSize="xs"
                          >
                            {event.priority}
                          </Badge>
                          <Badge
                            colorScheme={event.status === "Completed" ? "green" : event.status === "In Progress" ? "yellow" : "red"}
                            rounded="full"
                            px={3}
                            fontSize="xs"
                          >
                            {event.status}
                          </Badge>
                        </HStack>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}