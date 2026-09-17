const success = (res, message, data = {}) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const error = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

module.exports = {
  success,
  error,
};
