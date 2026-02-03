const axios = require("axios");

const ML_BASE_URL = "http://127.0.0.1:8000";

async function generateSubtasks(description) {
  const response = await axios.post(
    `${ML_BASE_URL}/generate-subtasks`,
    { description },
    {
      timeout: 5000
    }
  );

  return response.data;
}

module.exports = {
  generateSubtasks
};
