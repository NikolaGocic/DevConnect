const express = require("express");
const mongoose = require("mongoose");
const Profile = require("../../model/Profile");
const User = require("../../model/User");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

//@route Get api/profile/me
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await (await Profile.findOne({ user: req.user.id })).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).send('There is not profile');
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//@route Post api/profile
//@desc Createor update a profile
router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills are required').not().isEmpty()
]],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            const {
                company,
                website,
                location,
                status,
                skills,
                bio,
                githubusername,
                youtube,
                twitter,
                facebook,
                linkedin,
                instagram
            } = req.body;
            console.log(req.body);
            console.log(req.user.id);
            //Build profile object
            const profileFields = {};
            profileFields.user = req.user.id;
            if (company) profileFields.company = company;
            if (website) profileFields.website = website;
            if (location) profileFields.location = location;
            if (status) profileFields.status = status;
            if (bio) profileFields.bio = bio;
            if (githubusername) profileFields.githubusername = githubusername;

            profileFields.social = {};
            if (youtube) profileFields.social.youtube = youtube;
            if (twitter) profileFields.social.twitter = twitter;
            if (facebook) profileFields.social.facebook = facebook;
            if (linkedin) profileFields.social.linkedin = linkedin;
            if (instagram) profileFields.social.instagram = instagram;


            if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
            console.log(profileFields);

            let profile = await Profile.findOne({ user: req.user.id });
            console.log(profile);
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                res.json(profile);
            }
            else { 
                profile = await Profile(profileFields);
                await profile.save();
                res.json(profile);
            }

            
        } catch (error) {
            res.status(500).send('Server error');
        }


    });


router.get('/allProfiles', auth, async (req, res) => { 
    try {
        let allProfiles = await Profile.find();
        res.json(allProfiles);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
