const express = require('express');
const router = express.Router();
const db = require('../../../db/guildDatabase');

// Get guilds
router.get('/', async (req, res) => {
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
router.get('/:guildId', async (req, res) => {
    const {guildId} = req.params;
    const guildConfig = await db.getGuildConfig(guildId);
    let resp = {
        guildId,
        guildName: guildConfig.guildName,
        iconUrl: guildConfig.iconUrl,
        channelId: guildConfig.channelId,
        identifier: guildConfig.identifier
    }
    res.json(resp);
});

// Create guild
router.post('/create', async (req, res) => {
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
router.post('/:guildId/', async (req, res) => {
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
router.get('/:guildId/superusers', async (req, res) => {
    const {guildId} = req.params;
    const { full } = req.query;
    try {
        let superusers = await db.getSuperusers(guildId);
        if (full) {
            superusers = await Promise.all(superusers.map(async superuser => {
                const user = await db.getUser(superuser.userId);
                return {
                    ...superuser,
                    username: user.username,
                    avatarUrl: user.avatarUrl
                };
            }));
        }
        res.json({ status: 200, superusers });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Get guild members
router.get('/:guildId/members', async (req, res) => {
    const {guildId} = req.params;
    const { full } = req.query;
    try {
        let members = await db.getGuildMembers(guildId);
        if (full) {
            members = await Promise.all(members.map(async member => {
                const user = await db.getUser(member.userId);
                return {
                    ...member,
                    username: user.username,
                    avatarUrl: user.avatarUrl
                };
            }));
        }
        res.json({ status: 200, members });
    } catch (err) {
        res.status(500).json({ status: 500, error: err.message });
    }
});

// Add superuser
router.post('/:guildId/superusers/', (req, res) => {
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
router.get('/:guildId/superusers/:userId', (req, res) => {
    const {guildId, userId} = req.params;
    db.isSuperuser(guildId, userId).then(isSuperuser => {
        let resp = {
            status: 200,
            isSuperuser
        }
        res.json(resp);
    });
});

// Get guild members
router.get('/:guildId/members', (req, res) => {
    const {guildId} = req.params;
    const { full } = req.query;
    db.getGuildMembers(guildId).then(members => {
        let resp = {
            status: 200,
            members
        }
        if (full) {
            // Fetch full user objects, including usernames and avatars
            members.forEach(member => {
                db.getUser(member.userId).then(user => {
                    member.username = user.username;
                    member.avatarUrl = user.avatarUrl;
                });
            });
        }
        res.json(resp);
    });
});

// Add guild members
router.post('/:guildId/members', (req, res) => {
    const {guildId} = req.params;
    const {members} = req.body;
    let resp = {
        status: 200
    }
    db.addGuildMembers(guildId, members).then(count => {
        resp.count = count;
        resp.error = null;
    }).catch(err => {
        resp.error = err;
        resp.status = 500;
    }).then(() => {
        res.json(resp);
    });
});

// Remove guild members
router.delete('/:guildId/members', (req, res) => {
    const {guildId} = req.params;
    const {members} = req.body;
    let resp = {
        status: 200
    }
    db.removeGuildMembers(guildId, members).then(() => {
        resp.error = null;
    }).catch(err => {
        resp.error = err;
        resp.status = 500;
    }).then(() => {
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
