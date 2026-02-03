const axios = require("axios");

const ML_BASE_URL = "http://localhost:8000";

exports.generateSubtasks = async (description) => {
  const response = await axios.post(
    `${ML_BASE_URL}/generate-subtasks`,
    { description },
    {
      timeout: 5000
    }
  );

  return response.data.subtasks;
};
