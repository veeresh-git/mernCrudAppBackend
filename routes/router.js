const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const users = require("../models/userSchema");
const adminUsers = require("../models/adminUserSchema");
const accessTokenSecret = "curdappaccesstokensecret";

// router.get("/",(req,res)=>{
//     console.log("connect");
// });

//Authenticate api
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader, "authHeader");
  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin Login
router.post("/login", async (req, res, next) => {
  // console.log(req.body);
  let { userName, password } = req.body;

  let existingUser;
  try {
    existingUser = await adminUsers.findOne({ userName: userName });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  if (!existingUser || existingUser.password != password) {
    const error = Error("Wrong details please check at once");
    return next(error);
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign({ userName: existingUser.userName }, accessTokenSecret, {
      expiresIn: "1h",
    });
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      userName: existingUser.userName,
      token: token,
    },
  });
});

// register user

router.post("/register", authenticateJWT, async (req, res, next) => {
  // console.log(req.body);
  const { name, email, gender, mobile, designation } = req.body;
  try {
    if (!name || !email || !gender || !mobile || !designation) {
      res.status(422).json("Enter all the details!");
    }

    const preuser = await users.findOne({ email: email });

    if (preuser) {
      res.status(422).json("This user is already present");
    } else {
      const adduser = new users({
        name,
        email,
        gender,
        mobile,
        designation,
      });

      await adduser.save();
      res.status(201).json(adduser);
    }
  } catch (error) {
    return next(new Error("Something went wrong"));
  }
});

// get userdata

router.get("/getdata", authenticateJWT, async (req, res) => {
  try {
    const userdata = await users.find();
    res.status(201).json(userdata);
    console.log(userdata);
  } catch (error) {
    res.status(422).json(error);
  }
});

// get individual user

router.get("/getuser/:id", authenticateJWT, async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const userindividual = await users.findById({ _id: id });
    console.log(userindividual);
    res.status(201).json(userindividual);
  } catch (error) {
    res.status(422).json(error);
  }
});

// update user data

router.patch("/updateuser/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, gender, mobile, designation } = req.body;

    if (!name || !email || !gender || !mobile || !designation) {
      res.status(422).json("Enter all the details!");
    }

    const preuser = await users.findOne({ email: email });

    if (preuser && preuser?._id?.toString() !== id) {
      res.status(422).json("This email is already taken");
    } else {
      const updateduser = await users.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      console.log(updateduser);
      res.status(201).json(updateduser);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

// delete user
router.delete("/deleteuser/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;

    const deletuser = await users.findByIdAndDelete({ _id: id });
    console.log(deletuser);
    res.status(201).json(deletuser);
  } catch (error) {
    res.status(422).json(error);
  }
});

module.exports = router;
