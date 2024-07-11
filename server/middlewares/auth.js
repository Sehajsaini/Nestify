const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    console.log(req.cookies)
    const token = req.body.token || req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);

      req.user = decode;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    console.log("error", error)
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the token",
    });
  }
};
