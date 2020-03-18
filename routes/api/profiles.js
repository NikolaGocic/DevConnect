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
          const profile = await (
               await Profile.findOne({ user: req.user.id })
          ).populate("user", ["name", "avatar"]);
          if (!profile) return res.status(400).send("There is not profile");
          res.json(profile);
     } catch (err) {
          console.error(err.message);
          res.status(500).send("Server error");
     }
});

//@route Post api/profile
//@desc Createor update a profile
router.post(
     "/",
     [
          auth,
          [
               check("status", "Status is required")
                    .not()
                    .isEmpty(),
               check("skills", "Skills are required")
                    .not()
                    .isEmpty()
          ]
     ],
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

               //Build profile object
               const profileFields = {};
               profileFields.user = req.user.id;
               if (company) profileFields.company = company;
               if (website) profileFields.website = website;
               if (location) profileFields.location = location;
               if (status) profileFields.status = status;
               if (bio) profileFields.bio = bio;
               if (githubusername)
                    profileFields.githubusername = githubusername;

               profileFields.social = {};
               if (youtube) profileFields.social.youtube = youtube;
               if (twitter) profileFields.social.twitter = twitter;
               if (facebook) profileFields.social.facebook = facebook;
               if (linkedin) profileFields.social.linkedin = linkedin;
               if (instagram) profileFields.social.instagram = instagram;

               if (skills)
                    profileFields.skills = skills
                         .split(",")
                         .map(skill => skill.trim());

               let profile = await Profile.findOne({ user: req.user.id });

               if (profile) {
                    profile = await Profile.findOneAndUpdate(
                         { user: req.user.id },
                         { $set: profileFields },
                         { new: true }
                    );
                    res.json(profile);
               } else {
                    profile = await Profile(profileFields);
                    await profile.save();
                    res.json(profile);
               }
          } catch (error) {
               res.status(500).send("Server error");
          }
     }
);

//@route api/profiles/allProfiles
//@desc GET all profiles
router.get("/allProfiles", auth, async (req, res) => {
     try {
          let allProfiles = await Profile.find();
          res.json(allProfiles);
     } catch (error) {
          res.status(500).send("Server error");
     }
});

//@route api/profiles/byUserId
//@desc GET profile by user id
router.get("/byUserId", auth, async (req, res) => {
     try {
          let profile = await Profile.findOne({ user: req.user.id });
          res.json(profile);
     } catch (error) {
          res.status(500).send("Server error");
     }
});

//@route api/profiles/byUserId/3
//@desc GET other users profile by their id
router.get("/byUserId/:user_id", auth, async (req, res) => {
     try {
          const profile = await Profile.find({
               user: req.params.user_id
          }).populate("user", ["name", "avatar"]);
          if (!profile) res.status(401).send("User dosent exist");
          res.json(profile);
     } catch (error) {
          res.status(500).send("Server error");
     }
});

//@route api/profiles/addExp
//@desc PUT a exp in the array od exp in the users profile
router.put(
     "/addExp",
     [
          auth,
          [
               check("title", "Title is required")
                    .not()
                    .isEmpty(),
               check("company", "Company name is required")
                    .not()
                    .isEmpty(),
               check("from", "From Date is required")
                    .not()
                    .isEmpty()
          ]
     ],
     async (req, res) => {
          try {
               const {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description
               } = req.body;

               const exp = {
                    title,
                    company,
                    location,
                    from,
                    to,
                    current,
                    description
               };

               const profile = await Profile.findOne({ user: req.user.id });
               profile.experience.unshift(exp);
               await profile.save();
               res.json(profile);
          } catch (error) {
               console.error(error.message);
               res.status(500).send("Server error");
          }
     }
);

//@route api/profiles/addEdu
//@desc PUT a edu in the array od edu in the users profile
router.put(
     "/addEdu",
     [
          auth,
          [
               check("school", "School is required")
                    .not()
                    .isEmpty(),
               check("degree", "Degree  is required")
                    .not()
                    .isEmpty(),
               check("fieldofstudy", "Fieldofstudy is required")
                    .not()
                    .isEmpty(),
               check("from", "From date is required")
                    .not()
                    .isEmpty()
          ]
     ],
     async (req, res) => {
          try {
               const {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
               } = req.body;

               const edu = {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
               };

               const profile = await Profile.findOne({ user: req.user.id });
               profile.education.unshift(edu);
               await profile.save();
               res.json(profile);
          } catch (error) {
               console.error(error.message);
               res.status(500).send("Server error");
          }
     }
);

//@routes /profiles/deleteExp/:exp_id
//@desc delete exp with the id
router.delete('/deleteExp/:exp_id', auth, async (req,res)=> { 
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const index = profile.experience.map(exp => exp.id).indexOf(req.params.exp_id);
        if(index!=-1) profile.experience.splice(index, 1);
        
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//@routes /profiles/deleteEdu/:edu_id
//@desc delete exp with the id
router.delete('/deleteEdu/:edu_id', auth, async (req,res)=> { 
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const index = profile.education.map(edu => edu.id).indexOf(req.params.edu_id);
        
        if(index!=-1) profile.education.splice(index, 1);
        
        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
