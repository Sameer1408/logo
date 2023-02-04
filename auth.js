const express = require('express');
const User = require('./models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'ABCDEFGHIGKLMNOPQRSTUWXYZ';
const fetchuser = require('./middleware/fetchUser');
const Student = require('./models/Student');
const cloudinary  = require('cloudinary')

//Create a User using: POST "/api/auth/createUser" ->no authenticaton required
router.post('/createUser', [
  body('name', "Enter a valid name").isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
],
  async (req, res) => {
    const errors = validationResult(req);
    //if there are error
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check whether the email exists already  
      console.log(req.body.email,"emaillll");
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.status(201).json({success:true,authtoken })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured")
    }

  })
 
router.post('/addStudent',fetchuser,async(req,res)=>{
  try{
    let userId =req.user.id;
    console.log(req.body);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "studentPhotos",});
      console.log(myCloud,"myCloud");

      let obj = req.body;
     let student = await Student.create({
      userId:userId,
      firstName:obj.firstName,
      middleName:obj.middleName,
      lastName:obj.lastName,
      className:obj.className,
      section:obj.section,
      rollNumber:obj.rollNumber,
      addressLine1:obj.addressLine1,
      addressLine2:obj.addressLine2,
      landMark:obj.landMark,
      city:obj.city,
      pincode:obj.pincode,
      image:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
      }
    })
    res.status(200).json({success:true,student});
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

router.get('/getAllStudent',fetchuser,async(req,res)=>{
    try{
      let userId =req.user.id;
      let allStudents = await Student.find({userId});
      res.status(200).json({allStudents});
    }catch(error)
    {
    console.error(error.message);
    res.status(500).send("Some error occured")
    }
})

router.post('/updateStudent',fetchuser,async(req,res)=>{
  try{
    
    const obj = req.body;
    let student =  await Student.findByIdAndUpdate(obj.id,{
      firstName:obj.firstName,
      middleName:obj.middleName,
      lastName:obj.lastName,
      className:obj.className,
      section:obj.section,
      rollNumber:obj.rollNumber,
      addressLine1:obj.addressLine1,
      addressLine2:obj.addressLine2,
      landMark:obj.landMark,
      city:obj.city,
      pincode:obj.pincode
    })
    console.log(student,"student");
    res.status(200).json(student);
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

router.post('/removeStudent',fetchuser,async(req,res)=>{
  try{
    let doc = await Student.findById(req.body.id).remove();
    res.status(200).json(doc);
  }catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }
})

//Login a User using: POST "/api/auth/login" ->no authenticaton required
router.post('/login',  async (req, res) => {
  //if there are error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Sorry user not found"
      })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({
        error: "Sorry invalid credentials"
      })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.status(201).json({success:true,authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }

})

//Get Logged in user details :POST"api/auth/getuser.Login or authentication required
router.get('/getuser',fetchuser, async (req, res) => {
 try {
    userId =req.user.id
    console.log("userId",userId);
    const user = await User.findById(userId).select("-password");
    res.status(200).json({user});

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured")
  }
})

module.exports = router;