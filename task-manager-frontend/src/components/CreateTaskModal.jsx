// src/components/CreateTaskModal.jsx
// Reuses the SAME task creation logic as Tasks.jsx (same API calls, same form fields)
import { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
    Button,
    Input,
    Select,
    Textarea,
    VStack,
    HStack,
    Divider,
    Checkbox,
    Avatar,
    Badge,
    useToast,
} from "@chakra-ui/react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPriority, setNewPriority] = useState("Medium");
    const [newDueDate, setNewDueDate] = useState("");
    const [selectedCollaborators, setSelectedCollaborators] = useState([]);
    const [friends, setFriends] = useState([]);
    const [aiSubtasks, setAiSubtasks] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [saveAiSubtasks, setSaveAiSubtasks] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const toast = useToast();
    const theme = useTheme();

    // Load friends when modal opens — same as Tasks.jsx fetchFriends()
    useEffect(() => {
        if (isOpen) {
            api
                .get("/friends")
                .then((res) => setFriends(res.data.friends || []))
                .catch(() => { });
        }
    }, [isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setNewTitle("");
            setNewDescription("");
            setNewPriority("Medium");
            setNewDueDate("");
            setSelectedCollaborators([]);
            setAiSubtasks([]);
            setSaveAiSubtasks(false);
        }
    }, [isOpen]);

    // SAME createTask logic as Tasks.jsx
    const createTask = async () => {
        if (!newTitle.trim()) {
            toast({ title: "Please enter a task title", status: "warning", duration: 2000, isClosable: true });
            return;
        }

        setIsCreating(true);
        try {
            const taskPayload = {
                title: newTitle,
                description: newDescription || undefined,
                priority: newPriority,
                dueDate: newDueDate || null,
                collaborators: selectedCollaborators,
            };

            // Include AI-generated subtasks if user opted in and they exist
            if (saveAiSubtasks && aiSubtasks.length > 0) {
                taskPayload.subtasks = aiSubtasks;
            }

            await api.post("/tasks", taskPayload);

            toast({
                title: "Task created successfully",
                description: 
                    selectedCollaborators.length > 0 
                        ? `Collaborators added${saveAiSubtasks && aiSubtasks.length > 0 ? ` and ${aiSubtasks.length} subtasks` : ""}`
                        : (saveAiSubtasks && aiSubtasks.length > 0 ? `With ${aiSubtasks.length} AI subtasks` : undefined),
                status: "success",
                duration: 2000,
                isClosable: true,
            });

            onClose();
            if (onTaskCreated) onTaskCreated(); // notify parent to refresh task list
        } catch (error) {
            toast({
                title: "Error creating task",
                description: error.response?.data?.message || "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsCreating(false);
        }
    };

    // SAME generateAiSubtasks logic as Tasks.jsx
    const generateAiSubtasks = async () => {
        if (!newTitle.trim()) {
            toast({ title: "Enter a task title first", status: "warning", duration: 2000, isClosable: true });
            return;
        }
        setAiLoading(true);
        setAiSubtasks([]);
        try {
            const res = await api.post("/ai/suggest", {
                title: newTitle,
                description: newDescription || newTitle,
            });
            setAiSubtasks(res.data.subtasks || res.data || []);
        } catch {
            toast({ title: "AI generation failed", description: "Make sure the ML service is running", status: "warning", duration: 3000, isClosable: true });
        } finally {
            setAiLoading(false);
        }
    };

    // SAME toggleCollaborator logic as Tasks.jsx
    const toggleCollaborator = (friendId) => {
        setSelectedCollaborators((prev) =>
            prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent bg={theme.bg.card} border="1px" borderColor={theme.border.primary} mx={4}>
                {/* Header */}
                <ModalHeader
                    borderBottom="1px"
                    borderColor={theme.border.primary}
                    p={0}
                >
                    <HStack
                        bgGradient={theme.gradient.primary}
                        px={6}
                        py={4}
                        borderTopRadius="md"
                        justify="space-between"
                    >
                        <HStack spacing={3}>
                            <Box
                                w={9}
                                h={9}
                                bg="whiteAlpha.300"
                                rounded="lg"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M9 11l3 3L22 4" />
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                </svg>
                            </Box>
                            <Text fontSize="lg" fontWeight="bold" color="white">
                                Create New Task
                            </Text>
                        </HStack>
                    </HStack>
                </ModalHeader>
                <ModalCloseButton color={theme.text.secondary} top={3} right={3} zIndex={10} />

                <ModalBody py={6} px={6}>
                    <VStack spacing={5} align="stretch">
                        {/* Task Title */}
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>
                                Task Title *
                            </Text>
                            <Input
                                placeholder="Enter task title..."
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && createTask()}
                                size="md"
                                focusBorderColor="blue.500"
                                borderColor={theme.border.secondary}
                                bg={theme.bg.secondary}
                                color={theme.text.primary}
                                _placeholder={{ color: theme.text.tertiary }}
                                _hover={{ borderColor: "blue.300" }}
                                autoFocus
                            />
                        </Box>

                        {/* Task Description */}
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>
                                Description
                                <Text as="span" fontWeight="normal" color={theme.text.tertiary} ml={1}>(optional — helps the AI generate better subtasks)</Text>
                            </Text>
                            <Textarea
                                placeholder="Describe your task in detail..."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                size="md"
                                rows={3}
                                resize="vertical"
                                focusBorderColor="blue.500"
                                borderColor={theme.border.secondary}
                                bg={theme.bg.secondary}
                                color={theme.text.primary}
                                _placeholder={{ color: theme.text.tertiary }}
                                _hover={{ borderColor: "blue.300" }}
                            />
                        </Box>

                        {/* AI Subtask Generator — same as Tasks.jsx */}
                        <Box
                            bg={theme.isDark ? "blue.900" : "blue.50"}
                            border="1px"
                            borderColor={theme.isDark ? "blue.700" : "blue.200"}
                            rounded="xl"
                            p={4}
                        >
                            <HStack justify="space-between" mb={2}>
                                <HStack spacing={2}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
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
                                    Generate
                                </Button>
                            </HStack>
                            <Text fontSize="xs" color={theme.isDark ? "blue.400" : "blue.500"} mb={aiSubtasks.length > 0 ? 3 : 0}>
                                {aiSubtasks.length === 0
                                    ? "Enter a title then click Generate for AI-suggested subtasks."
                                    : `${aiSubtasks.length} subtasks suggested:`}
                            </Text>
                            {aiSubtasks.length > 0 && (
                                <>
                                    <VStack spacing={2} align="stretch" mb={3}>
                                        {aiSubtasks.map((sub, i) => (
                                            <HStack
                                                key={i}
                                                bg={theme.bg.card}
                                                border="1px"
                                                borderColor={theme.isDark ? "blue.700" : "blue.100"}
                                                rounded="lg"
                                                p={2}
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
                                    <HStack 
                                        bg={theme.isDark ? "blue.800" : "blue.100"}
                                        p={2}
                                        rounded="lg"
                                        spacing={2}
                                        onClick={() => setSaveAiSubtasks(!saveAiSubtasks)}
                                        cursor="pointer"
                                        _hover={{ bg: theme.isDark ? "blue.700" : "blue.150" }}
                                        transition="background 0.2s"
                                    >
                                        <Checkbox
                                            isChecked={saveAiSubtasks}
                                            onChange={() => setSaveAiSubtasks(!saveAiSubtasks)}
                                            colorScheme="blue"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <Text fontSize="xs" color={theme.isDark ? "blue.300" : "blue.700"} fontWeight="medium">
                                            Save these subtasks with the task
                                        </Text>
                                    </HStack>
                                </>
                            )}
                        </Box>

                        {/* Priority & Due Date — same as Tasks.jsx */}
                        <HStack spacing={4} align="start">
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>
                                    Priority
                                </Text>
                                <Select
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value)}
                                    size="md"
                                    focusBorderColor="blue.500"
                                    borderColor={theme.border.secondary}
                                    bg={theme.bg.secondary}
                                    color={theme.text.primary}
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </Select>
                            </Box>
                            <Box flex={1}>
                                <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>
                                    Due Date
                                </Text>
                                <Input
                                    type="date"
                                    value={newDueDate}
                                    onChange={(e) => setNewDueDate(e.target.value)}
                                    size="md"
                                    focusBorderColor="blue.500"
                                    borderColor={theme.border.secondary}
                                    bg={theme.bg.secondary}
                                    color={theme.text.primary}
                                />
                            </Box>
                        </HStack>

                        <Divider borderColor={theme.border.primary} />

                        {/* Collaborators — same as Tasks.jsx */}
                        <Box>
                            <HStack justify="space-between" mb={3}>
                                <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary}>
                                    Add Collaborators (Friends)
                                </Text>
                                {selectedCollaborators.length > 0 && (
                                    <Badge colorScheme="blue" fontSize="xs">
                                        {selectedCollaborators.length} selected
                                    </Badge>
                                )}
                            </HStack>

                            {friends.length === 0 ? (
                                <Box
                                    p={4}
                                    bg={theme.bg.secondary}
                                    rounded="xl"
                                    textAlign="center"
                                    border="1px"
                                    borderColor={theme.border.primary}
                                >
                                    <Text color={theme.text.tertiary} fontSize="sm">
                                        No friends yet — add friends from the Friends page to collaborate
                                    </Text>
                                </Box>
                            ) : (
                                <VStack spacing={2} align="stretch" maxH="180px" overflowY="auto">
                                    {friends.map((friend) => (
                                        <Box
                                            key={friend.id}
                                            p={3}
                                            bg={theme.bg.secondary}
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
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <Avatar size="xs" name={friend.name} bg="blue.500" />
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

                        {/* Action Buttons */}
                        <HStack spacing={3} pt={2}>
                            <Button
                                colorScheme="blue"
                                flex={1}
                                isLoading={isCreating}
                                loadingText="Creating..."
                                onClick={createTask}
                                bgGradient={theme.gradient.primary}
                                color="white"
                                _hover={{ bgGradient: "linear(to-r, blue.600, indigo.700)", transform: "translateY(-1px)", shadow: "md" }}
                                transition="all 0.2s"
                                leftIcon={
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                }
                            >
                                Create Task
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                borderColor={theme.border.secondary}
                                color={theme.text.secondary}
                                _hover={{ bg: theme.bg.hover }}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
