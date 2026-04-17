const axios = require("axios");

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

async function generateSubtasks(description) {
  try {
    const response = await axios.post(
      `${ML_BASE_URL}/generate-subtasks`,
      { description },
      {
        timeout: 10000
      }
    );

    return response.data;
  } catch (error) {
    console.error("ML Service Error:", error.message);
    throw new Error("ML service unavailable - please ensure the ML service is running on port 8000");
  }
}

module.exports = {
  generateSubtasks
};
