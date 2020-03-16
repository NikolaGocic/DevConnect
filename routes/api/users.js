const express = require("express");
const User = require("../../model/User");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = express.Router();
const { check, validationResult } = require("express-validator");

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
                
                if (user) return res.status(400).json({ error: "user alredy exists" });
                
                const avatar = gravatar.url(email, {      // User avatar
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

//@route /api/users/login
//@desc  Login User
router.post(
    '/login',
         //Cheking data for iregularities
    [
        check('email', "Email must not be empty").not().isEmpty(),
        check("email", "Please send a valid email").isEmail(),
        check("password", "Password must be minimum 6 leters").isLength({min:6})
    ],
        //Main fucntion that returns token after suc login
    async (req, res) => { 
       try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            const { email, password } = req.body;
            let user = await User.findOne({ email: email });
            
           if (!user) return res.send('User with this email not found');
           if (user.password != password) return res.send('Incorect password');
           
            
            const payload = { user: { id: user.id } };

            jwt.sign(payload, config.get("jwt"), (err, token) => {
                if (err) throw err;
                res.json({ token });
                });
       } catch (error) {
           res.send('Server error');
       } 
    }
);

module.exports = router;
