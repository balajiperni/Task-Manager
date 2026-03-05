// src/pages/Register.jsx
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
  SimpleGrid,
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

const CheckIcon = ({ ok }) => ok ? (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
) : (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
);

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const strength = getPasswordStrength(password);
  const strengthColors = ["red.400", "orange.400", "yellow.400", "green.400"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) { setError("All fields are required"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!acceptTerms) { setError("Please accept the terms and conditions"); return; }
    setIsLoading(true);
    try {
      await api.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch {
      setError("This email is already registered or invalid data was provided.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    borderColor: theme.border.secondary,
    bg: theme.isDark ? "gray.800" : "gray.50",
    color: theme.text.primary,
    _hover: { borderColor: "blue.400" },
    _placeholder: { color: theme.text.tertiary },
    _focus: { bg: theme.bg.card, boxShadow: "0 0 0 3px rgba(66,153,225,0.15)" },
    borderRadius: "xl",
    focusBorderColor: "blue.500",
  };

  return (
    <Flex minH="100vh" bg={theme.bg.primary}>
      {/* ── Left decorative panel ── */}
      <Box
        display={{ base: "none", lg: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
        w="42%"
        bgGradient="linear(135deg, indigo.700 0%, blue.600 60%, cyan.500 100%)"
        p={12}
        position="relative"
        overflow="hidden"
      >
        {/* Background decorations */}
        <Box position="absolute" top="-100px" right="-100px" w="400px" h="400px" bg="whiteAlpha.100" rounded="full" filter="blur(70px)" />
        <Box position="absolute" bottom="-80px" left="-80px" w="300px" h="300px" bg="blue.400" opacity={0.15} rounded="full" filter="blur(50px)" />

        {/* Floating cards decoration */}
        <Box position="absolute" top="25%" right="-20px" w="160px" bg="whiteAlpha.100" backdropFilter="blur(15px)" border="1px" borderColor="whiteAlpha.200" rounded="2xl" p={4}>
          <HStack mb={2}>
            <Box w={7} h={7} bg="green.400" rounded="lg" display="flex" alignItems="center" justifyContent="center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </Box>
            <Text fontSize="xs" fontWeight="bold" color="white">Task Done!</Text>
          </HStack>
          <Text fontSize="xs" color="whiteAlpha.700">Design mockup v2</Text>
        </Box>

        <Box position="absolute" bottom="30%" right="-10px" w="150px" bg="whiteAlpha.100" backdropFilter="blur(15px)" border="1px" borderColor="whiteAlpha.200" rounded="2xl" p={4}>
          <HStack mb={2}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ECC94B" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <Text fontSize="xs" fontWeight="bold" color="white">AI Ready</Text>
          </HStack>
          <Text fontSize="xs" color="whiteAlpha.700">5 subtasks generated</Text>
        </Box>

        {/* Logo */}
        <HStack spacing={3}>
          <Box w={11} h={11} bg="whiteAlpha.300" rounded="xl" display="flex" alignItems="center" justifyContent="center" backdropFilter="blur(10px)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </Box>
          <Text fontWeight="extrabold" fontSize="xl" color="white" letterSpacing="-0.5px">TaskFlow</Text>
        </HStack>

        {/* Hero copy */}
        <Box my={12}>
          <Heading size="2xl" color="white" fontWeight="extrabold" lineHeight="1.15" mb={5}>
            Start achieving<br />more, today
          </Heading>
          <Text color="whiteAlpha.800" fontSize="md" maxW="320px" lineHeight="1.7" mb={8}>
            Join thousands of users who manage projects smarter with AI-powered task generation and real-time collaboration.
          </Text>

          {/* Stats */}
          <SimpleGrid columns={2} spacing={5}>
            {[
              { value: "10K+", label: "Active users" },
              { value: "98%", label: "Satisfaction rate" },
              { value: "50K+", label: "Tasks completed" },
              { value: "Free", label: "Always free tier" },
            ].map((stat) => (
              <Box key={stat.label} bg="whiteAlpha.100" backdropFilter="blur(10px)" rounded="xl" p={4} border="1px" borderColor="whiteAlpha.200">
                <Text fontSize="xl" fontWeight="extrabold" color="white">{stat.value}</Text>
                <Text fontSize="xs" color="whiteAlpha.700">{stat.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Bottom quote */}
        <Box bg="whiteAlpha.100" backdropFilter="blur(10px)" rounded="2xl" p={5} border="1px" borderColor="whiteAlpha.200">
          <Text color="white" fontSize="sm" fontStyle="italic" mb={3}>
            "Went from chaos to clarity in one week. The AI subtask feature is genuinely magical."
          </Text>
          <HStack spacing={3}>
            <Box w={8} h={8} bg="cyan.400" rounded="full" display="flex" alignItems="center" justifyContent="center">
              <Text fontSize="xs" fontWeight="bold" color="white">SP</Text>
            </Box>
            <Box>
              <Text fontSize="xs" fontWeight="bold" color="white">Sneha P.</Text>
              <Text fontSize="xs" color="whiteAlpha.600">Startup Founder</Text>
            </Box>
          </HStack>
        </Box>
      </Box>

      {/* ── Right form panel ── */}
      <Flex
        flex={1}
        direction="column"
        justify="center"
        px={{ base: 6, md: 12, xl: 16 }}
        py={10}
        bg={theme.bg.primary}
        overflowY="auto"
        position="relative"
      >
        {/* Theme toggle */}
        <Box position="absolute" top={6} right={6}>
          <Tooltip label={theme.isDark ? "Light Mode" : "Dark Mode"}>
            <IconButton icon={theme.isDark ? <SunIcon /> : <MoonIcon />} onClick={theme.toggleTheme} variant="ghost" colorScheme="blue" aria-label="Toggle theme" size="sm" />
          </Tooltip>
        </Box>

        <Box maxW="440px" w="full" mx="auto">
          {/* Header */}
          <VStack align="start" spacing={2} mb={8}>
            <HStack spacing={2} mb={2}>
              <Box w={1.5} h={6} bg="indigo.500" rounded="full" />
              <Text fontSize="sm" fontWeight="bold" color="indigo.500" letterSpacing="wider" textTransform="uppercase">
                Create account
              </Text>
            </HStack>
            <Heading size="2xl" color={theme.text.primary} fontWeight="extrabold" lineHeight="1.1">
              Get started<br />for free
            </Heading>
            <Text color={theme.text.secondary} mt={1}>
              Already have an account?{" "}
              <Link color="blue.500" fontWeight="semibold" onClick={() => navigate("/login")} cursor="pointer">
                Sign in
              </Link>
            </Text>
          </VStack>

          {/* Form */}
          <VStack spacing={4} align="stretch">
            {/* Name */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>Full Name</Text>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </InputLeftElement>
                <Input {...inputStyle} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" onKeyPress={(e) => e.key === "Enter" && handleRegister()} />
              </InputGroup>
            </Box>

            {/* Email */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>Email Address</Text>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </InputLeftElement>
                <Input {...inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" onKeyPress={(e) => e.key === "Enter" && handleRegister()} />
              </InputGroup>
            </Box>

            {/* Password */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>Password</Text>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </InputLeftElement>
                <Input {...inputStyle} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" pr="48px" onKeyPress={(e) => e.key === "Enter" && handleRegister()} />
                <InputRightElement>
                  <IconButton icon={showPassword ? <EyeOffIcon /> : <EyeIcon />} variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} color={theme.text.tertiary} _hover={{ color: "blue.500" }} aria-label="Toggle password" />
                </InputRightElement>
              </InputGroup>

              {/* Password strength */}
              {password.length > 0 && (
                <Box mt={2}>
                  <HStack mb={1.5} spacing={1}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} flex={1} h="4px" bg={strength >= i ? strengthColors[strength - 1] : theme.border.primary} rounded="full" transition="all 0.3s" />
                    ))}
                    <Text fontSize="xs" color={strength > 0 ? strengthColors[strength - 1] : theme.text.tertiary} fontWeight="semibold" pl={1} minW="40px">
                      {strength > 0 ? strengthLabels[strength - 1] : ""}
                    </Text>
                  </HStack>
                  <VStack align="start" spacing={1}>
                    {[
                      { check: password.length >= 8, label: "At least 8 characters" },
                      { check: /[A-Z]/.test(password), label: "Uppercase letter" },
                      { check: /[0-9]/.test(password), label: "Number" },
                    ].map((rule) => (
                      <HStack key={rule.label} spacing={2}>
                        <CheckIcon ok={rule.check} />
                        <Text fontSize="xs" color={rule.check ? "green.500" : theme.text.tertiary}>{rule.label}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>

            {/* Confirm Password */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color={theme.text.primary} mb={2}>Confirm Password</Text>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" pl={1}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A0AEC0" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </InputLeftElement>
                <Input
                  {...inputStyle}
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  pr="48px"
                  borderColor={confirmPassword && confirmPassword !== password ? "red.400" : confirmPassword && confirmPassword === password ? "green.400" : theme.border.secondary}
                  onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                />
                <InputRightElement>
                  <IconButton icon={showConfirm ? <EyeOffIcon /> : <EyeIcon />} variant="ghost" size="sm" onClick={() => setShowConfirm(!showConfirm)} color={theme.text.tertiary} _hover={{ color: "blue.500" }} aria-label="Toggle confirm password" />
                </InputRightElement>
              </InputGroup>
              {confirmPassword && confirmPassword === password && (
                <HStack mt={1} spacing={1}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38A169" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  <Text fontSize="xs" color="green.500">Passwords match</Text>
                </HStack>
              )}
            </Box>

            {/* Terms */}
            <Checkbox colorScheme="blue" isChecked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}>
              <Text fontSize="sm" color={theme.text.secondary}>
                I agree to the{" "}
                <Link color="blue.500" fontWeight="semibold">Terms of Service</Link>
                {" "}and{" "}
                <Link color="blue.500" fontWeight="semibold">Privacy Policy</Link>
              </Text>
            </Checkbox>

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
              onClick={handleRegister}
              isLoading={isLoading}
              loadingText="Creating account..."
              size="lg"
              w="full"
              h="54px"
              bgGradient="linear(to-r, indigo.500, blue.500)"
              color="white"
              fontWeight="bold"
              borderRadius="xl"
              fontSize="md"
              _hover={{ bgGradient: "linear(to-r, indigo.600, blue.600)", transform: "translateY(-2px)", shadow: "0 8px 25px rgba(102,126,234,0.4)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              shadow="md"
            >
              Create Account
            </Button>

            <Button
              variant="outline"
              size="lg"
              w="full"
              h="54px"
              borderColor={theme.border.secondary}
              color={theme.text.primary}
              borderRadius="xl"
              fontWeight="semibold"
              onClick={() => navigate("/login")}
              _hover={{ bg: theme.isDark ? "gray.700" : "gray.50", borderColor: "blue.400", transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Already have an account? Sign in
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Flex>
  );
}