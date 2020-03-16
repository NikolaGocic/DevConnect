const express = require("express");
const User = require("../../model/User");
const router = express.Router();
const auth = require('../../middleware/auth');


router.get("/", auth, async(req, res) => { 
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
