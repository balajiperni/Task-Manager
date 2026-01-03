import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Heading,
  Avatar,
  Divider,
  Grid,
  useDisclosure,
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
} from "recharts";
import api from "../services/api";

const COLORS = ["#3182CE", "#ECC94B", "#38A169"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/analytics/dashboard")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!data) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.50">
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
            Loading dashboard...
          </Text>
        </VStack>
      </Flex>
    );
  }

  const statusChartData = data.charts.statusChart.labels.map((label, i) => ({
    name: label,
    value: data.charts.statusChart.data[i],
  }));

  const completionData = data.charts.completionReopenChart.labels.map(
    (label, i) => ({
      name: label,
      value: data.charts.completionReopenChart.data[i],
    })
  );

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      onClick: () => navigate("/tasks"),
    },
    {
      id: "visualization",
      label: "Visualization",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      onClick: () => navigate("/visualizations"),
    },
    {
      id: "friends",
      label: "Friends",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: "teams",
      label: "Teams",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w={isSidebarOpen ? "280px" : "80px"}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        transition="all 0.3s"
        position="relative"
      >
        <VStack h="full" spacing={0} align="stretch">
          {/* Logo/Header */}
          <Box p={6} borderBottom="1px" borderColor="gray.200">
            <HStack spacing={3}>
              <Box
                w={12}
                h={12}
                bgGradient="linear(to-br, blue.500, indigo.600)"
                rounded="xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
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
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </Box>
              {isSidebarOpen && (
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    TaskFlow
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Manage & Track
                  </Text>
                </Box>
              )}
            </HStack>
          </Box>

          {/* User Profile */}
          {isSidebarOpen && (
            <Box p={4} borderBottom="1px" borderColor="gray.200">
              <HStack spacing={3}>
                <Avatar
                  size="md"
                  name="User Name"
                  bg="blue.500"
                  color="white"
                />
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.800">
                    User Name
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    user@email.com
                  </Text>
                </Box>
              </HStack>
            </Box>
          )}

          {/* Menu Items */}
          <VStack flex={1} spacing={2} p={4} align="stretch">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                onClick={item.onClick || (() => setActiveSection(item.id))}
                justifyContent="flex-start"
                variant="ghost"
                colorScheme={activeSection === item.id ? "blue" : "gray"}
                bg={activeSection === item.id ? "blue.50" : "transparent"}
                color={activeSection === item.id ? "blue.600" : "gray.700"}
                size="lg"
                leftIcon={item.icon}
                _hover={{
                  bg: activeSection === item.id ? "blue.100" : "gray.100",
                }}
                transition="all 0.2s"
              >
                {isSidebarOpen && item.label}
              </Button>
            ))}
          </VStack>

          {/* Logout Button */}
          <Box p={4} borderTop="1px" borderColor="gray.200">
            <Button
              onClick={handleLogout}
              width="full"
              colorScheme="red"
              variant="ghost"
              justifyContent="flex-start"
              leftIcon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              }
              _hover={{
                bg: "red.50",
              }}
            >
              {isSidebarOpen && "Logout"}
            </Button>

            {/* Toggle Sidebar */}
            <Button
              mt={2}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              width="full"
              variant="ghost"
              size="sm"
              color="gray.600"
            >
              {isSidebarOpen ? "←" : "→"}
            </Button>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflowY="auto" bg="gray.50">
        <Box p={8}>
          {/* Header */}
          <Box mb={8}>
            <Heading
              size="2xl"
              mb={2}
              bgGradient="linear(to-r, blue.600, indigo.600)"
              bgClip="text"
            >
              Dashboard Overview
            </Heading>
            <Text color="gray.600">
              Welcome back! Here's what's happening with your tasks today.
            </Text>
          </Box>

          {/* KPI Cards */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
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
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
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
                    {data.cards.totalTasks}
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
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
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
                    {data.cards.completedTasks}
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
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
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
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Reopened
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {data.cards.reopenedTasks}
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
              _hover={{
                shadow: "lg",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s"
            >
              <HStack spacing={4}>
                <Box
                  w={12}
                  h={12}
                  bg="purple.100"
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
                    stroke="#805AD5"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Avg Time (min)
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                    {data.cards.avgCompletionTimeMinutes ?? "-"}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Grid>

          {/* Charts */}
          <Grid
            templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
            gap={6}
          >
            <Box
              bg="white"
              p={6}
              rounded="2xl"
              shadow="md"
              border="1px"
              borderColor="gray.100"
            >
              <Text fontSize="lg" fontWeight="bold" mb={6} color="gray.800">
                Task Status Distribution
              </Text>
              <Box display="flex" justifyContent="center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {statusChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>

            <Box
              bg="white"
              p={6}
              rounded="2xl"
              shadow="md"
              border="1px"
              borderColor="gray.100"
            >
              <Text fontSize="lg" fontWeight="bold" mb={6} color="gray.800">
                Completion vs Reopen
              </Text>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3182CE" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}