const axios = require("axios");

// Use 127.0.0.1 for local development (more reliable than localhost)
const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

exports.generateSubtasksFromML = async (description) => {
  try {
    const response = await axios.post(
      `${ML_BASE_URL}/generate-subtasks`,
      { description },
      { timeout: 10000 }
    );

    return response.data.subtasks || [];
  } catch (error) {
    console.error("ML Service Error:", error.message);
    // Return empty array on error to allow task creation to continue
    return [];
  }
};
