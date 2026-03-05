// src/pages/Tasks.jsx
import { useEffect, useState } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  Select,
  VStack,
  HStack,
  Heading,
  Badge,
  Flex,
  useToast,
  Avatar,
  AvatarGroup,
  Divider,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [friends, setFriends] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [selectedCollaborators, setSelectedCollaborators] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [aiSubtasks, setAiSubtasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks || res.data);
    } catch (error) {
      toast({ title: "Error fetching tasks", status: "error", duration: 3000, isClosable: true });
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await api.get("/friends");
      setFriends(res.data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchTasks(); fetchFriends(); }, []);

  const createTask = async () => {
    if (!newTitle.trim()) {
      toast({ title: "Please enter a task title", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    try {
      await api.post("/tasks", {
        title: newTitle,
        priority: newPriority,
        dueDate: newDueDate || null,
        collaborators: selectedCollaborators,
      });
      setNewTitle("");
      setNewPriority("Medium");
      setNewDueDate("");
      setSelectedCollaborators([]);
      setSelectedTask(null);
      fetchTasks();
      toast({ title: "Task created successfully", status: "success", duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: "Error creating task", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      toast({ title: "Task updated", status: "success", duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: "Error updating task", status: "error", duration: 3000, isClosable: true });
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      if (selectedTask?.id === id) setSelectedTask(null);
      toast({ title: "Task deleted", status: "info", duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: "Error deleting task", status: "error", duration: 3000, isClosable: true });
    }
  };

  const toggleCollaborator = (friendId) => {
    setSelectedCollaborators((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
    );
  };

  const generateAiSubtasks = async () => {
    if (!newTitle.trim()) {
      toast({ title: "Enter a task title first", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    setAiLoading(true);
    setAiSubtasks([]);
    try {
      const res = await api.post("/ai/suggest", { title: newTitle });
      setAiSubtasks(res.data.subtasks || res.data || []);
    } catch {
      toast({ title: "AI generation failed", description: "Make sure the ML service is running on port 8000", status: "warning", duration: 3000, isClosable: true });
    } finally {
      setAiLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "red";
      case "Medium": return "orange";
      case "Low": return "green";
      default: return "gray";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "green";
      case "In Progress": return "blue";
      case "Pending": return "yellow";
      default: return "gray";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Flex h="100vh" bg={theme.bg.primary}>
      <Sidebar onTaskCreated={fetchTasks} />

      {/* Task List Panel */}
      <Box
        w="380px"
        bg={theme.bg.card}
        borderRight="1px"
        borderColor={theme.border.primary}
        display="flex"
        flexDirection="column"
        h="100vh"
        flexShrink={0}
      >
        {/* Header */}
        <Box
          p={4}
          bg={theme.bg.card}
          borderBottom="1px"
          borderColor={theme.border.primary}
        >
          <HStack justify="space-between" mb={3}>
            <HStack spacing={3}>
              <Box
                w={9}
                h={9}
                bg={theme.isDark ? "blue.900" : "blue.50"}
                border="1px"
                borderColor={theme.isDark ? "blue.700" : "blue.200"}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </Box>
              <Heading size="md" color={theme.text.primary}>My Tasks</Heading>
            </HStack>
            <Badge colorScheme="blue" px={2} py={1} rounded="full" fontSize="xs">
              {filteredTasks.length}
            </Badge>
          </HStack>

          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={theme.isDark ? "gray.700" : "gray.50"}
            border="1px"
            borderColor={theme.border.secondary}
            _placeholder={{ color: theme.text.tertiary }}
            color={theme.text.primary}
            size="sm"
            rounded="lg"
            focusBorderColor="blue.500"
            _focus={{ borderColor: "blue.400" }}
          />
        </Box>

        {/* Filter Tabs */}
        <HStack spacing={0} borderBottom="1px" borderColor={theme.border.primary} bg={theme.bg.tertiary}>
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              flex={1}
              variant="ghost"
              size="sm"
              borderRadius="0"
              borderBottom="2px"
              borderColor={statusFilter === status ? "blue.500" : "transparent"}
              color={statusFilter === status ? "blue.500" : theme.text.secondary}
              fontWeight={statusFilter === status ? "bold" : "normal"}
              _hover={{ bg: theme.bg.hover }}
              fontSize="xs"
            >
              {status === "All" ? "All" : status === "In Progress" ? "Active" : status}
            </Button>
          ))}
        </HStack>

        {/* Task List */}
        <Box flex={1} overflowY="auto">
          {filteredTasks.length === 0 ? (
            <Box p={8} textAlign="center">
              <Box
                w={16}
                h={16}
                bg={theme.isDark ? "gray.700" : "gray.100"}
                rounded="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={3}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.isDark ? "#718096" : "#A0AEC0"} strokeWidth="1.5">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </Box>
              <Text color={theme.text.tertiary} fontSize="sm">No tasks found</Text>
            </Box>
          ) : (
            filteredTasks.map((task) => (
              <Box
                key={task.id}
                p={4}
                borderBottom="1px"
                borderColor={theme.border.primary}
                cursor="pointer"
                bg={selectedTask?.id === task.id ? (theme.isDark ? "blue.900" : "blue.50") : theme.bg.card}
                _hover={{ bg: selectedTask?.id === task.id ? (theme.isDark ? "blue.900" : "blue.50") : theme.bg.hover }}
                onClick={() => setSelectedTask(task)}
                transition="all 0.2s"
                position="relative"
              >
                {selectedTask?.id === task.id && (
                  <Box
                    position="absolute"
                    left="0"
                    top="0"
                    bottom="0"
                    w="3px"
                    bg="blue.500"
                    borderRightRadius="full"
                  />
                )}
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold" fontSize="sm" noOfLines={1} flex={1} color={theme.text.primary}>
                    {task.title}
                  </Text>
                  <Badge colorScheme={getStatusColor(task.status)} fontSize="xs" flexShrink={0}>
                    {task.status === "In Progress" ? "Active" : task.status}
                  </Badge>
                </HStack>
                <HStack spacing={2}>
                  <Badge colorScheme={getPriorityColor(task.priority)} fontSize="xs" variant="subtle">
                    {task.priority}
                  </Badge>
                  {task.dueDate && (
                    <Text fontSize="xs" color={theme.text.tertiary}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                  )}
                </HStack>
                {task.collaborators && task.collaborators.length > 0 && (
                  <HStack mt={2}>
                    <AvatarGroup size="xs" max={3}>
                      {task.collaborators.map((collab, idx) => (
                        <Avatar key={idx} name={collab.user?.name || "User"} bg="blue.500" />
                      ))}
                    </AvatarGroup>
                    <Text fontSize="xs" color={theme.text.tertiary}>
                      {task.collaborators.length} collaborator{task.collaborators.length !== 1 ? "s" : ""}
                    </Text>
                  </HStack>
                )}
              </Box>
            ))
          )}
        </Box>

        {/* New Task Button */}
        <Box p={4} borderTop="1px" borderColor={theme.border.primary} bg={theme.bg.card}>
          <Button
            colorScheme="blue"
            width="full"
            bgGradient={theme.gradient.primary}
            _hover={{ bgGradient: "linear(to-r, blue.600, indigo.700)", transform: "translateY(-1px)", shadow: "md" }}
            transition="all 0.2s"
            color="white"
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
            onClick={() => {
              setSelectedTask({ isNew: true });
              setNewTitle("");
              setNewPriority("Medium");
              setNewDueDate("");
              setSelectedCollaborators([]);
              setAiSubtasks([]);
            }}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Right Panel */}
      <Box flex={1} display="flex" flexDirection="column" bg={theme.bg.primary}>
        {!selectedTask ? (
          <Flex flex={1} align="center" justify="center" direction="column" p={8}>
            <Box
              w={32}
              h={32}
              bg={theme.isDark ? "gray.700" : "gray.100"}
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme.isDark ? "#718096" : "#CBD5E0"} strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </Box>
            <Heading size="lg" color={theme.text.secondary} mb={2} textAlign="center">
              Select a task to view details
            </Heading>
            <Text color={theme.text.tertiary} textAlign="center" maxW="md">
              Choose a task from the list or create a new one to get started
            </Text>
          </Flex>
        ) : selectedTask.isNew ? (
          <Box display="flex" flexDirection="column" h="100vh">
            {/* Header */}
            <HStack
              p={4}
              bg={theme.bg.card}
              borderBottom="1px"
              borderColor={theme.border.primary}
              justify="space-between"
            >
              <HStack spacing={3}>
                <IconButton
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  }
                  variant="ghost"
                  color={theme.text.secondary}
                  onClick={() => setSelectedTask(null)}
                  aria-label="Close"
                />
                <Heading size="md" color={theme.text.primary}>Create New Task</Heading>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={createTask}
                bgGradient={theme.gradient.primary}
                color="white"
                _hover={{ bgGradient: "linear(to-r, blue.600, indigo.700)" }}
                leftIcon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              >
                Create Task
              </Button>
            </HStack>

            <Box flex={1} overflowY="auto" p={6} bg={theme.bg.primary}>
              <VStack spacing={5} align="stretch" maxW="2xl" mx="auto">
                {/* Task Title */}
                <Box>
                  <Text fontWeight="semibold" mb={2} color={theme.text.primary} fontSize="sm">
                    Task Title *
                  </Text>
                  <Input
                    placeholder="Enter task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && createTask()}
                    size="lg"
                    focusBorderColor="blue.500"
                    borderColor={theme.border.secondary}
                    bg={theme.bg.card}
                    color={theme.text.primary}
                    _placeholder={{ color: theme.text.tertiary }}
                    _hover={{ borderColor: "blue.300" }}
                  />
                </Box>

                {/* AI Subtask Generator */}
                <Box
                  bg={theme.isDark ? "blue.900" : "blue.50"}
                  border="1px"
                  borderColor={theme.isDark ? "blue.700" : "blue.200"}
                  rounded="xl"
                  p={4}
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack spacing={2}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                      <Text fontWeight="semibold" color={theme.isDark ? "blue.300" : "blue.700"} fontSize="sm">
                        AI Subtask Generator
                      </Text>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      isLoading={aiLoading}
                      loadingText="Generating..."
                      onClick={generateAiSubtasks}
                    >
                      Generate Subtasks
                    </Button>
                  </HStack>
                  <Text fontSize="xs" color={theme.isDark ? "blue.400" : "blue.500"} mb={aiSubtasks.length > 0 ? 3 : 0}>
                    {aiSubtasks.length === 0
                      ? "Enter a title above then click Generate to get AI-suggested subtasks."
                      : `${aiSubtasks.length} subtasks suggested:`}
                  </Text>
                  {aiSubtasks.length > 0 && (
                    <VStack spacing={2} align="stretch">
                      {aiSubtasks.map((sub, i) => (
                        <HStack
                          key={i}
                          bg={theme.bg.card}
                          border="1px"
                          borderColor={theme.isDark ? "blue.700" : "blue.100"}
                          rounded="lg"
                          p={3}
                          spacing={3}
                        >
                          <Box
                            w={6}
                            h={6}
                            bg={theme.isDark ? "blue.800" : "blue.100"}
                            rounded="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <Text fontSize="xs" fontWeight="bold" color="blue.500">{i + 1}</Text>
                          </Box>
                          <Text fontSize="sm" color={theme.text.primary}>
                            {typeof sub === "string" ? sub : sub.title || sub.name || JSON.stringify(sub)}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                </Box>

                {/* Priority & Due Date */}
                <HStack spacing={4} align="start">
                  <Box flex={1}>
                    <Text fontWeight="semibold" mb={2} color={theme.text.primary} fontSize="sm">Priority</Text>
                    <Select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      size="md"
                      focusBorderColor="blue.500"
                      borderColor={theme.border.secondary}
                      bg={theme.bg.card}
                      color={theme.text.primary}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </Select>
                  </Box>
                  <Box flex={1}>
                    <Text fontWeight="semibold" mb={2} color={theme.text.primary} fontSize="sm">Due Date</Text>
                    <Input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      size="md"
                      focusBorderColor="blue.500"
                      borderColor={theme.border.secondary}
                      bg={theme.bg.card}
                      color={theme.text.primary}
                    />
                  </Box>
                </HStack>

                <Divider borderColor={theme.border.primary} />

                {/* Collaborators */}
                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text fontWeight="semibold" color={theme.text.primary} fontSize="sm">
                      Add Collaborators (Friends)
                    </Text>
                    <Badge colorScheme="blue" fontSize="xs">
                      {selectedCollaborators.length} selected
                    </Badge>
                  </HStack>

                  {friends.length === 0 ? (
                    <Box
                      p={5}
                      bg={theme.bg.secondary}
                      rounded="xl"
                      textAlign="center"
                      border="1px"
                      borderColor={theme.border.primary}
                    >
                      <Text color={theme.text.tertiary} mb={3} fontSize="sm">No friends available</Text>
                      <Button size="sm" colorScheme="blue" variant="outline" onClick={() => navigate("/friends")}>
                        Add Friends
                      </Button>
                    </Box>
                  ) : (
                    <VStack spacing={2} align="stretch">
                      {friends.map((friend) => (
                        <Box
                          key={friend.id}
                          p={3}
                          bg={theme.bg.card}
                          rounded="xl"
                          border="1px"
                          borderColor={selectedCollaborators.includes(friend.id) ? "blue.400" : theme.border.primary}
                          cursor="pointer"
                          onClick={() => toggleCollaborator(friend.id)}
                          _hover={{ borderColor: "blue.400" }}
                          transition="all 0.2s"
                        >
                          <HStack>
                            <Checkbox
                              isChecked={selectedCollaborators.includes(friend.id)}
                              colorScheme="blue"
                              onChange={() => toggleCollaborator(friend.id)}
                            />
                            <Avatar size="sm" name={friend.name} bg="blue.500" />
                            <Box flex={1}>
                              <Text fontWeight="medium" fontSize="sm" color={theme.text.primary}>{friend.name}</Text>
                              <Text fontSize="xs" color={theme.text.tertiary}>{friend.email}</Text>
                            </Box>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </VStack>
            </Box>
          </Box>
        ) : (
          // View Task Details
          <Box display="flex" flexDirection="column" h="100vh">
            {/* Header */}
            <HStack
              p={4}
              bg={theme.bg.card}
              borderBottom="1px"
              borderColor={theme.border.primary}
              justify="space-between"
            >
              <HStack spacing={3} flex={1}>
                <IconButton
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  }
                  variant="ghost"
                  color={theme.text.secondary}
                  onClick={() => setSelectedTask(null)}
                  aria-label="Close"
                />
                <Heading size="md" noOfLines={1} flex={1} color={theme.text.primary}>
                  {selectedTask.title}
                </Heading>
              </HStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
                    </svg>
                  }
                  variant="ghost"
                  color={theme.text.secondary}
                />
                <MenuList bg={theme.bg.card} borderColor={theme.border.primary}>
                  <MenuItem
                    onClick={() => deleteTask(selectedTask.id)}
                    color="red.500"
                    bg={theme.bg.card}
                    _hover={{ bg: theme.isDark ? "red.900" : "red.50" }}
                  >
                    Delete Task
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/* Task Details */}
            <Box flex={1} overflowY="auto" p={6} bg={theme.bg.primary}>
              <VStack spacing={5} align="stretch" maxW="2xl" mx="auto">
                {/* Status Badges */}
                <HStack spacing={3} flexWrap="wrap">
                  <Badge colorScheme={getPriorityColor(selectedTask.priority)} px={3} py={1} fontSize="sm" rounded="full">
                    {selectedTask.priority} Priority
                  </Badge>
                  <Badge colorScheme={getStatusColor(selectedTask.status)} px={3} py={1} fontSize="sm" rounded="full">
                    {selectedTask.status}
                  </Badge>
                </HStack>

                {/* Due Date */}
                {selectedTask.dueDate && (
                  <HStack spacing={2} color={theme.text.secondary}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <Text fontSize="sm">Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</Text>
                  </HStack>
                )}

                {/* Status Update */}
                <Box bg={theme.bg.card} p={5} rounded="xl" border="1px" borderColor={theme.border.primary}>
                  <Text fontWeight="semibold" mb={3} color={theme.text.primary} fontSize="sm">Update Status</Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {["Pending", "In Progress", "Completed"].map((status) => (
                      <Button
                        key={status}
                        onClick={() => updateTaskStatus(selectedTask.id, status)}
                        colorScheme={selectedTask.status === status ? getStatusColor(status) : "gray"}
                        variant={selectedTask.status === status ? "solid" : "outline"}
                        size="sm"
                        borderColor={theme.border.secondary}
                      >
                        {status}
                      </Button>
                    ))}
                  </HStack>
                </Box>

                {/* Collaborators */}
                <Box bg={theme.bg.card} p={5} rounded="xl" border="1px" borderColor={theme.border.primary}>
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="semibold" color={theme.text.primary} fontSize="sm">Working Together</Text>
                    {selectedTask.collaborators && (
                      <Badge colorScheme="blue" fontSize="xs">
                        {selectedTask.collaborators.length} member{selectedTask.collaborators.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </HStack>

                  {selectedTask.collaborators && selectedTask.collaborators.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {selectedTask.collaborators.map((collab, idx) => (
                        <HStack key={idx} p={3} bg={theme.bg.secondary} rounded="xl" border="1px" borderColor={theme.border.primary}>
                          <Avatar size="sm" name={collab.user?.name || "User"} bg="blue.500" />
                          <Box flex={1}>
                            <Text fontWeight="medium" fontSize="sm" color={theme.text.primary}>
                              {collab.user?.name || "Unknown User"}
                            </Text>
                            <Text fontSize="xs" color={theme.text.tertiary}>{collab.user?.email || "No email"}</Text>
                          </Box>
                          <Badge colorScheme="green" fontSize="xs">Active</Badge>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <Box p={5} bg={theme.bg.secondary} rounded="xl" textAlign="center" border="1px" borderColor={theme.border.primary}>
                      <Text color={theme.text.tertiary} fontSize="sm">No collaborators yet. Add friends when creating tasks.</Text>
                    </Box>
                  )}
                </Box>

                {/* Activity Timeline */}
                <Box bg={theme.bg.card} p={5} rounded="xl" border="1px" borderColor={theme.border.primary}>
                  <Text fontWeight="semibold" mb={4} color={theme.text.primary} fontSize="sm">Activity Timeline</Text>
                  <VStack spacing={3} align="stretch">
                    {selectedTask.completedAt && (
                      <HStack>
                        <Box w={2} h={2} bg="green.500" rounded="full" flexShrink={0} />
                        <Text fontSize="sm" color={theme.text.secondary}>
                          Completed on {new Date(selectedTask.completedAt).toLocaleString()}
                        </Text>
                      </HStack>
                    )}
                    {selectedTask.startedAt && (
                      <HStack>
                        <Box w={2} h={2} bg="blue.500" rounded="full" flexShrink={0} />
                        <Text fontSize="sm" color={theme.text.secondary}>
                          Started on {new Date(selectedTask.startedAt).toLocaleString()}
                        </Text>
                      </HStack>
                    )}
                    <HStack>
                      <Box w={2} h={2} bg={theme.isDark ? "gray.500" : "gray.400"} rounded="full" flexShrink={0} />
                      <Text fontSize="sm" color={theme.text.secondary}>
                        Created on {new Date(selectedTask.createdAt).toLocaleString()}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
}