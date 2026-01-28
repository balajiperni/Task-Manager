// src/pages/Dashboard.jsx - Part 1
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
  Badge,
  Grid,
  Input,
  IconButton,
  Tooltip,
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

const COLORS = ["#3182CE", "#ECC94B", "#38A169"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

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
      <Flex h="100vh" align="center" justify="center" bg={theme.bg.primary}>
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
          <Text fontSize="lg" color={theme.text.secondary}>
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

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      count: data.cards.totalTasks,
      color: "blue",
    },
    {
      id: "completed",
      label: "Completed Tasks",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
      count: data.cards.completedTasks,
      color: "green",
    },
    {
      id: "pending",
      label: "Pending Tasks",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      count: data.charts.statusChart.data[0],
      color: "yellow",
    },
    {
      id: "reopened",
      label: "Reopened Tasks",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
      count: data.cards.reopenedTasks,
      color: "orange",
    },
  ];

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      onClick: () => setActiveMenu("dashboard"),
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      onClick: () => navigate("/friends"),
    },
  ];

  return (
    <Flex h="100vh" bg={theme.bg.primary}>
      {/* Left Sidebar - Navigation */}
      <Box
        w="80px"
        bg={theme.bg.card}
        borderRight="1px"
        borderColor={theme.border.primary}
        display="flex"
        flexDirection="column"
      >
        {/* Logo */}
        <Box p={4} borderBottom="1px" borderColor={theme.border.primary}>
          <Box
            w={12}
            h={12}
            bgGradient={theme.gradient.primary}
            rounded="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </Box>
        </Box>

        {/* Menu Icons */}
        <VStack flex={1} spacing={0} p={2} pt={4}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={item.onClick}
              variant="ghost"
              w="full"
              h="60px"
              display="flex"
              flexDirection="column"
              fontSize="xs"
              color={activeMenu === item.id ? "blue.600" : theme.text.secondary}
              bg={activeMenu === item.id ? (theme.isDark ? "blue.900" : "blue.50") : "transparent"}
              _hover={{ bg: activeMenu === item.id ? (theme.isDark ? "blue.800" : "blue.100") : theme.bg.hover }}
              borderRadius="lg"
            >
              {item.icon}
            </Button>
          ))}
        </VStack>

        {/* Theme Toggle & Logout */}
        <Box p={4} borderTop="1px" borderColor={theme.border.primary}>
          <Tooltip label={theme.isDark ? "Light Mode" : "Dark Mode"}>
            <IconButton
              icon={
                theme.isDark ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )
              }
              onClick={theme.toggleTheme}
              variant="ghost"
              w="full"
              h="50px"
              mb={2}
              borderRadius="lg"
              aria-label="Toggle theme"
            />
          </Tooltip>
          <Button
            onClick={handleLogout}
            variant="ghost"
            w="full"
            h="50px"
            color="red.600"
            _hover={{ bg: theme.isDark ? "red.900" : "red.50" }}
            borderRadius="lg"
            mb={2}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </Button>
          <Avatar
            size="md"
            name="User Name"
            bg="blue.500"
            color="white"
            mx="auto"
            cursor="pointer"
          />
        </Box>
      </Box>

      {/* Middle Panel - Sections List */}
      <Box
        w="380px"
        bg={theme.bg.card}
        borderRight="1px"
        borderColor={theme.border.primary}
        display="flex"
        flexDirection="column"
        h="100vh"
      >
        {/* Header */}
        <Box p={4} bg={theme.bg.tertiary} borderBottom="1px" borderColor={theme.border.primary}>
          <Heading size="md" mb={3} color={theme.text.primary}>
            Dashboard
          </Heading>
          <Input
            placeholder="Search sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={theme.bg.card}
            border="1px"
            borderColor={theme.border.secondary}
            color={theme.text.primary}
            size="sm"
            borderRadius="lg"
            _focus={{ borderColor: "blue.500" }}
            _placeholder={{ color: theme.text.tertiary }}
          />
        </Box>

        {/* Sections List */}
        <Box flex={1} overflowY="auto">
          {sections
            .filter(section => 
              section.label.toLowerCase().includes(search.toLowerCase())
            )
            .map((section) => (
              <Box
                key={section.id}
                p={4}
                borderBottom="1px"
                borderColor={theme.border.primary}
                cursor="pointer"
                bg={activeSection === section.id ? (theme.isDark ? "blue.900" : "blue.50") : theme.bg.card}
                _hover={{ bg: activeSection === section.id ? (theme.isDark ? "blue.900" : "blue.50") : theme.bg.hover }}
                onClick={() => setActiveSection(section.id)}
                transition="all 0.2s"
              >
                <HStack spacing={3}>
                  <Box
                    w={12}
                    h={12}
                    bg={theme.isDark ? `${section.color}.900` : `${section.color}.100`}
                    rounded="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Box color={`${section.color}.600`}>
                      {section.icon}
                    </Box>
                  </Box>
                  <Box flex={1}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontWeight="bold" fontSize="sm" color={theme.text.primary}>
                        {section.label}
                      </Text>
                      <Badge
                        colorScheme={section.color}
                        fontSize="xs"
                        px={2}
                        py={1}
                        rounded="full"
                      >
                        {section.count}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color={theme.text.tertiary}>
                      Click to view details
                    </Text>
                  </Box>
                </HStack>
              </Box>
            ))}
        </Box>

        {/* Stats Summary at Bottom */}
        <Box p={4} bg={theme.bg.tertiary} borderTop="1px" borderColor={theme.border.primary}>
          <HStack justify="space-around">
            <VStack spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color={theme.text.primary}>
                {data.cards.totalTasks}
              </Text>
              <Text fontSize="xs" color={theme.text.tertiary}>
                Total
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                {data.cards.completedTasks}
              </Text>
              <Text fontSize="xs" color={theme.text.tertiary}>
                Done
              </Text>
            </VStack>
            <VStack spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="orange.600">
                {data.cards.reopenedTasks}
              </Text>
              <Text fontSize="xs" color={theme.text.tertiary}>
                Reopened
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Box>

      {/* Right Panel - Details View */}
      <Box flex={1} display="flex" flexDirection="column" bg={theme.bg.primary}>
        {activeSection === "overview" ? (
          // Overview with Charts
          <Box flex={1} overflowY="auto">
            {/* Header */}
            <Box bg={theme.bg.card} p={6} borderBottom="1px" borderColor={theme.border.primary}>
              <Heading size="lg" color={theme.text.primary} mb={2}>
                Dashboard Overview
              </Heading>
              <Text color={theme.text.secondary}>
                Welcome back! Here's what's happening with your tasks today.
              </Text>
            </Box>

            {/* Content */}
            <Box p={6}>
              {/* KPI Cards Grid */}
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={6}
                mb={6}
              >
                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
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
                      bg={theme.isDark ? "blue.900" : "blue.100"}
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
                      <Text fontSize="sm" color={theme.text.secondary} fontWeight="medium">
                        Total Tasks
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={theme.text.primary}>
                        {data.cards.totalTasks}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
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
                      bg={theme.isDark ? "green.900" : "green.100"}
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
                      <Text fontSize="sm" color={theme.text.secondary} fontWeight="medium">
                        Completed
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={theme.text.primary}>
                        {data.cards.completedTasks}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
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
                      bg={theme.isDark ? "orange.900" : "orange.100"}
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
                      <Text fontSize="sm" color={theme.text.secondary} fontWeight="medium">
                        Reopened
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={theme.text.primary}>
                        {data.cards.reopenedTasks}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
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
                      bg={theme.isDark ? "purple.900" : "purple.100"}
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
                      <Text fontSize="sm" color={theme.text.secondary} fontWeight="medium">
                        Avg Time (min)
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={theme.text.primary}>
                        {data.cards.avgCompletionTimeMinutes ?? "-"}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </Grid>

              {/* Charts */}
              <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
                >
                  <Text fontSize="lg" fontWeight="bold" mb={6} color={theme.text.primary}>
                    Task Status Distribution
                  </Text>
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
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Box
                  bg={theme.bg.card}
                  p={6}
                  rounded="2xl"
                  shadow="md"
                  border="1px"
                  borderColor={theme.border.primary}
                >
                  <Text fontSize="lg" fontWeight="bold" mb={6} color={theme.text.primary}>
                    Completion vs Reopen
                  </Text>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={completionData}>
                      <XAxis dataKey="name" stroke={theme.text.tertiary} />
                      <YAxis stroke={theme.text.tertiary} />
                      <ChartTooltip />
                      <Bar dataKey="value" fill="#3182CE" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Box>
          </Box>
        ) : (
          // Detail View for Selected Section
          <Box flex={1} overflowY="auto">
            <Box bg={theme.bg.card} p={6} borderBottom="1px" borderColor={theme.border.primary}>
              <HStack spacing={3}>
                <Box
                  w={12}
                  h={12}
                  bg={theme.isDark ? `${sections.find(s => s.id === activeSection)?.color || 'blue'}.900` : `${sections.find(s => s.id === activeSection)?.color || 'blue'}.100`}
                  rounded="xl"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box color={`${sections.find(s => s.id === activeSection)?.color || 'blue'}.600`}>
                    {sections.find(s => s.id === activeSection)?.icon}
                  </Box>
                </Box>
                <Box>
                  <Heading size="lg" color={theme.text.primary}>
                    {sections.find(s => s.id === activeSection)?.label}
                  </Heading>
                  <Text color={theme.text.secondary} fontSize="sm">
                    {sections.find(s => s.id === activeSection)?.count} items
                  </Text>
                </Box>
              </HStack>
            </Box>

            <Flex
              flex={1}
              align="center"
              justify="center"
              direction="column"
              p={12}
            >
              <Box
                w={32}
                h={32}
                bg={theme.isDark ? `${sections.find(s => s.id === activeSection)?.color || 'blue'}.900` : `${sections.find(s => s.id === activeSection)?.color || 'blue'}.100`}
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={6}
              >
                <Box color={`${sections.find(s => s.id === activeSection)?.color || 'blue'}.600`}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                </Box>
              </Box>
              <Heading size="xl" color={theme.text.primary} mb={2}>
                {sections.find(s => s.id === activeSection)?.label}
              </Heading>
              <Text color={theme.text.secondary} textAlign="center" maxW="md" mb={6}>
                Detailed view of {sections.find(s => s.id === activeSection)?.label.toLowerCase()} with comprehensive analytics
              </Text>
              <Badge
                colorScheme={sections.find(s => s.id === activeSection)?.color}
                fontSize="lg"
                px={4}
                py={2}
                rounded="full"
              >
                {sections.find(s => s.id === activeSection)?.count} Total
              </Badge>
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
}