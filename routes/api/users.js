const express = require("express");
const User = require("../../model/User");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken');
const config= require('config');
const router = express.Router();
const { check, validationResult } = require("express-validator");

//@route /api/users
//@desc Register users
router.post(
  "/",
  [
    check("name", "Name must not be empty")
      .not()
      .isEmpty(),
    check("email", "Please send a valid email").isEmail(),
    check("password", "The password must be at least 6 caracters").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("User alredy exists");
    }
    try {
      
        const { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: "user alredy exists" });
      const avatar = gravatar.url(email, {s: "200",r: "pg", d: "mm"});

        user = new User({name,email,avatar,password});
        await user.save();

        const payload={ user:{ id: user.id } }
        jwt.sign(
            payload,
            config.get('jwt'),
            (err, token) => { 
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
