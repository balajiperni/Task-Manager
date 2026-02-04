const axios = require("axios");

exports.generateSubtasksFromML = async (description) => {
  const response = await axios.post(
    "http://localhost:8000/generate-subtasks",
    { description },
    { timeout: 10000 }
  );

  return response.data.subtasks || [];
};
