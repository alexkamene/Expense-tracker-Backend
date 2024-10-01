const router = require('express').Router();
const User = require('../Models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a user
router.post('/Register', async (req, res) => {
    const newuser = new User({
        username: req.body.username,
        password: req.body.password,
    });

    // Check if the user already exists
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        newuser.password = hashedPassword;
        await newuser.save();
        return res.status(200).send("User has been registered"); // Use return to exit

    } catch (error) {
        return res.status(404).send("Error registering user"); // Use return to exit
    }
});

// Login a user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(401).send("Invalid username"); // Return early
        }

        // Validate password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(402).send("Wrong password"); // Return early
        }

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY,{expiresIn:'1h'});

        

        return res.status(200).send({ token,userId: user._id , username: user.username}); // Send token as response
    } catch (error) {
        // console.error(error); // Log the error for debugging
        return res.status(500).send("Server error"); // Return a server error response
    }
});

module.exports = router;
