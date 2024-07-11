const router = require("express").Router();
const {register,login} = require("../controllers/authController");
const upload = require("../middlewares/multerConfig");

/* Configuration Multer for File Upload */


/* USER REGISTER */
router.post("/register", upload.single("profileImage"),register);

/* USER LOGIN */
router.post("/login", login);

module.exports = router;
