import { useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  // Create task
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const TASKS_PER_PAGE = 5;

  const navigate = useNavigate();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data.tasks || res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, priorityFilter]);

  const createTask = async () => {
    if (!newTitle.trim()) return;

    await api.post("/tasks", {
      title: newTitle,
      priority: newPriority,
      dueDate: newDueDate || null
    });

    setNewTitle("");
    setNewPriority("Medium");
    setNewDueDate("");
    fetchTasks();
  };

  const updateTask = async (id, data) => {
    await api.put(`/tasks/${id}`, data);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const statusColor = (status) => {
    if (status === "Completed") return "#C6F6D5";
    if (status === "In Progress") return "#FAF089";
    return "#FED7D7";
  };

  // Filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + TASKS_PER_PAGE
  );

  return (
    <Box p={6}>
      {/* HEADER */}
      <Box mb={4} display="flex" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          Tasks
        </Text>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Box>

      {/* SEARCH & FILTERS */}
      <Box mb={4} display="flex" gap={3} flexWrap="wrap">
        <input
          placeholder="Search tasks..."
          style={{ padding: "8px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={{ padding: "8px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          style={{ padding: "8px" }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </Box>

      {/* CREATE TASK */}
      <Box mb={6} border="1px solid #e2e8f0" p={4} borderRadius="md">
        <Text mb={2} fontWeight="bold">
          Create Task
        </Text>

        <input
          style={{ padding: "8px", marginRight: "8px" }}
          placeholder="Task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <select
          style={{ padding: "8px", marginRight: "8px" }}
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          style={{ padding: "8px", marginRight: "8px" }}
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />

        <Button onClick={createTask}>Add</Button>
      </Box>

      {/* TASK LIST */}
      {paginatedTasks.length === 0 && <Text>No tasks found.</Text>}

      {paginatedTasks.map((task) => (
        <Box
          key={task.id}
          p={4}
          mb={3}
          border="1px solid #e2e8f0"
          borderRadius="md"
          background={statusColor(task.status)}
        >
          <Box display="flex" justifyContent="space-between">
            <input
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                width: "70%"
              }}
              value={task.title}
              onChange={(e) =>
                updateTask(task.id, { title: e.target.value })
              }
            />

            <Button
              colorScheme="red"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </Button>
          </Box>

          <Text fontSize="sm">
            Due: {task.dueDate ? task.dueDate.split("T")[0] : "—"}
          </Text>

          <Box mt={2}>
            <select
              style={{ marginRight: "8px", padding: "6px" }}
              value={task.priority}
              onChange={(e) =>
                updateTask(task.id, { priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              style={{ padding: "6px" }}
              value={task.status}
              onChange={(e) =>
                updateTask(task.id, { status: e.target.value })
              }
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </Box>
        </Box>
      ))}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Box mt={4} display="flex" gap={2} justifyContent="center">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              size="sm"
              variant={
                currentPage === index + 1 ? "solid" : "outline"
              }
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
