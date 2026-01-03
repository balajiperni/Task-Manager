import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  Select,
  VStack,
  HStack,
  Container,
  Heading,
  Badge,
  IconButton,
  Flex,
  useToast,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  
  const TASKS_PER_PAGE = 5;
  const navigate = useNavigate();
  const toast = useToast();

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || res.data);
    } catch (error) {
      toast({
        title: "Error fetching tasks",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);

  const createTask = async () => {
    if (!newTitle.trim()) {
      toast({
        title: "Please enter a task title",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    try {
      await api.post("/tasks", {
        title: newTitle,
        priority: newPriority,
        dueDate: newDueDate || null,
      });

      setNewTitle("");
      setNewPriority("Medium");
      setNewDueDate("");
      fetchTasks();
      
      toast({
        title: "Task created successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error creating task",
        status: "error",
        duration: 3000,
      });
    }
  };

  const updateTask = async (id, data) => {
    try {
      await api.put(`/tasks/${id}`, data);
      fetchTasks();
      setEditingId(null);
    } catch (error) {
      toast({
        title: "Error updating task",
        status: "error",
        duration: 3000,
      });
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      toast({
        title: "Task deleted",
        status: "info",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        status: "error",
        duration: 3000,
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "In Progress":
        return "blue";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + TASKS_PER_PAGE
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createTask();
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      bgGradient="linear(to-br, blue.50, purple.50)"
      py={8}
    >
      <Container maxW="6xl">
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
              bgGradient="linear(to-br, blue.500, indigo.600)"
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
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </Box>
            <Box>
              <Heading
                size="lg"
                bgGradient="linear(to-r, blue.600, indigo.600)"
                bgClip="text"
              >
                Task Manager
              </Heading>
              <Text fontSize="sm" color="gray.600">
                {filteredTasks.length} total tasks
              </Text>
            </Box>
          </HStack>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={() => navigate("/dashboard")}
            _hover={{
              bg: "blue.50",
              transform: "translateY(-2px)",
              shadow: "md",
            }}
            transition="all 0.2s"
          >
            ← Back to Dashboard
          </Button>
        </Flex>

        {/* Create Task Card */}
        <Box
          bg="white"
          p={6}
          rounded="2xl"
          shadow="lg"
          mb={6}
          border="1px"
          borderColor="gray.100"
        >
          <HStack spacing={3} mb={4}>
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
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Create New Task
            </Text>
          </HStack>

          <VStack spacing={4} align="stretch">
            <Input
              placeholder="Enter task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              size="lg"
              focusBorderColor="blue.500"
              bg="gray.50"
            />

            <HStack spacing={3}>
              <Select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
                bg="gray.50"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </Select>

              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                size="lg"
                focusBorderColor="blue.500"
                bg="gray.50"
              />

              <Button
                onClick={createTask}
                colorScheme="blue"
                size="lg"
                px={8}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                transition="all 0.2s"
              >
                Add Task
              </Button>
            </HStack>
          </VStack>
        </Box>

        {/* Search & Filters */}
        <Box
          bg="white"
          p={6}
          rounded="2xl"
          shadow="lg"
          mb={6}
          border="1px"
          borderColor="gray.100"
        >
          <HStack spacing={3} mb={4}>
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
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Search & Filter
            </Text>
          </HStack>

          <HStack spacing={3} flexWrap="wrap">
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="lg"
              focusBorderColor="purple.500"
              bg="gray.50"
              flex={1}
              minW="200px"
            />

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="lg"
              focusBorderColor="purple.500"
              bg="gray.50"
              maxW="200px"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Select>

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              size="lg"
              focusBorderColor="purple.500"
              bg="gray.50"
              maxW="200px"
            >
              <option value="All">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </HStack>
        </Box>

        {/* Task List */}
        <VStack spacing={4} align="stretch">
          {paginatedTasks.length === 0 ? (
            <Box
              bg="white"
              p={12}
              rounded="2xl"
              shadow="lg"
              textAlign="center"
              border="1px"
              borderColor="gray.100"
            >
              <Box
                w={16}
                h={16}
                bg="gray.100"
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={4}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A0AEC0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </Box>
              <Text fontSize="xl" fontWeight="bold" color="gray.700" mb={2}>
                No tasks found
              </Text>
              <Text color="gray.500">
                Try adjusting your filters or create a new task
              </Text>
            </Box>
          ) : (
            paginatedTasks.map((task, index) => (
              <Box
                key={task.id}
                bg="white"
                p={6}
                rounded="2xl"
                shadow="md"
                border="1px"
                borderColor="gray.100"
                _hover={{
                  shadow: "xl",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="start" mb={3}>
                  <HStack spacing={3} flex={1}>
                    <Box
                      w={10}
                      h={10}
                      bg={`${getStatusColor(task.status)}.100`}
                      rounded="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={`${getStatusColor(task.status)}.600`}
                      >
                        {index + 1 + startIndex}
                      </Text>
                    </Box>

                    <Box flex={1}>
                      {editingId === task.id ? (
                        <Input
                          value={task.title}
                          onChange={(e) =>
                            updateTask(task.id, { title: e.target.value })
                          }
                          onBlur={() => setEditingId(null)}
                          autoFocus
                          size="md"
                          fontWeight="bold"
                        />
                      ) : (
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color="gray.800"
                          cursor="pointer"
                          onClick={() => setEditingId(task.id)}
                          _hover={{ color: "blue.600" }}
                        >
                          {task.title}
                        </Text>
                      )}

                      <HStack spacing={2} mt={2}>
                        <Badge
                          colorScheme={getPriorityColor(task.priority)}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize="xs"
                        >
                          {task.priority}
                        </Badge>
                        <Badge
                          colorScheme={getStatusColor(task.status)}
                          px={3}
                          py={1}
                          rounded="full"
                          fontSize="xs"
                        >
                          {task.status}
                        </Badge>
                        {task.dueDate && (
                          <HStack spacing={1} color="gray.500" fontSize="sm">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="3"
                                y="4"
                                width="18"
                                height="18"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <Text>{task.dueDate.split("T")[0]}</Text>
                          </HStack>
                        )}
                      </HStack>
                    </Box>
                  </HStack>

                  <Button
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    _hover={{
                      bg: "red.50",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </Button>
                </Flex>

                <Divider my={3} />

                <HStack spacing={3}>
                  <Select
                    value={task.priority}
                    onChange={(e) =>
                      updateTask(task.id, { priority: e.target.value })
                    }
                    size="sm"
                    maxW="150px"
                    focusBorderColor="blue.500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>

                  <Select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task.id, { status: e.target.value })
                    }
                    size="sm"
                    maxW="150px"
                    focusBorderColor="blue.500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                </HStack>
              </Box>
            ))
          )}
        </VStack>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center" mt={8} gap={2}>
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={currentPage === 1}
              variant="outline"
              colorScheme="blue"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                colorScheme="blue"
                variant={currentPage === index + 1 ? "solid" : "outline"}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "md",
                }}
                transition="all 0.2s"
              >
                {index + 1}
              </Button>
            ))}

            <Button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              isDisabled={currentPage === totalPages}
              variant="outline"
              colorScheme="blue"
            >
              Next
            </Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
}