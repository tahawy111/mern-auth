const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log({ name, email, password });

  res.status(200).json({
    success: true,
    message: "Register Route",
  });
};
