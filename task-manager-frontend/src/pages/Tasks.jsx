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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  
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
        isClosable: true,
      });
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

  useEffect(() => {
    fetchTasks();
    fetchFriends();
  }, []);

  const createTask = async () => {
    if (!newTitle.trim()) {
      toast({
        title: "Please enter a task title",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
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
      
      toast({
        title: "Task created successfully",
        description: selectedCollaborators.length > 0 ? "Collaborators have been added" : undefined,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error creating task",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
      toast({
        title: "Task updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
      toast({
        title: "Task deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting task",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleCollaborator = (friendId) => {
    setSelectedCollaborators(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      createTask();
    }
  };

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Left Panel - Task List (WhatsApp style) */}
      <Box
        w="400px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        display="flex"
        flexDirection="column"
        h="100vh"
      >
        {/* Header */}
        <Box
          p={4}
          bg="blue.500"
          color="white"
          borderBottom="1px"
          borderColor="blue.600"
        >
          <HStack justify="space-between" mb={3}>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bg="white"
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3182CE"
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </Box>
              <Heading size="md">My Tasks</Heading>
            </HStack>
            <IconButton
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              }
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => navigate("/dashboard")}
              aria-label="Back to dashboard"
            />
          </HStack>

          {/* Search */}
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="whiteAlpha.300"
            border="none"
            _placeholder={{ color: "whiteAlpha.800" }}
            color="white"
          />
        </Box>

        {/* Filter Tabs */}
        <HStack spacing={0} borderBottom="1px" borderColor="gray.200" bg="gray.50">
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
              color={statusFilter === status ? "blue.600" : "gray.600"}
              fontWeight={statusFilter === status ? "bold" : "normal"}
              _hover={{ bg: "gray.100" }}
            >
              {status === "All" ? "All" : status.split(" ")[0]}
            </Button>
          ))}
        </HStack>

        {/* Task List */}
        <Box flex={1} overflowY="auto">
          {filteredTasks.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text color="gray.500">No tasks found</Text>
            </Box>
          ) : (
            filteredTasks.map((task) => (
              <Box
                key={task.id}
                p={4}
                borderBottom="1px"
                borderColor="gray.100"
                cursor="pointer"
                bg={selectedTask?.id === task.id ? "blue.50" : "white"}
                _hover={{ bg: selectedTask?.id === task.id ? "blue.50" : "gray.50" }}
                onClick={() => setSelectedTask(task)}
                transition="all 0.2s"
              >
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="bold" fontSize="md" noOfLines={1} flex={1}>
                    {task.title}
                  </Text>
                  <Badge colorScheme={getStatusColor(task.status)} fontSize="xs">
                    {task.status === "In Progress" ? "Active" : task.status}
                  </Badge>
                </HStack>
                
                <HStack spacing={2}>
                  <Badge colorScheme={getPriorityColor(task.priority)} fontSize="xs">
                    {task.priority}
                  </Badge>
                  {task.dueDate && (
                    <Text fontSize="xs" color="gray.500">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                  )}
                </HStack>

                {/* Collaborators Preview */}
                {task.collaborators && task.collaborators.length > 0 && (
                  <HStack mt={2}>
                    <AvatarGroup size="xs" max={3}>
                      {task.collaborators.map((collab, idx) => (
                        <Avatar
                          key={idx}
                          name={collab.user?.name || "User"}
                          bg="blue.500"
                        />
                      ))}
                    </AvatarGroup>
                    <Text fontSize="xs" color="gray.500">
                      {task.collaborators.length} collaborator{task.collaborators.length !== 1 ? 's' : ''}
                    </Text>
                  </HStack>
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Create Task Button */}
        <Box p={4} borderTop="1px" borderColor="gray.200">
          <Button
            colorScheme="blue"
            width="full"
            leftIcon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
            onClick={() => {
              setSelectedTask({ isNew: true });
              setNewTitle("");
              setNewPriority("Medium");
              setNewDueDate("");
              setSelectedCollaborators([]);
            }}
          >
            New Task
          </Button>
        </Box>
      </Box>

      {/* Right Panel - Task Details / Create (WhatsApp Chat style) */}
      <Box flex={1} display="flex" flexDirection="column" bg="gray.50">
        {!selectedTask ? (
          // Empty State
          <Flex flex={1} align="center" justify="center" direction="column" p={8}>
            <Box
              w={32}
              h={32}
              bg="gray.100"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={6}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="1.5">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </Box>
            <Heading size="lg" color="gray.600" mb={2}>
              Select a task to view details
            </Heading>
            <Text color="gray.500" textAlign="center" maxW="md">
              Choose a task from the list or create a new one to get started with collaboration
            </Text>
          </Flex>
        ) : selectedTask.isNew ? (
          // Create New Task Panel
          <Box display="flex" flexDirection="column" h="100vh">
            {/* Header */}
            <HStack
              p={4}
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              justify="space-between"
            >
              <HStack spacing={3}>
                <IconButton
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  }
                  variant="ghost"
                  onClick={() => setSelectedTask(null)}
                  aria-label="Close"
                />
                <Heading size="md">Create New Task</Heading>
              </HStack>
              <Button
                colorScheme="blue"
                onClick={createTask}
                leftIcon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                }
              >
                Create Task
              </Button>
            </HStack>

            {/* Form Content */}
            <Box flex={1} overflowY="auto" p={6}>
              <VStack spacing={6} align="stretch" maxW="2xl" mx="auto">
                {/* Task Title */}
                <Box>
                  <Text fontWeight="semibold" mb={2} color="gray.700">
                    Task Title *
                  </Text>
                  <Input
                    placeholder="Enter task title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="lg"
                    focusBorderColor="blue.500"
                    bg="white"
                  />
                </Box>

                {/* Priority & Due Date */}
                <HStack spacing={4} align="start">
                  <Box flex={1}>
                    <Text fontWeight="semibold" mb={2} color="gray.700">
                      Priority
                    </Text>
                    <Select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      size="lg"
                      focusBorderColor="blue.500"
                      bg="white"
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </Select>
                  </Box>

                  <Box flex={1}>
                    <Text fontWeight="semibold" mb={2} color="gray.700">
                      Due Date
                    </Text>
                    <Input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      size="lg"
                      focusBorderColor="blue.500"
                      bg="white"
                    />
                  </Box>
                </HStack>

                <Divider />

                {/* Collaborators */}
                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text fontWeight="semibold" color="gray.700">
                      Add Collaborators (Friends)
                    </Text>
                    <Badge colorScheme="blue">
                      {selectedCollaborators.length} selected
                    </Badge>
                  </HStack>

                  {friends.length === 0 ? (
                    <Box
                      p={6}
                      bg="gray.50"
                      rounded="lg"
                      textAlign="center"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Text color="gray.500" mb={3}>
                        No friends available
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => navigate("/friends")}
                      >
                        Add Friends
                      </Button>
                    </Box>
                  ) : (
                    <VStack spacing={2} align="stretch">
                      {friends.map((friend) => (
                        <Box
                          key={friend.id}
                          p={3}
                          bg="white"
                          rounded="lg"
                          border="1px"
                          borderColor={
                            selectedCollaborators.includes(friend.id)
                              ? "blue.300"
                              : "gray.200"
                          }
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
                            <Avatar size="sm" name={friend.name} bg="purple.500" />
                            <Box flex={1}>
                              <Text fontWeight="medium">{friend.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {friend.email}
                              </Text>
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
              bg="white"
              borderBottom="1px"
              borderColor="gray.200"
              justify="space-between"
            >
              <HStack spacing={3} flex={1}>
                <IconButton
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  }
                  variant="ghost"
                  onClick={() => setSelectedTask(null)}
                  aria-label="Close"
                />
                <Heading size="md" noOfLines={1} flex={1}>
                  {selectedTask.title}
                </Heading>
              </HStack>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  }
                  variant="ghost"
                />
                <MenuList>
                  <MenuItem onClick={() => deleteTask(selectedTask.id)} color="red.600">
                    Delete Task
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>

            {/* Task Details */}
            <Box flex={1} overflowY="auto" p={6} bg="gray.50">
              <VStack spacing={6} align="stretch" maxW="2xl" mx="auto">
                {/* Status Badges */}
                <HStack spacing={3}>
                  <Badge colorScheme={getPriorityColor(selectedTask.priority)} px={3} py={1} fontSize="sm">
                    {selectedTask.priority} Priority
                  </Badge>
                  <Badge colorScheme={getStatusColor(selectedTask.status)} px={3} py={1} fontSize="sm">
                    {selectedTask.status}
                  </Badge>
                </HStack>

                {/* Due Date */}
                {selectedTask.dueDate && (
                  <HStack spacing={2} color="gray.600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <Text>Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</Text>
                  </HStack>
                )}

                <Divider />

                {/* Status Update */}
                <Box bg="white" p={4} rounded="lg" border="1px" borderColor="gray.200">
                  <Text fontWeight="semibold" mb={3} color="gray.700">
                    Update Status
                  </Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {["Pending", "In Progress", "Completed"].map((status) => (
                      <Button
                        key={status}
                        onClick={() => updateTaskStatus(selectedTask.id, status)}
                        colorScheme={selectedTask.status === status ? getStatusColor(status) : "gray"}
                        variant={selectedTask.status === status ? "solid" : "outline"}
                        size="sm"
                      >
                        {status}
                      </Button>
                    ))}
                  </HStack>
                </Box>

                {/* Collaborators Section */}
                <Box bg="white" p={4} rounded="lg" border="1px" borderColor="gray.200">
                  <HStack justify="space-between" mb={4}>
                    <Text fontWeight="semibold" color="gray.700">
                      Working Together
                    </Text>
                    {selectedTask.collaborators && (
                      <Badge colorScheme="blue">
                        {selectedTask.collaborators.length} member{selectedTask.collaborators.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </HStack>

                  {selectedTask.collaborators && selectedTask.collaborators.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {selectedTask.collaborators.map((collab, idx) => (
                        <HStack
                          key={idx}
                          p={3}
                          bg="gray.50"
                          rounded="lg"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Avatar
                            size="md"
                            name={collab.user?.name || "User"}
                            bg="blue.500"
                          />
                          <Box flex={1}>
                            <Text fontWeight="medium">
                              {collab.user?.name || "Unknown User"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {collab.user?.email || "No email"}
                            </Text>
                          </Box>
                          <Badge colorScheme="green">Active</Badge>
                        </HStack>
                      ))}
                    </VStack>
                  ) : (
                    <Box
                      p={6}
                      bg="gray.50"
                      rounded="lg"
                      textAlign="center"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Text color="gray.500" fontSize="sm">
                        No collaborators yet. Add friends when creating tasks.
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Activity Timeline */}
                <Box bg="white" p={4} rounded="lg" border="1px" borderColor="gray.200">
                  <Text fontWeight="semibold" mb={4} color="gray.700">
                    Activity Timeline
                  </Text>
                  <VStack spacing={3} align="stretch">
                    {selectedTask.completedAt && (
                      <HStack>
                        <Box w={2} h={2} bg="green.500" rounded="full" />
                        <Text fontSize="sm" color="gray.600">
                          Completed on {new Date(selectedTask.completedAt).toLocaleString()}
                        </Text>
                      </HStack>
                    )}
                    {selectedTask.startedAt && (
                      <HStack>
                        <Box w={2} h={2} bg="blue.500" rounded="full" />
                        <Text fontSize="sm" color="gray.600">
                          Started on {new Date(selectedTask.startedAt).toLocaleString()}
                        </Text>
                      </HStack>
                    )}
                    <HStack>
                      <Box w={2} h={2} bg="gray.500" rounded="full" />
                      <Text fontSize="sm" color="gray.600">
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