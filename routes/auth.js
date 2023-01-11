const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'Shreyanisagoodb$oy'

// Create a user using: POST "/api/auth/createuser". No Login Required
router.post('/createuser', [
   body('name', 'Enter a valid name').isLength({ min: 3 }),
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
   // if there are errors, return Bad request and the errors
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   try {
      // Check whether the user email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
         return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: secPass,
      })
      const data = {
         user:{
            id: user.id
         }
      }      
      const authtoken = jwt.sign(data,JWT_SECRET);
      // console.log(jwt_data)
      // res.json(user)
      res.json({authtoken})
   }
   catch (error) {
      console.error(error.message)
      res.status(500).send("Internal Server Error occured")
      }
   //  .then(user => res.json(user))
   //  .catch(err => {console.log(err)
   // res.json({error: 'Please enter a unique value for email', message: err.message})})
})

// Authenticate the user
router.post('/login', [
   body('email', 'Enter a valid email').isEmail(),
   body('password', 'Password could not be blank').exists(),

], async (req, res) => {
    // if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }

    const {email, password } = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
         return res.status(400).json({error: "Please try to login with correct credentials"})
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
         return res.status(400).json({error: "Please try to login with correct credentials"})
      }

      const data = {
         user:{
            id: user.id
         }
      }      
      const authtoken = jwt.sign(data,JWT_SECRET);
      res.json(authtoken)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error occured")
    }
}
)

// Route 3: Get logged in user's details using : POST "api/auth/getuser". Login Required

router.post('/getuser', [
], async (req, res) => {
try {
   userId = "todo"
   const user = await User.findById(userId).select("-password")
} catch (error) {
   console.error(error.message);
   res.status(500).send("Internal Server Error occured")
}
})

module.exports = router