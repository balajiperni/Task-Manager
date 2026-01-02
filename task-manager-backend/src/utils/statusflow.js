const STATUS_FLOW = {
  Pending: ["In Progress"],
  "In Progress": ["Completed"],
  Completed: ["In Progress"] // 👈 Reopen allowed
};

exports.isValidStatusTransition = (current, next) => {
  return STATUS_FLOW[current]?.includes(next);
};
