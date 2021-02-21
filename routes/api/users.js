const express = require('express');
const { check, validationResult } = require('express-validator/check');
const User = require('../../models/User');
const gravatar = require('gravatar');

const router = express.Router();


// //@route GET api/users
// //@desc Test route 
// //@access Public
// router.get('/', (req, res) => res.send('User route'));


//@route POST api/users
//@desc Test route 
//@access Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a calid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters ').isLength({
        min: 6
    })
], async (req, res) => {
    //console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {

        // See if user  exists 
        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({ errors: [{ message: 'User already exists' }] });
        }

        // Get users gravatar 
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        // This doesn't create the user it just create an inctance of it (we have to implement the .save();)
        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt password using bcrypt 


        // Return the JWT using jsonwebtoken

        res.send('User route');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }



});


module.exports = router; 