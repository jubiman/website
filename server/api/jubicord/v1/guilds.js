const express = require('express');
const router = express.Router();
const db = require('../../../db/database');

// Get guilds
router.get('/guilds', async (req, res) => {
    let guilds = await db.getGuilds();
    
    // Filter by identifier if provided
    const {identifier} = req.query;
    if (identifier) {
        guilds = guilds.filter(guild => guild.identifier === identifier);
    }
    
    let resp = {
        guilds
    }
    res.json(resp);
});

// Get guild config
router.get('/guilds/:guildId', async (req, res) => {
    const {guildId} = req.params;
    const guildConfig = await db.getGuildConfig(guildId);
    let resp = {
        channelId: guildConfig.channelId,
        identifier: guildConfig.identifier
    }
    res.json(resp);
});

// Create guild
router.post('/guilds/create', async (req, res) => {
    const {guildId, guildName, iconUrl} = req.body;
    let resp = {
        guildId: guildId,
        guildName: guildName,
        iconUrl: iconUrl
    }
    db.createGuild(guildId, guildName, iconUrl).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.error = err;
    }).then(() => {
        res.json(resp);
    });
});

// Set guild config
router.post('/guilds/:guildId/', async (req, res) => {
    const {guildId} = req.params;
    const {channelId, identifier} = req.body;
    let resp = {
        status: 200,
        channelId: {
            error: "Not provided"
        },
        identifier: {
            error: "Not provided"
        }
    }
    if (channelId) {
        try {
            await db.setChannelId(guildId, channelId);
            resp.channelId = {
                channelId
            };
        } catch (err) {
            resp.channelId = {
                error: err
            };
            resp.status = 500;
        }
    }
    if (identifier) {
        try {
            await db.addIdentifier(guildId, identifier);
            resp.identifier = {
                identifier
            };
        } catch (err) {
            resp.identifier = {
                error: err
            };
            resp.status = 500;
        }
    }
    if (!channelId && !identifier) {
        resp.error = {
            message: "No channelId or identifier provided",
        }
        resp.status = 400;
    }
    if (resp.status !== 200) {
        resp.error = {
            message: "Error setting channelId or identifier",
        }
    }
    res.json(resp);
});

// Get superusers
router.get('/guilds/:guildId/superusers', (req, res) => {
    const {guildId} = req.params;
    db.getSuperusers(guildId).then(superusers => {
        let resp = {
            status: 200,
            superusers
        }
        res.json(resp);
    });
});

// Add superuser
router.post('/guilds/:guildId/superusers/', (req, res) => {
    const {guildId} = req.params;
    const {userId} = req.body;
    let resp = {
        status: 200
    }
    db.addSuperuser(guildId, userId).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.error = err;
        resp.status = 500;
    }).then(() => {
        res.json(resp);
    });
});

// isSuperuser
router.get('/guilds/:guildId/superusers/:userId', (req, res) => {
    const {guildId, userId} = req.params;
    db.isSuperuser(guildId, userId).then(isSuperuser => {
        let resp = {
            status: 200,
            isSuperuser
        }
        res.json(resp);
    });
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