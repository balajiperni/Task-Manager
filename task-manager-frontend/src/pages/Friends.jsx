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
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";

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
  const theme = useTheme();

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
      toast({ title: "Please enter an email", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({ title: "Invalid email format", status: "warning", duration: 2000, isClosable: true });
      return;
    }
    try {
      const res = await api.post("/friends/invite", { email: inviteEmail });
      setInviteLink(res.data.inviteLink);
      setShowLinkModal(true);
      setInviteEmail("");
      toast({ title: "Invite sent successfully!", description: "Share the link with your friend", status: "success", duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: "Failed to send invite", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm("Are you sure you want to remove this friend?")) return;
    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(friends.filter((f) => f.id !== friendId));
      toast({ title: "Friend removed", status: "success", duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: "Failed to remove friend", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    }
  };

  const viewFriendTasks = async (friend) => {
    try {
      setSelectedFriend(friend);
      setFriendTasks(null);
      const res = await api.get(`/friends/${friend.id}/tasks`);
      setFriendTasks(res.data);
    } catch (error) {
      toast({ title: "Failed to load friend's tasks", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
      setSelectedFriend(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard!", status: "success", duration: 2000, isClosable: true });
  };

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
                Friends
              </Heading>
              <Text color={theme.text.secondary} fontSize="sm" mt={1}>
                Connect with friends and view their task activities
              </Text>
            </Box>
            <Button
              colorScheme="blue"
              size="md"
              leftIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              }
              onClick={() => setInvitesOpen(true)}
              bgGradient={theme.gradient.primary}
              _hover={{ bgGradient: "linear(to-r, blue.600, indigo.700)", transform: "translateY(-1px)", shadow: "md" }}
              transition="all 0.2s"
              color="white"
            >
              View Invites
            </Button>
          </Flex>
        </Box>

        <Box p={8}>
          {/* Invite Friend Section */}
          <Box
            bg={theme.bg.card}
            p={6}
            rounded="2xl"
            shadow="md"
            mb={6}
            border="1px"
            borderColor={theme.border.primary}
          >
            <HStack spacing={3} mb={4}>
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </Box>
              <Heading size="sm" color={theme.text.primary}>
                Invite a Friend
              </Heading>
            </HStack>
            <HStack spacing={4}>
              <Input
                placeholder="Enter friend's email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleInviteFriend()}
                size="md"
                type="email"
                focusBorderColor="blue.500"
                borderColor={theme.border.secondary}
                bg={theme.bg.secondary}
                color={theme.text.primary}
                _placeholder={{ color: theme.text.tertiary }}
                _hover={{ borderColor: "blue.300" }}
              />
              <Button
                colorScheme="blue"
                size="md"
                onClick={handleInviteFriend}
                minW="140px"
                flexShrink={0}
              >
                Send Invite
              </Button>
            </HStack>
          </Box>

          {/* Friends List */}
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
                bg={theme.isDark ? "blue.900" : "blue.50"}
                rounded="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </Box>
              <Heading size="sm" color={theme.text.primary}>
                My Friends
              </Heading>
              <Badge colorScheme="blue" rounded="full" px={2} fontSize="xs">
                {friends.length}
              </Badge>
            </HStack>

            {loading ? (
              <Flex justify="center" py={10}>
                <VStack spacing={3}>
                  <Box
                    w={10}
                    h={10}
                    border="3px"
                    borderColor="blue.500"
                    borderTopColor="transparent"
                    rounded="full"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  <Text color={theme.text.secondary} fontSize="sm">Loading friends...</Text>
                </VStack>
              </Flex>
            ) : friends.length === 0 ? (
              <Box textAlign="center" py={12}>
                <Box
                  w={20}
                  h={20}
                  bg={theme.isDark ? "gray.700" : "gray.100"}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.isDark ? "#718096" : "#A0AEC0"} strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </Box>
                <Text color={theme.text.secondary} fontSize="lg" mb={2} fontWeight="medium">
                  No friends yet
                </Text>
                <Text color={theme.text.tertiary} fontSize="sm">
                  Invite someone to get started!
                </Text>
              </Box>
            ) : (
              <VStack spacing={3} align="stretch">
                {friends.map((friend) => (
                  <Box
                    key={friend.id}
                    p={4}
                    border="1px"
                    borderColor={theme.border.primary}
                    rounded="xl"
                    bg={theme.bg.secondary}
                    _hover={{ shadow: "md", borderColor: "blue.300", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <HStack spacing={4}>
                        <Avatar size="md" name={friend.name} bg="blue.500" color="white" />
                        <Box>
                          <Text fontWeight="bold" fontSize="md" color={theme.text.primary}>
                            {friend.name}
                          </Text>
                          <Text color={theme.text.secondary} fontSize="sm">
                            {friend.email}
                          </Text>
                          <Text color={theme.text.tertiary} fontSize="xs" mt={0.5}>
                            Connected {new Date(friend.connectedAt).toLocaleDateString()}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack spacing={1}>
                        <Tooltip label="View Tasks">
                          <IconButton
                            icon={
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 11l3 3L22 4" />
                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                              </svg>
                            }
                            colorScheme="blue"
                            variant="ghost"
                            size="sm"
                            onClick={() => viewFriendTasks(friend)}
                          />
                        </Tooltip>
                        <Tooltip label="Remove Friend">
                          <IconButton
                            icon={
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            }
                            colorScheme="red"
                            variant="ghost"
                            size="sm"
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
        </Box>
      </Box>

      {/* Invites Sidebar */}
      <InvitesSidebar
        isOpen={invitesOpen}
        onClose={() => setInvitesOpen(false)}
        onInviteAccepted={loadFriends}
        theme={theme}
      />

      {/* Friend Tasks Modal */}
      <Modal
        isOpen={selectedFriend !== null}
        onClose={() => { setSelectedFriend(null); setFriendTasks(null); }}
        size="xl"
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={theme.bg.card} border="1px" borderColor={theme.border.primary}>
          <ModalHeader color={theme.text.primary} borderBottom="1px" borderColor={theme.border.primary}>
            <HStack>
              <Avatar size="sm" name={selectedFriend?.name} bg="blue.500" />
              <Text>{selectedFriend?.name}'s Tasks</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color={theme.text.secondary} />
          <ModalBody pb={6} pt={4}>
            {friendTasks ? (
              <Tabs colorScheme="blue">
                <TabList borderColor={theme.border.primary}>
                  <Tab color={theme.text.secondary} _selected={{ color: "blue.500" }}>
                    Completed ({friendTasks.completed?.length || 0})
                  </Tab>
                  <Tab color={theme.text.secondary} _selected={{ color: "blue.500" }}>
                    Upcoming ({friendTasks.upcoming?.length || 0})
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <VStack spacing={2} align="stretch">
                      {friendTasks.completed?.map((task) => (
                        <Box
                          key={task.id}
                          p={3}
                          border="1px"
                          borderColor={theme.isDark ? "green.800" : "green.200"}
                          bg={theme.isDark ? "green.900" : "green.50"}
                          rounded="lg"
                        >
                          <Text fontWeight="medium" color={theme.text.primary}>{task.title}</Text>
                          <Text fontSize="sm" color={theme.text.secondary}>
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                      {(!friendTasks.completed || friendTasks.completed.length === 0) && (
                        <Text color={theme.text.tertiary} textAlign="center" py={4}>No completed tasks</Text>
                      )}
                    </VStack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <VStack spacing={2} align="stretch">
                      {friendTasks.upcoming?.map((task) => (
                        <Box
                          key={task.id}
                          p={3}
                          border="1px"
                          borderColor={theme.isDark ? "blue.800" : "blue.200"}
                          bg={theme.isDark ? "blue.900" : "blue.50"}
                          rounded="lg"
                        >
                          <HStack justify="space-between">
                            <Text fontWeight="medium" color={theme.text.primary}>{task.title}</Text>
                            <Badge colorScheme={task.status === "In Progress" ? "orange" : "gray"}>
                              {task.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color={theme.text.secondary}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Text>
                        </Box>
                      ))}
                      {(!friendTasks.upcoming || friendTasks.upcoming.length === 0) && (
                        <Text color={theme.text.tertiary} textAlign="center" py={4}>No upcoming tasks</Text>
                      )}
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <Flex justify="center" py={8}>
                <Box
                  w={10}
                  h={10}
                  border="3px"
                  borderColor="blue.500"
                  borderTopColor="transparent"
                  rounded="full"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Invite Link Modal */}
      <Modal isOpen={showLinkModal} onClose={() => setShowLinkModal(false)}>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={theme.bg.card} border="1px" borderColor={theme.border.primary}>
          <ModalHeader color={theme.text.primary}>Invite Link Generated 🎉</ModalHeader>
          <ModalCloseButton color={theme.text.secondary} />
          <ModalBody>
            <VStack spacing={4}>
              <Text color={theme.text.secondary}>Share this link with your friend:</Text>
              <Box
                p={3}
                bg={theme.bg.tertiary}
                rounded="lg"
                w="full"
                onClick={() => copyToClipboard(inviteLink)}
                cursor="pointer"
                _hover={{ bg: theme.isDark ? "gray.600" : "gray.200" }}
                border="1px"
                borderColor={theme.border.secondary}
                transition="all 0.2s"
              >
                <Text fontSize="sm" wordBreak="break-all" color={theme.text.primary}>
                  {inviteLink}
                </Text>
              </Box>
              <Text fontSize="sm" color={theme.text.tertiary}>Click to copy</Text>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px" borderColor={theme.border.primary}>
            <Button colorScheme="blue" onClick={() => setShowLinkModal(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

function InvitesSidebar({ isOpen, onClose, onInviteAccepted, theme }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) loadInvites();
  }, [isOpen]);

  const loadInvites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invites");
      setInvites(res.data.invites);
    } catch (error) {
      toast({ title: "Error loading invites", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      await api.post(`/invites/${inviteId}/accept`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      toast({ title: "Invite accepted!", description: "You are now connected", status: "success", duration: 3000, isClosable: true });
      if (onInviteAccepted) onInviteAccepted();
    } catch (error) {
      toast({ title: "Failed to accept invite", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleReject = async (inviteId) => {
    try {
      await api.post(`/invites/${inviteId}/reject`);
      setInvites(invites.filter((inv) => inv.id !== inviteId));
      toast({ title: "Invite declined", status: "info", duration: 2000, isClosable: true });
    } catch (error) {
      toast({ title: "Failed to reject invite", description: error.response?.data?.message || "Please try again", status: "error", duration: 3000, isClosable: true });
    }
  };

  const getDaysRemaining = (expiresAt) =>
    Math.ceil((new Date(expiresAt) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent bg={theme.bg.card} borderLeft="1px" borderColor={theme.border.primary}>
        <DrawerCloseButton color={theme.text.secondary} />
        <DrawerHeader borderBottomWidth="1px" borderColor={theme.border.primary}>
          <HStack spacing={3}>
            <Box
              w={10}
              h={10}
              bg={theme.isDark ? "blue.900" : "blue.50"}
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
              <Text fontSize="lg" fontWeight="bold" color={theme.text.primary}>Friend Invites</Text>
              <Text fontSize="sm" color={theme.text.secondary} fontWeight="normal">
                {invites.length} pending invitation{invites.length !== 1 ? "s" : ""}
              </Text>
            </Box>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          {loading ? (
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={3}>
                <Box
                  w={10}
                  h={10}
                  border="3px"
                  borderColor="blue.500"
                  borderTopColor="transparent"
                  rounded="full"
                  style={{ animation: "spin 1s linear infinite" }}
                />
                <Text color={theme.text.secondary} fontSize="sm">Loading invites...</Text>
              </VStack>
            </Flex>
          ) : invites.length === 0 ? (
            <Flex justify="center" align="center" h="200px">
              <VStack spacing={3}>
                <Box
                  w={16}
                  h={16}
                  bg={theme.isDark ? "gray.700" : "gray.100"}
                  rounded="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={theme.isDark ? "#718096" : "#A0AEC0"} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </Box>
                <Text color={theme.text.secondary} fontSize="md" fontWeight="medium">No pending invites</Text>
                <Text color={theme.text.tertiary} fontSize="sm" textAlign="center" px={4}>
                  When someone invites you to connect, it will appear here
                </Text>
              </VStack>
            </Flex>
          ) : (
            <VStack spacing={0} align="stretch">
              {invites.map((invite, index) => (
                <Box key={invite.id}>
                  <Box
                    p={5}
                    _hover={{ bg: theme.bg.hover }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={4} mb={4}>
                      <Avatar size="md" name={invite.from.name} bg="blue.500" color="white" />
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize="md" color={theme.text.primary}>
                          {invite.from.name}
                        </Text>
                        <Text color={theme.text.secondary} fontSize="sm">
                          {invite.from.email}
                        </Text>
                        <HStack mt={2} spacing={2}>
                          <Badge colorScheme="blue" fontSize="xs">
                            {getDaysRemaining(invite.expiresAt)} days left
                          </Badge>
                          <Text fontSize="xs" color={theme.text.tertiary}>
                            Sent {new Date(invite.sentAt).toLocaleDateString()}
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <HStack spacing={3}>
                      <Button colorScheme="blue" size="sm" flex={1} onClick={() => handleAccept(invite.id)}>
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="gray"
                        size="sm"
                        flex={1}
                        borderColor={theme.border.secondary}
                        color={theme.text.secondary}
                        onClick={() => handleReject(invite.id)}
                      >
                        Decline
                      </Button>
                    </HStack>
                  </Box>
                  {index < invites.length - 1 && <Divider borderColor={theme.border.primary} />}
                </Box>
              ))}
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}