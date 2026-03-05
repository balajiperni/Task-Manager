// src/pages/login.jsx
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
  IconButton,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Decorative feature item for the left panel
const Feature = ({ icon, title, desc }) => (
  <HStack spacing={4} align="start">
    <Box
      w={10} h={10} bg="whiteAlpha.200" rounded="xl"
      display="flex" alignItems="center" justifyContent="center" flexShrink={0}
    >
      {icon}
    </Box>
    <Box>
      <Text fontWeight="bold" color="white" fontSize="sm">{title}</Text>
      <Text color="whiteAlpha.700" fontSize="xs" mt={0.5}>{desc}</Text>
    </Box>
  </HStack>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      const pendingInviteToken = sessionStorage.getItem("pendingInviteToken");
      if (pendingInviteToken) {
        sessionStorage.removeItem("pendingInviteToken");
        navigate(`/invite/${pendingInviteToken}`);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bg={theme.bg.primary}>
      {/* ── Left decorative panel ── */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
        w="45%"
        bgGradient="linear(135deg, blue.600 0%, indigo.700 50%, purple.700 100%)"
        p={12}
        position="relative"
        overflow="hidden"
      >
        {/* Background blobs */}
        <Box
          position="absolute" top="-80px" right="-80px"
          w="360px" h="360px" bg="whiteAlpha.100" rounded="full" filter="blur(60px)"
        />
        <Box
          position="absolute" bottom="-60px" left="-60px"
          w="280px" h="280px" bg="purple.500" opacity={0.2} rounded="full" filter="blur(40px)"
        />

        {/* Logo */}
        <HStack spacing={3}>
          <Box
            w={11} h={11} bg="whiteAlpha.300" rounded="xl"
            display="flex" alignItems="center" justifyContent="center"
            backdropFilter="blur(10px)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </Box>
          <Text fontWeight="extrabold" fontSize="xl" color="white" letterSpacing="-0.5px">TaskFlow</Text>
        </HStack>

        {/* Hero copy */}
        <Box my={12}>
          <Heading size="2xl" color="white" fontWeight="extrabold" lineHeight="1.15" mb={5}>
            Manage tasks<br />smarter with AI
          </Heading>
          <Text color="whiteAlpha.800" fontSize="md" maxW="340px" lineHeight="1.7" mb={10}>
            Plan, collaborate, and track your work all in one place. Let AI generate subtasks for you so you can focus on what matters.
          </Text>

          <VStack spacing={5} align="stretch">
            <Feature
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
              title="AI-Powered Subtasks"
              desc="Describe a goal and let the AI break it into actionable steps."
            />
            <Feature
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
              title="Real-time Collaboration"
              desc="Invite friends, assign tasks, and track progress together."
            />
            <Feature
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
              title="Visual Analytics"
              desc="Charts and insights to keep your productivity on track."
            />
          </VStack>
        </Box>

        {/* Testimonial */}
        <Box bg="whiteAlpha.100" backdropFilter="blur(10px)" rounded="2xl" p={5} border="1px" borderColor="whiteAlpha.200">
          <Text color="white" fontSize="sm" fontStyle="italic" mb={3}>
            "TaskFlow with AI subtask generation saved me hours every week. My team is more aligned than ever."
          </Text>
          <HStack spacing={3}>
            <Box w={8} h={8} bg="blue.400" rounded="full" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" fontWeight="bold" color="white">RK</Text>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="white">Rahul K.</Text>
              <Text fontSize="xs" color="whiteAlpha.600">Product Manager</Text>
            </Box>
          </HStack>
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Flex
        flex={1}
        direction="column"
        justify="center"
        px={{ base: 6, md: 16, xl: 20 }}
        py={10}
        bg={theme.bg.primary}
        position="relative"
      >
        {/* Theme toggle */}
        <Box position="absolute" top={6} right={6}>
          <Tooltip label={theme.isDark ? "Light Mode" : "Dark Mode"}>
            <IconButton
              icon={theme.isDark ? <SunIcon /> : <MoonIcon />}
              onClick={theme.toggleTheme}
              variant="ghost"
              colorScheme="blue"
              aria-label="Toggle theme"
              size="sm"
            />
          </Tooltip>
        </Box>

        <Box maxW="420px" w="full" mx="auto">
          {/* Header */}
          <VStack align="start" spacing={2} mb={10}>
            <HStack spacing={2} mb={2}>
              <Box w={1.5} h={6} bg="blue.500" rounded="full" />
              <Text fontSize="sm" fontWeight="bold" color="blue.500" letterSpacing="wider" textTransform="uppercase">
                Welcome back
              </Text>
            </HStack>
            <Heading size="2xl" color={theme.text.primary} fontWeight="extrabold" lineHeight="1.1">
              Sign in to<br />your account
            </Heading>
            <Text color={theme.text.secondary} mt={1}>
              Don't have an account?{" "}
              <Link color="blue.500" fontWeight="semibold" onClick={() => navigate("/register")} cursor="pointer">
                Sign up for free
              </Link>
            </Text>
          </VStack>

          {/* Form */}
          <VStack spacing={5} align="stretch">
            {/* Email */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>Email address</Text>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </InputLeftElement>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="you@example.com"
                  focusBorderColor="blue.500"
                  borderColor={theme.border.secondary}
                  bg={theme.isDark ? "gray.800" : "gray.50"}
                  color={theme.text.primary}
                  _hover={{ borderColor: "blue.400" }}
                  _placeholder={{ color: theme.text.tertiary }}
                  _focus={{ bg: theme.bg.card, boxShadow: "0 0 0 3px rgba(66,153,225,0.15)" }}
                  borderRadius="xl"
                />
              </InputGroup>
            </Box>

            {/* Password */}
            <Box>
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary}>Password</Text>
                <Link color="blue.500" fontSize="sm" fontWeight="medium">Forgot password?</Link>
              </HStack>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </InputLeftElement>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  focusBorderColor="blue.500"
                  borderColor={theme.border.secondary}
                  bg={theme.isDark ? "gray.800" : "gray.50"}
                  color={theme.text.primary}
                  _hover={{ borderColor: "blue.400" }}
                  _placeholder={{ color: theme.text.tertiary }}
                  _focus={{ bg: theme.bg.card, boxShadow: "0 0 0 3px rgba(66,153,225,0.15)" }}
                  borderRadius="xl"
                  pr="48px"
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    color={theme.text.tertiary}
                    _hover={{ color: "blue.500" }}
                    aria-label="Toggle password"
                  />
                </InputRightElement>
              </InputGroup>
            </Box>

            {/* Remember me */}
            <HStack justify="space-between">
              <Checkbox colorScheme="blue" size="md">
                <Text fontSize="sm" color={theme.text.secondary}>Remember me for 30 days</Text>
              </Checkbox>
            </HStack>

            {/* Error */}
            {error && (
              <HStack
                bg={theme.isDark ? "red.900" : "red.50"}
                border="1px" borderColor={theme.isDark ? "red.700" : "red.200"}
                borderLeftWidth="4px" borderLeftColor="red.500"
                rounded="xl" p={3} spacing={3}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#E53E3E">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <Text fontSize="sm" color={theme.isDark ? "red.300" : "red.700"} fontWeight="medium">{error}</Text>
              </HStack>
            )}

            {/* Submit */}
            <Button
              onClick={handleLogin}
              isLoading={isLoading}
              loadingText="Signing in..."
              size="lg"
              w="full"
              bgGradient="linear(to-r, blue.500, indigo.600)"
              color="white"
              fontWeight="bold"
              borderRadius="xl"
              _hover={{ bgGradient: "linear(to-r, blue.600, indigo.700)", transform: "translateY(-2px)", shadow: "0 8px 25px rgba(66,153,225,0.4)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              shadow="md"
              h="54px"
              fontSize="md"
            >
              Sign In
            </Button>

            {/* Divider */}
            <HStack>
              <Box flex={1} h="1px" bg={theme.border.primary} />
              <Text fontSize="xs" color={theme.text.tertiary} px={2}>or continue with</Text>
              <Box flex={1} h="1px" bg={theme.border.primary} />
            </HStack>

            {/* Create account */}
            <Button
              variant="outline"
              size="lg"
              w="full"
              h="54px"
              borderColor={theme.border.secondary}
              color={theme.text.primary}
              borderRadius="xl"
              fontWeight="semibold"
              onClick={() => navigate("/register")}
              _hover={{ bg: theme.isDark ? "gray.700" : "gray.50", borderColor: "blue.400", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              leftIcon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              }
            >
              Create a new account
            </Button>
          </VStack>

          <Text textAlign="center" fontSize="xs" color={theme.text.tertiary} mt={8}>
            By signing in you agree to our{" "}
            <Link color="blue.500" fontWeight="medium">Terms</Link> and{" "}
            <Link color="blue.500" fontWeight="medium">Privacy Policy</Link>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
}