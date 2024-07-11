const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* USER REGISTER */
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    const profileImagePath = profileImage.path;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileImagePath,
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Registration failed!", error: err.message });
  }
};

/* USER LOGIN */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json({
          success:false,
          message:"please fill all the details carefuylly"
      })
  }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({ message: "User doesn't exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const payload ={
      email:user.email,
      id:user._id,
      
  }

    const token = jwt.sign(payload, process.env.JWT_SECRET);


user.token=token;
user.password=undefined;


    // delete user.password;

    // res.status(200).json({ token, user });

    const options={
      expires:new Date(Date.now()+ 3*24*60*60*1000),
      httpOnly:true,
  }
  
  
  
  
  res.cookie("token",token,options).status(200).json({
      success:true,
      token,
      user,
      message:"user logged in successfully",
  })
  




  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
