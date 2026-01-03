import { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Container,
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || res.data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error fetching tasks",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  // Prepare data for charts
  const statusData = [
    {
      name: "Pending",
      value: tasks.filter((t) => t.status === "Pending").length,
    },
    {
      name: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
    },
    {
      name: "Completed",
      value: tasks.filter((t) => t.status === "Completed").length,
    },
  ];

  const priorityData = [
    { name: "High", value: tasks.filter((t) => t.priority === "High").length },
    {
      name: "Medium",
      value: tasks.filter((t) => t.priority === "Medium").length,
    },
    { name: "Low", value: tasks.filter((t) => t.priority === "Low").length },
  ];

  // Timeline data (tasks created per day - last 7 days)
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
    date: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    tasks: tasks.filter(
      (t) => t.createdAt && t.createdAt.split("T")[0] === date
    ).length,
  }));

  // Calendar events
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
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg="gray.50"
        bgGradient="linear(to-br, blue.50, purple.50)"
      >
        <VStack spacing={4}>
          <Box
            w={16}
            h={16}
            border="4px"
            borderColor="blue.500"
            borderTopColor="transparent"
            rounded="full"
            animation="spin 1s linear infinite"
          />
          <Text fontSize="lg" color="gray.600">
            Loading visualizations...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      bgGradient="linear(to-br, blue.50, purple.50)"
      py={8}
    >
      <Container maxW="7xl">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={8}
          bg="white"
          p={6}
          rounded="2xl"
          shadow="lg"
          border="1px"
          borderColor="gray.100"
        >
          <HStack spacing={4}>
            <Box
              w={12}
              h={12}
              bgGradient="linear(to-br, purple.500, pink.600)"
              rounded="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </Box>
            <Box>
              <Heading
                size="lg"
                bgGradient="linear(to-r, purple.600, pink.600)"
                bgClip="text"
              >
                Work Visualizations
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Visual insights into your task management
              </Text>
            </Box>
          </HStack>
          <Button
            colorScheme="purple"
            variant="outline"
            onClick={() => navigate("/dashboard")}
            _hover={{
              bg: "purple.50",
              transform: "translateY(-2px)",
              shadow: "md",
            }}
            transition="all 0.2s"
          >
            ← Back to Dashboard
          </Button>
        </Flex>

        {/* Stats Overview */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          mb={8}
        >
          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="blue.100"
                rounded="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3182CE"
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Total Tasks
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {tasks.length}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="green.100"
                rounded="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38A169"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Completed
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {tasks.filter((t) => t.status === "Completed").length}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="orange.100"
                rounded="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DD6B20"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  In Progress
                </Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {tasks.filter((t) => t.status === "In Progress").length}
                </Text>
              </Box>
            </HStack>
          </Box>
        </Grid>

        {/* Charts Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={6}
          mb={6}
        >
          {/* Status Distribution */}
          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={3} mb={6}>
              <Box
                w={8}
                h={8}
                bg="purple.100"
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#805AD5"
                  strokeWidth="2"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Status Distribution
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Tasks by current status
                </Text>
              </Box>
            </HStack>
            <Box display="flex" justifyContent="center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          {/* Priority Workload */}
          <Box
            bg="white"
            p={6}
            rounded="2xl"
            shadow="md"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={3} mb={6}>
              <Box
                w={8}
                h={8}
                bg="orange.100"
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DD6B20"
                  strokeWidth="2"
                >
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Priority Workload
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Tasks by priority level
                </Text>
              </Box>
            </HStack>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Timeline Chart */}
        <Box
          bg="white"
          p={6}
          rounded="2xl"
          shadow="md"
          border="1px"
          borderColor="gray.100"
          mb={6}
        >
          <HStack spacing={3} mb={6}>
            <Box
              w={8}
              h={8}
              bg="blue.100"
              rounded="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3182CE"
                strokeWidth="2"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Task Creation Timeline
              </Text>
              <Text fontSize="sm" color="gray.600">
                Tasks created over the last 7 days
              </Text>
            </Box>
          </HStack>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={timelineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3182CE"
                strokeWidth={3}
                dot={{ fill: "#3182CE", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Upcoming Tasks Calendar */}
        <Box
          bg="white"
          p={6}
          rounded="2xl"
          shadow="md"
          border="1px"
          borderColor="gray.100"
        >
          <HStack spacing={3} mb={6}>
            <Box
              w={8}
              h={8}
              bg="green.100"
              rounded="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38A169"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </Box>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Upcoming Tasks
              </Text>
              <Text fontSize="sm" color="gray.600">
                Tasks with due dates
              </Text>
            </Box>
          </HStack>

          {calendarEvents.length === 0 ? (
            <Box textAlign="center" py={12}>
              <Text color="gray.500">No tasks with due dates</Text>
            </Box>
          ) : (
            <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
              {calendarEvents.map((event, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="gray.50"
                  rounded="lg"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{
                    bg: "gray.100",
                    borderColor: "gray.300",
                  }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center">
                    <Box flex={1}>
                      <Text fontWeight="bold" color="gray.800" mb={2}>
                        {event.title}
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="blue" rounded="full" px={3}>
                          {event.date}
                        </Badge>
                        <Badge
                          colorScheme={
                            event.priority === "High"
                              ? "red"
                              : event.priority === "Medium"
                              ? "orange"
                              : "green"
                          }
                          rounded="full"
                          px={3}
                        >
                          {event.priority}
                        </Badge>
                        <Badge
                          colorScheme={
                            event.status === "Completed"
                              ? "green"
                              : event.status === "In Progress"
                              ? "yellow"
                              : "red"
                          }
                          rounded="full"
                          px={3}
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
      </Container>
    </Box>
  );
}