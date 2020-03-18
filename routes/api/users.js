const express = require("express");
const User = require("../../model/User");
const Profile = require("../../model/Profile");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = express.Router();

//@route /api/users/register
//@desc Register users
router.post(
     "/register",
     //Cheking data for iregularities
     [
          check("name", "Name must not be empty")
               .not()
               .isEmpty(),
          check("email", "Please send a valid email").isEmail(),
          check(
               "password",
               "The password must be at least 6 caracters"
          ).isLength({
               min: 6
          })
     ],
     //Main fucntion that returns token after suc register
     async (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
               return res.status(400).json(errors.array());
          }

          try {
               const { name, email, password } = req.body;
               let user = await User.findOne({ email });

               if (user)
                    return res
                         .status(400)
                         .json({ error: "user alredy exists" });

               const avatar = gravatar.url(email, {
                    // User avatar
                    s: "200",
                    r: "pg",
                    d: "mm"
               });

               user = new User({ name, email, avatar, password }); //Saving user to db
               await user.save();

               const payload = { user: { id: user.id } };

               jwt.sign(payload, config.get("jwt"), (err, token) => {
                    if (err) throw err;
                    res.json({ token });
               });
          } catch (err) {
               res.status(500).send("Server error");
          }
     }
);

//@route /api/users/allUsers
//@desc returns all users in the database
router.get("/allUsers", auth, async (req, res) => {
     try {
          let users = await User.find();
          res.json(users);
     } catch (error) {
          res.status(500).send("Server error");
     }
});

//@route /api/users/allUsers
//@desc returns all users in the database
router.delete("/", auth, async (req, res) => {
     try {
          await Profile.findOneAndRemove({ user: req.user.id });
          await User.findOneAndRemove(
               { _id: req.user.id },
               res.send("User suc deleted")
          );
     } catch (error) {
          res.status(500).send(error.message);
     }
});

module.exports = router;
