const express = require('express');
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

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
        // I added the toString() otherwise it didn't work thanks to : https://github.com/bradtraversy/nodeauthapp/issues/7
        const salt = await bcrypt.genSalt(saltRounds);

        user.password = await bcrypt.hash(password.toString(), salt);

        await user.save();


        // Return the JWT using jsonwebtoken
        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });


        // res.send('User registered');

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }



});


module.exports = router; 