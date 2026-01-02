import { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      // ✅ Save JWT token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={6}
        width="320px"
        border="1px solid #e2e8f0"
        borderRadius="md"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Login
        </Text>

        {/* EMAIL */}
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ERROR */}
        {error && (
          <Text color="red.500" fontSize="sm" mb={3}>
            {error}
          </Text>
        )}

        {/* LOGIN BUTTON */}
        <Button width="100%" mb={3} onClick={handleLogin}>
          Login
        </Button>

        {/* REGISTER LINK */}
        <Text
          fontSize="sm"
          color="blue.500"
          cursor="pointer"
          textAlign="center"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </Text>
      </Box>
    </Box>
  );
}
