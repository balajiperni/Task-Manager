// src/components/Sidebar.jsx
import { useState } from "react";
import {
    Box,
    VStack,
    Button,
    Avatar,
    Tooltip,
    IconButton,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import CreateTaskModal from "./CreateTaskModal";

const SunIcon = () => (
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
);

const MoonIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

const NAV_ITEMS = [
    {
        path: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        path: "/tasks",
        label: "Tasks",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
        ),
    },
    {
        path: "/visualizations",
        label: "Visualizations",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
        ),
    },
    {
        path: "/friends",
        label: "Friends",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

export default function Sidebar({ userName = "User", onTaskCreated }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <Box
            w="80px"
            bg={theme.bg.card}
            borderRight="1px"
            borderColor={theme.border.primary}
            display="flex"
            flexDirection="column"
            h="100vh"
            flexShrink={0}
        >
            {/* Logo */}
            <Box p={4} borderBottom="1px" borderColor={theme.border.primary}>
                <Box
                    w={12}
                    h={12}
                    bg={theme.isDark ? "gray.700" : "white"}
                    border="2px"
                    borderColor="blue.500"
                    rounded="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    cursor="pointer"
                    onClick={() => navigate("/dashboard")}
                    _hover={{ transform: "scale(1.05)", borderColor: "blue.600" }}
                    transition="all 0.2s"
                    shadow="sm"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3182CE" strokeWidth="2.5">
                        <path d="M9 11l3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                </Box>
            </Box>

            {/* Navigation Items */}
            <VStack flex={1} spacing={1} p={2} pt={3}>
                {/* Create Task Button — top of nav */}
                <Tooltip label="Create Task" placement="right">
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        w="full"
                        h="56px"
                        bg={theme.isDark ? "gray.700" : "white"}
                        color="blue.500"
                        border="2px"
                        borderColor="blue.500"
                        borderRadius="xl"
                        mb={1}
                        _hover={{
                            bg: theme.isDark ? "blue.900" : "blue.50",
                            borderColor: "blue.600",
                            color: "blue.600",
                            transform: "scale(1.05)",
                            shadow: "sm",
                        }}
                        transition="all 0.2s"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        aria-label="Create Task"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </Button>
                </Tooltip>

                {NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip key={item.path} label={item.label} placement="right">
                            <Button
                                onClick={() => navigate(item.path)}
                                variant="ghost"
                                w="full"
                                h="56px"
                                display="flex"
                                flexDirection="column"
                                fontSize="xs"
                                color={isActive ? "blue.500" : theme.text.secondary}
                                bg={isActive ? (theme.isDark ? "blue.900" : "blue.50") : "transparent"}
                                _hover={{
                                    bg: isActive
                                        ? theme.isDark ? "blue.800" : "blue.100"
                                        : theme.bg.hover,
                                    color: "blue.500",
                                }}
                                borderRadius="xl"
                                transition="all 0.2s"
                                position="relative"
                            >
                                {isActive && (
                                    <Box
                                        position="absolute"
                                        left="0"
                                        top="50%"
                                        transform="translateY(-50%)"
                                        w="3px"
                                        h="60%"
                                        bg="blue.500"
                                        borderRightRadius="full"
                                    />
                                )}
                                {item.icon}
                            </Button>
                        </Tooltip>
                    );
                })}
            </VStack>

            {/* Bottom Controls */}
            <Box p={3} borderTop="1px" borderColor={theme.border.primary}>
                <Tooltip label={theme.isDark ? "Light Mode" : "Dark Mode"} placement="right">
                    <IconButton
                        icon={theme.isDark ? <SunIcon /> : <MoonIcon />}
                        onClick={theme.toggleTheme}
                        variant="ghost"
                        w="full"
                        h="44px"
                        mb={2}
                        borderRadius="xl"
                        color={theme.text.secondary}
                        _hover={{ bg: theme.bg.hover, color: "blue.500" }}
                        aria-label="Toggle theme"
                    />
                </Tooltip>

                <Tooltip label="Logout" placement="right">
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        w="full"
                        h="44px"
                        color="red.500"
                        _hover={{ bg: theme.isDark ? "red.900" : "red.50" }}
                        borderRadius="xl"
                        mb={2}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </Button>
                </Tooltip>

                <Tooltip label={userName} placement="right">
                    <Avatar
                        size="sm"
                        name={userName}
                        bg="blue.500"
                        color="white"
                        mx="auto"
                        display="block"
                        cursor="pointer"
                    />
                </Tooltip>
            </Box>

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onTaskCreated={onTaskCreated}
            />
        </Box>
    );
}
