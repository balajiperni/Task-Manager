// src/pages/Login.jsx
import { useState } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Checkbox,
  Link,
  Heading,
  Flex,
  Container,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");

      if (pendingInviteToken) {
        sessionStorage.removeItem("pendingInviteToken");
        navigate(`/invite/${pendingInviteToken}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={theme.bg.primary}
      bgGradient={theme.gradient.bg}
      px={4}
    >
      <Container maxW="md" py={12}>
        {/* Theme Toggle */}
        <Flex justify="flex-end" mb={4}>
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
              colorScheme="blue"
              aria-label="Toggle theme"
            />
          </Tooltip>
        </Flex>

        <Box
          bg={theme.bg.card}
          rounded="2xl"
          shadow="2xl"
          p={{ base: 8, md: 10 }}
          border="1px"
          borderColor={theme.border.primary}
        >
          <VStack spacing={8} align="stretch">
            <VStack spacing={4} textAlign="center">
              <Box
                w={20}
                h={20}
                bgGradient={theme.gradient.primary}
                rounded="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                shadow="lg"
                mx="auto"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </Box>

              <VStack spacing={2}>
                <Heading
                  size="2xl"
                  fontWeight="extrabold"
                  bgGradient="linear(to-r, blue.600, indigo.600)"
                  bgClip="text"
                >
                  Welcome Back
                </Heading>
                <Text color={theme.text.secondary} fontSize="md">
                  Sign in to your account to continue
                </Text>
              </VStack>
            </VStack>

            <VStack spacing={5} align="stretch">
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={theme.text.primary}
                  mb={2}
                >
                  Email Address
                </Text>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                    pointerEvents="none"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={theme.isDark ? "#A0AEC0" : "#A0AEC0"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </Box>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="you@example.com"
                    size="lg"
                    pl="45px"
                    focusBorderColor="blue.500"
                    borderColor={theme.border.secondary}
                    bg={theme.bg.secondary}
                    color={theme.text.primary}
                    _hover={{
                      borderColor: "blue.300",
                    }}
                    _placeholder={{ color: theme.text.tertiary }}
                  />
                </Box>
              </Box>

              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={theme.text.primary}
                  mb={2}
                >
                  Password
                </Text>
                <Box position="relative">
                  <Box
                    position="absolute"
                    left="12px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                    pointerEvents="none"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={theme.isDark ? "#A0AEC0" : "#A0AEC0"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </Box>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••••"
                    size="lg"
                    pl="45px"
                    focusBorderColor="blue.500"
                    borderColor={theme.border.secondary}
                    bg={theme.bg.secondary}
                    color={theme.text.primary}
                    _hover={{
                      borderColor: "blue.300",
                    }}
                    _placeholder={{ color: theme.text.tertiary }}
                  />
                </Box>
              </Box>

              <HStack justify="space-between">
                <Checkbox colorScheme="blue" size="md" fontWeight="medium">
                  <Text fontSize="sm" color={theme.text.secondary}>
                    Remember me
                  </Text>
                </Checkbox>
                <Link
                  color="blue.600"
                  fontSize="sm"
                  fontWeight="semibold"
                  _hover={{
                    color: "blue.700",
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </Link>
              </HStack>

              {error && (
                <Box
                  bg={theme.isDark ? "red.900" : "red.50"}
                  border="1px"
                  borderColor={theme.isDark ? "red.700" : "red.200"}
                  borderLeftWidth="4px"
                  borderLeftColor="red.500"
                  rounded="md"
                  p={3}
                >
                  <HStack spacing={2}>
                    <Box color="red.500">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Box>
                    <Text fontSize="sm" color={theme.isDark ? "red.300" : "red.700"} fontWeight="medium">
                      {error}
                    </Text>
                  </HStack>
                </Box>
              )}

              <Button
                onClick={handleLogin}
                isLoading={isLoading}
                loadingText="Signing in..."
                size="lg"
                fontSize="md"
                fontWeight="bold"
                bg="blue.500"
                color="white"
                _hover={{
                  bg: "blue.600",
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                  shadow: "md",
                  bg: "blue.700",
                }}
                transition="all 0.2s"
                shadow="md"
              >
                Sign In
              </Button>
            </VStack>

            <HStack spacing={4}>
              <Box flex={1} height="1px" bg={theme.border.primary} />
              <Text
                fontSize="sm"
                color={theme.text.tertiary}
                fontWeight="medium"
                whiteSpace="nowrap"
              >
                New to our platform?
              </Text>
              <Box flex={1} height="1px" bg={theme.border.primary} />
            </HStack>

            <Button
              variant="outline"
              size="lg"
              colorScheme="blue"
              fontWeight="semibold"
              onClick={() => navigate("/register")}
              _hover={{
                bg: theme.isDark ? "blue.900" : "blue.50",
                transform: "translateY(-2px)",
                shadow: "md",
              }}
              transition="all 0.2s"
            >
              Create New Account
            </Button>
          </VStack>
        </Box>

        <Text textAlign="center" fontSize="xs" color={theme.text.tertiary} mt={8} px={4}>
          By continuing, you agree to our{" "}
          <Link color="blue.600" fontWeight="semibold">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link color="blue.600" fontWeight="semibold">
            Privacy Policy
          </Link>
        </Text>
      </Container>
    </Flex>
  );
}