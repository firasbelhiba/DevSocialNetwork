const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');




//@route GET api/profile/me
//@desc Get current users profile 
//@access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar']);


        // If there is no existing profile 
        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user ' });
        }

        // If there is a profile

        res.json(profile);


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 