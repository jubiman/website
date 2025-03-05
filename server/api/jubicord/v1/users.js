const express = require('express');
const router = express.Router();
const db = require('../../../db/database');

// Get users
router.get('/', async (req, res) => {
    const users = await db.getUsers();
    let resp = {
        status: 200,
        users
    }
    res.json(resp);
});

// Create user
router.post('/create', async (req, res) => {
    const {userId, username, avatarUrl} = req.body;
    let resp = {
        status: 200,
    }
    db.createUser(userId, username, avatarUrl).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.status = 500;
        resp.error = err;
    }).then(() => {
        res.json(resp);
    });
});

// Update user
router.post('/:userId', async (req, res) => {
    const {userId} = req.params;
    const {username, avatarUrl} = req.body;
    let resp = {
        status: 200,
    }
    db.updateUser(userId, username, avatarUrl).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.status = 500;
        resp.error = err;
    }).then(() => {
        res.json(resp);
    });
});

// Delete user
router.delete('/:userId', async (req, res) => {
    const {userId} = req.params;
    let resp = {
        status: 200,
    }
    db.deleteUser(userId).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.status = 500;
        resp.error = err;
    }).then(() => {
        res.json(resp);
    });
});

// Get user
router.get('/:userId', async (req, res) => {
    const {userId} = req.params;
    const user = await db.getUser(userId);
    let resp = {
        status: 200,
        user
    }
    res.json(resp);
});


router.use((req, res) => {
    res.status(404).json({
        status: 404,
        error: {
            message: `Endpoint not found: ${req.method} ${req.originalUrl}`
        }
    });
});

module.exports = router;