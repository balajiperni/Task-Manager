// src/pages/Friends.jsx
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
  Input,
  useToast,
  Badge,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import api from "../services/api";

// Main Friends Page Component
export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitesOpen, setInvitesOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendTasks, setFriendTasks] = useState(null);
  const [inviteLink, setInviteLink] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const res = await api.get("/friends");
      setFriends(res.data.friends);
    } catch (error) {
      toast({
        title: "Error loading friends",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteFriend = async () => {
    if (!inviteEmail) {
      toast({
        title: "Please enter an email",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Invalid email format",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await api.post("/friends/invite", { email: inviteEmail });
      setInviteLink(res.data.inviteLink);
      setShowLinkModal(true);
      setInviteEmail("");
      toast({
        title: "Invite sent successfully!",
        description: "Share the link with your friend",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to send invite",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;

    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(friends.filter((f) => f.id !== friendId));
      toast({
        title: "Friend removed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to remove friend",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const viewFriendTasks = async (friend) => {
    try {
      setSelectedFriend(friend);
      setFriendTasks(null); // Reset to show loading
      const res = await api.get(`/friends/${friend.id}/tasks`);
      setFriendTasks(res.data);
    } catch (error) {
      toast({
        title: "Failed to load friend's tasks",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setSelectedFriend(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading
            size="2xl"
            mb={2}
            bgGradient="linear(to-r, blue.600, indigo.600)"
            bgClip="text"
          >
            Friends
          </Heading>
          <Text color="gray.600">
            Connect with friends and view their task activities
          </Text>
        </Box>
        <Button
          colorScheme="blue"
          size="lg"
          leftIcon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          onClick={() => setInvitesOpen(true)}
        >
          View Invites
        </Button>
      </Flex>

      {/* Invite Friend Section */}
      <Box bg="white" p={6} rounded="2xl" shadow="md" mb={8}>
        <Heading size="md" mb={4}>
          Invite a Friend
        </Heading>
        <HStack spacing={4}>
          <Input
            placeholder="Enter friend's email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            size="lg"
            type="email"
          />
          <Button
            colorScheme="blue"
            size="lg"
            onClick={handleInviteFriend}
            minW="150px"
          >
            Send Invite
          </Button>
        </HStack>
      </Box>

      {/* Friends List */}
      <Box bg="white" p={6} rounded="2xl" shadow="md">
        <Heading size="md" mb={6}>
          My Friends ({friends.length})
        </Heading>

        {loading ? (
          <Flex justify="center" py={8}>
            <VStack>
              <Box
                w={12}
                h={12}
                border="4px"
                borderColor="blue.500"
                borderTopColor="transparent"
                rounded="full"
                animation="spin 1s linear infinite"
              />
              <Text color="gray.600">Loading friends...</Text>
            </VStack>
          </Flex>
        ) : friends.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Box
              w={20}
              h={20}
              bg="gray.100"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={4}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </Box>
            <Text color="gray.500" fontSize="lg" mb={2}>
              No friends yet
            </Text>
            <Text color="gray.400" fontSize="sm">
              Invite someone to get started!
            </Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {friends.map((friend) => (
              <Box
                key={friend.id}
                p={4}
                border="1px"
                borderColor="gray.200"
                rounded="xl"
                _hover={{ shadow: "md", borderColor: "blue.300" }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <HStack spacing={4}>
                    <Avatar
                      size="lg"
                      name={friend.name}
                      bg="blue.500"
                      color="white"
                    />
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">
                        {friend.name}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        {friend.email}
                      </Text>
                      <Text color="gray.500" fontSize="xs" mt={1}>
                        Connected {new Date(friend.connectedAt).toLocaleDateString()}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack spacing={2}>
                    <Tooltip label="View Tasks">
                      <IconButton
                        icon={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        }
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => viewFriendTasks(friend)}
                      />
                    </Tooltip>
                    <Tooltip label="Remove Friend">
                      <IconButton
                        icon={
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        }
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveFriend(friend.id)}
                      />
                    </Tooltip>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Invites Sidebar */}
      <InvitesSidebar 
        isOpen={invitesOpen} 
        onClose={() => setInvitesOpen(false)}
        onInviteAccepted={loadFriends}
      />

      {/* Friend Tasks Modal */}
      <Modal
        isOpen={selectedFriend !== null}
        onClose={() => {
          setSelectedFriend(null);
          setFriendTasks(null);
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Avatar size="sm" name={selectedFriend?.name} bg="blue.500" />
              <Text>{selectedFriend?.name}'s Tasks</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {friendTasks ? (
              <Tabs colorScheme="blue">
                <TabList>
                  <Tab>
                    Completed ({friendTasks.completed?.length || 0})
                  </Tab>
                  <Tab>
                    Upcoming ({friendTasks.upcoming?.length || 0})
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={3} align="stretch">
                      {friendTasks.completed?.map((task) => (
                        <Box
                          key={task.id}
                          p={3}
                          border="1px"
                          borderColor="green.200"
                          bg="green.50"
                          rounded="lg"
                        >
                          <Text fontWeight="medium">{task.title}</Text>
                          <Text fontSize="sm" color="gray.600">
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                      {(!friendTasks.completed || friendTasks.completed.length === 0) && (
                        <Text color="gray.500" textAlign="center" py={4}>
                          No completed tasks
                        </Text>
                      )}
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack spacing={3} align="stretch">
                      {friendTasks.upcoming?.map((task) => (
                        <Box
                          key={task.id}
                          p={3}
                          border="1px"
                          borderColor="blue.200"
                          bg="blue.50"
                          rounded="lg"
                        >
                          <HStack justify="space-between">
                            <Text fontWeight="medium">{task.title}</Text>
                            <Badge
                              colorScheme={
                                task.status === "In Progress" ? "orange" : "gray"
                              }
                            >
                              {task.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                      {(!friendTasks.upcoming || friendTasks.upcoming.length === 0) && (
                        <Text color="gray.500" textAlign="center" py={4}>
                          No upcoming tasks
                        </Text>
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <Flex justify="center" py={8}>
                <Box
                  w={12}
                  h={12}
                  border="4px"
                  borderColor="blue.500"
                  borderTopColor="transparent"
                  rounded="full"
                  animation="spin 1s linear infinite"
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Invite Link Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Link Generated</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Share this link with your friend:</Text>
              <Box
                p={3}
                bg="gray.100"
                rounded="lg"
                w="full"
                onClick={() => copyToClipboard(inviteLink)}
                cursor="pointer"
                _hover={{ bg: "gray.200" }}
              >
                <Text fontSize="sm" wordBreak="break-all">
                  {inviteLink}
                </Text>
              </Box>
              <Text fontSize="sm" color="gray.600">
                Click to copy
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setShowLinkModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// Invites Sidebar Component
function InvitesSidebar({ isOpen, onClose, onInviteAccepted }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadInvites();
    }
  }, [isOpen]);

  const loadInvites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invites");
      setInvites(res.data.invites);
    } catch (error) {
      toast({
        title: "Error loading invites",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      await api.post(`/invites/${inviteId}/accept`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      toast({
        title: "Invite accepted!",
        description: "You are now connected",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Refresh friends list
      if (onInviteAccepted) {
        onInviteAccepted();
      }
    } catch (error) {
      toast({
        title: "Failed to accept invite",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (inviteId) => {
    try {
      await api.post(`/invites/${inviteId}/reject`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      toast({
        title: "Invite rejected",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to reject invite",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getDaysRemaining = (expiresAt) => {
    const days = Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={3}>
            <Box
              w={10}
              h={10}
              bg="blue.100"
              rounded="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </Box>
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                Friend Invites
              </Text>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                {invites.length} pending invitation{invites.length !== 1 ? "s" : ""}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          {loading ? (
            <Flex justify="center" align="center" h="200px">
              <VStack>
                <Box
                  w={12}
                  h={12}
                  border="4px"
                  borderColor="blue.500"
                  borderTopColor="transparent"
                  rounded="full"
                  animation="spin 1s linear infinite"
                />
                <Text color="gray.600">Loading invites...</Text>
              </VStack>
            </Flex>
          ) : invites.length === 0 ? (
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={3}>
                <Box
                  w={16}
                  h={16}
                  bg="gray.100"
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </Box>
                <Text color="gray.500" fontSize="lg">
                  No pending invites
                </Text>
                <Text color="gray.400" fontSize="sm" textAlign="center" px={4}>
                  When someone invites you to connect, it will appear here
                </Text>
              </VStack>
            </Flex>
          ) : (
            <VStack spacing={0} align="stretch">
              {invites.map((invite, index) => (
                <Box key={invite.id}>
                  <Box p={6} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                    <HStack spacing={4} mb={4}>
                      <Avatar
                        size="lg"
                        name={invite.from.name}
                        bg="purple.500"
                        color="white"
                      />
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {invite.from.name}
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                          {invite.from.email}
                        </Text>
                        <HStack mt={2} spacing={2}>
                          <Badge colorScheme="blue" fontSize="xs">
                            {getDaysRemaining(invite.expiresAt)} days left
                          </Badge>
                          <Text fontSize="xs" color="gray.500">
                            Sent {new Date(invite.sentAt).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>

                    <HStack spacing={3}>
                      <Button
                        colorScheme="blue"
                        size="md"
                        flex={1}
                        onClick={() => handleAccept(invite.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="gray"
                        size="md"
                        flex={1}
                        onClick={() => handleReject(invite.id)}
                      >
                        Decline
                      </Button>
                    </HStack>
                  </Box>
                  {index < invites.length - 1 && <Divider />}
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}