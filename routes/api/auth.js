const express = require("express");
const User = require("../../model/User");
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");


router.get("/", auth, async(req, res) => { 
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

//@route /api/auth
//@desc  Login User
router.post(
    '/',
         //Cheking data for iregularities
    [
        check('email', "Email must not be empty").not().isEmpty(),
        check("email", "Please send a valid email").isEmail(),
        check("password", "Password is required").isLength({min:6})
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
            
           if (!user) return res.status(400).send('User with this email not found');
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
