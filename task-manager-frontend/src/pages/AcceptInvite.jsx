// src/pages/AcceptInvite.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      sessionStorage.setItem("pendingInviteToken", token);
      navigate("/login");
      return;
    }
    handleAcceptInvite();
  }, [token]);

  const handleAcceptInvite = async () => {
    try {
      const response = await api.post(`/friends/accept/${token}`);
      setSuccess(true);
      setLoading(false);
      
      setTimeout(() => {
        navigate("/friends");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || 
        "Failed to accept invite. The link may be expired or invalid."
      );
    }
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg={theme.bg.primary}>
        <VStack spacing={6}>
          <Box position="relative">
            <Spinner
              size="xl"
              color="blue.500"
              thickness="4px"
              speed="0.65s"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3182CE"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </Box>
          </Box>
          <VStack spacing={2}>
            <Text fontSize="xl" fontWeight="bold" color={theme.text.primary}>
              Processing Invitation
            </Text>
            <Text fontSize="md" color={theme.text.secondary}>
              Please wait while we connect you with your friend...
            </Text>
          </VStack>
        </VStack>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex h="100vh" align="center" justify="center" bg={theme.bg.primary}>
        <Box
          bg={theme.bg.card}
          p={8}
          rounded="2xl"
          shadow="xl"
          maxW="md"
          w="full"
          mx={4}
          textAlign="center"
          border="1px"
          borderColor={theme.border.primary}
        >
          <Box
            w={20}
            h={20}
            bg="red.100"
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            mb={6}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E53E3E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </Box>

          <Heading size="lg" mb={3} color={theme.text.primary}>
            Invalid Invitation
          </Heading>
          <Text color={theme.text.secondary} mb={6} fontSize="md">
            {error}
          </Text>

          <VStack spacing={3}>
            <Button
              colorScheme="blue"
              size="lg"
              width="full"
              onClick={() => navigate("/friends")}
            >
              Go to Friends Page
            </Button>
            <Button
              variant="ghost"
              size="lg"
              width="full"
              onClick={() => navigate("/dashboard")}
              color={theme.text.secondary}
              _hover={{ bg: theme.bg.hover }}
            >
              Go to Dashboard
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex h="100vh" align="center" justify="center" bg={theme.bg.primary}>
      <Box
        bg={theme.bg.card}
        p={8}
        rounded="2xl"
        shadow="xl"
        maxW="md"
        w="full"
        mx={4}
        textAlign="center"
        border="1px"
        borderColor={theme.border.primary}
      >
        <Box
          w={20}
          h={20}
          bg="green.100"
          rounded="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          mx="auto"
          mb={6}
          animation="scaleIn 0.5s ease-out"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38A169"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </Box>

        <Heading size="lg" mb={3} color={theme.text.primary}>
          Invitation Accepted! 🎉
        </Heading>
        <Text color={theme.text.secondary} mb={2} fontSize="md">
          You are now connected with your friend.
        </Text>
        <Text color={theme.text.tertiary} fontSize="sm" mb={6}>
          Redirecting you to your friends page...
        </Text>

        <Box
          w="full"
          h="1"
          bg={theme.bg.tertiary}
          rounded="full"
          overflow="hidden"
          mb={6}
        >
          <Box
            h="full"
            bg="green.500"
            animation="progress 2s ease-out"
            style={{
              animation: "progress 2s ease-out forwards",
            }}
          />
        </Box>

        <Button
          colorScheme="green"
          size="lg"
          width="full"
          onClick={() => navigate("/friends")}
        >
          Go Now
        </Button>

        <style jsx>{`
          @keyframes scaleIn {
            from {
              transform: scale(0);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes progress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </Box>
    </Flex>
  );
}