const express = require('express');
const passport = require('passport');
const passwordUtils = require('../auth/passwordUtils');
const db = require('../db/authDatabase');
const router = express.Router();

router.post(
    '/login',
    function (req, res, next) {
        passport.authenticate(
            'local',
            {
                session: true,
            },
            function (err, user) {
                if (err) {
                    console.error('Error during authentication:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                if (!user) {
                    console.log('Invalid username or password');
                    return res.status(401).json({ error: 'Invalid username or password' });
                }
                req.logIn(user, function (err) {
                    if (err) {
                        console.error('Error during login:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    console.log('User logged in successfully');
                    return res.status(200).json({ message: 'Logged in successfully' });
                });
            }
        )(req, res, next);

    }
);

router.get('/logout', (req, res) => {
    let status = 200;
    let error = null;
    let message = 'Logged out successfully';
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
            status = 500;
            error = 'Logout failed';
            message = 'Internal server error';
        }
    });
    console.log(`User logged out successfully`);

    res.status(status).json({ error, message });
})

router.post('/register', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        console.log('Invalid username or password');
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if the username already exists
    db.getUserByUsername(username).then((user) => {
        if (user) {
            console.log('Username already exists');
            return res.status(400).json({ error: 'Username already exists' });
        }

        passwordUtils.storePassword(username, password).then(() => {
            console.log('Password stored successfully');
            res.status(201).json({ message: 'User registered successfully' });
        }).catch((err) => {
            console.error('Error registering user:', err);
            next(err);
        })
    }).catch((err) => {
        console.error('Error checking username:', err);
        return res.status(500).json({ error: 'Internal server error' });
    });
})

module.exports = router;
