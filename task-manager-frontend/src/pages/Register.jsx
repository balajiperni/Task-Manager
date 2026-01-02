import { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      // ✅ After successful register → go to login
      navigate("/login");
    } catch (err) {
      setError("User already exists or invalid data");
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
          Register
        </Text>

        <input
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Text color="red.500" fontSize="sm" mb={3}>
            {error}
          </Text>
        )}

        <Button width="100%" mb={3} onClick={handleRegister}>
          Register
        </Button>

        <Text
          fontSize="sm"
          color="blue.500"
          cursor="pointer"
          textAlign="center"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </Text>
      </Box>
    </Box>
  );
}
