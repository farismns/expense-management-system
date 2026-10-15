const getCurrentUser = (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Authentication successful",
    data: {
      user: req.user,
    },
  });
};

export default { getCurrentUser };
