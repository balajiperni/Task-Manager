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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // After successful register → go to login
      navigate("/login");
    } catch (err) {
      setError("User already exists or invalid data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="gray.50"
      bgGradient="linear(to-br, blue.50, purple.50)"
      px={4}
    >
      <Container maxW="md" py={12}>
        {/* Card Container */}
        <Box
          bg="white"
          rounded="2xl"
          shadow="2xl"
          p={{ base: 8, md: 10 }}
          border="1px"
          borderColor="gray.100"
        >
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <VStack spacing={4} textAlign="center">
              {/* Icon */}
              <Box
                w={20}
                h={20}
                bgGradient="linear(to-br, purple.500, pink.600)"
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Box>

              <VStack spacing={2}>
                <Heading
                  size="2xl"
                  fontWeight="extrabold"
                  bgGradient="linear(to-r, purple.600, pink.600)"
                  bgClip="text"
                >
                  Create Account
                </Heading>
                <Text color="gray.600" fontSize="md">
                  Sign up to get started with your account
                </Text>
              </VStack>
            </VStack>

            {/* Form */}
            <VStack spacing={5} align="stretch">
              {/* Name Input */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Full Name
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
                      stroke="#A0AEC0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Box>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="John Doe"
                    size="lg"
                    pl="45px"
                    focusBorderColor="purple.500"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "purple.300",
                    }}
                  />
                </Box>
              </Box>

              {/* Email Input */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
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
                      stroke="#A0AEC0"
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
                    focusBorderColor="purple.500"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "purple.300",
                    }}
                  />
                </Box>
              </Box>

              {/* Password Input */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
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
                      stroke="#A0AEC0"
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
                    focusBorderColor="purple.500"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "purple.300",
                    }}
                  />
                </Box>
              </Box>

              {/* Confirm Password Input */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={2}
                >
                  Confirm Password
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
                      stroke="#A0AEC0"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="••••••••"
                    size="lg"
                    pl="45px"
                    focusBorderColor="purple.500"
                    borderColor="gray.300"
                    _hover={{
                      borderColor: "purple.300",
                    }}
                  />
                </Box>
              </Box>

              {/* Terms & Conditions */}
              <Checkbox
                colorScheme="purple"
                size="md"
                isChecked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              >
                <Text fontSize="sm" color="gray.600">
                  I agree to the{" "}
                  <Link color="purple.600" fontWeight="semibold">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link color="purple.600" fontWeight="semibold">
                    Privacy Policy
                  </Link>
                </Text>
              </Checkbox>

              {/* Error Message */}
              {error && (
                <Box
                  bg="red.50"
                  border="1px"
                  borderColor="red.200"
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
                    <Text fontSize="sm" color="red.700" fontWeight="medium">
                      {error}
                    </Text>
                  </HStack>
                </Box>
              )}

              {/* Register Button */}
              <Button
                onClick={handleRegister}
                isLoading={isLoading}
                loadingText="Creating account..."
                size="lg"
                fontSize="md"
                fontWeight="bold"
                bgGradient="linear(to-r, purple.500, pink.600)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, purple.600, pink.700)",
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                _active={{
                  transform: "translateY(0)",
                  shadow: "md",
                }}
                transition="all 0.2s"
                shadow="md"
              >
                Create Account
              </Button>
            </VStack>

            {/* Divider */}
            <HStack spacing={4}>
              <Box flex={1} height="1px" bg="gray.200" />
              <Text
                fontSize="sm"
                color="gray.500"
                fontWeight="medium"
                whiteSpace="nowrap"
              >
                Already have an account?
              </Text>
              <Box flex={1} height="1px" bg="gray.200" />
            </HStack>

            {/* Login Link */}
            <Button
              variant="outline"
              size="lg"
              colorScheme="purple"
              fontWeight="semibold"
              onClick={() => navigate("/login")}
              _hover={{
                bg: "purple.50",
                transform: "translateY(-2px)",
                shadow: "md",
              }}
              transition="all 0.2s"
            >
              Sign In Instead
            </Button>
          </VStack>
        </Box>

        {/* Footer */}
        <Text textAlign="center" fontSize="xs" color="gray.500" mt={8} px={4}>
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </Text>
      </Container>
    </Flex>
  );
}