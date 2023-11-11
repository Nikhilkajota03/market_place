const router = require('express').Router();
const User  = require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware")



//register

router.post("/register", async (req, res) => {


  try {
    const { name, email, password } = req.body;

    if (!name) {
      return res.json({ success: false, message: 'Name is required' });
    }

    if (!email) {
      return res.json({ success: false, message: 'Email is required' });
    }

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.json({ success: false, message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hashSync(password, salt);
      const newUser = new User({
        name: name,
        email: email,
        password: hashpass,
      });
      const savedUser = await newUser.save();
      return res.json({ success: true, message: "User registered successfully" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});



   
  //login

  router.post("/login", async (req, res) => {
    try {
      //   const {email,password}= req.body;
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         throw new Error("user not found");
      }
  
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        throw new Error("wrong credentials");
      }
  
      //  res.status(200).json(user);
  
      const token = jwt.sign(
        { userId : user._id, username: user.name, email: user.email },
         "nafafifjfi",
        { expiresIn: "1d" } 
      );
      const { password, ...info } = user._doc;

        

      res.send({ success:true , message:"user logged in successfully",data:token}) ;


    } catch (err) {
      res.status(400).json(err);
    }
  });


  // get current user

  
router.get('/get-current-user', authMiddleware , async (req, res) => {
  try {
    
    const user = await User.findById(req.body.userId);

    if (!user) {

      
      res.send({ success:false , message:"user not found",data:user}) ;

    }

    res.send({ success:true , message:"user  fetch successfully",data:user}) ;

  } catch (error) {
    res.send({ success:false , message:error.message}) ;
  }
});

  module.exports = router;