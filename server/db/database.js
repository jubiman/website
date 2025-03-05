const e = require("express");
require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        if (Database._instance) {
            return Database._instance;
        }
        Database._instance = this;
        
        this.db = new sqlite3.Database('config.db'); // Create or open the database
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS guild
                (
                    guildId     TEXT PRIMARY KEY,
                    guildName   TEXT,
                    iconUrl     TEXT, -- this can be gotten by https://cdn.discordapp.com/icons/{guildId}/{iconUrl}.png
                    channelId   TEXT,
                    identifier  TEXT
                )`);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS superusers
                (
                    guildId     TEXT NOT NULL,
                    userId      TEXT NOT NULL,
                    PRIMARY KEY (guildId, userId),
                    FOREIGN KEY (guildId) REFERENCES guild (guildId),
                    FOREIGN KEY (userId) REFERENCES users (userId)
                )`);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users
                (
                    userId          TEXT PRIMARY KEY,
                    username        TEXT,
                    avatarUrl       TEXT -- this can be gotten by https://cdn.discordapp.com/avatars/{userId}/{avatarUrl}.png
                )`);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS guildMembers
                (
                    userId          TEXT NOT NULL,
                    guildId         TEXT NOT NULL,
                    PRIMARY KEY (guildId, userId),
                    FOREIGN KEY (guildId) REFERENCES guild (guildId),
                    FOREIGN KEY (userId) REFERENCES users (userId)
                )`);
        });
    }
    
    async getChannelId(guildId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT channelId FROM guild WHERE guildId = ?', [guildId], (err, row) => {
                if (err) reject(err);
                resolve(row ? row.channelId : null);
            });
        });
    }
    
    async createGuild(guildId, guildName, iconUrl) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO guild (guildId, guildName, iconUrl) VALUES (?, ?, ?)', [guildId, guildName, iconUrl], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    
    async getGuilds() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM guild', (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }
    
    async getGuildConfig(guildId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM guild WHERE guildId = ?', [guildId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    async setChannelId(guildId, channelId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE guild SET channelId = ? WHERE guildId = ?', [channelId, guildId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async getIdentifier(guildId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT identifier FROM guild WHERE guildId = ?', [guildId], (err, row) => {
                if (err) reject(err);
                resolve(row ? row.id : null);
            });
        });
    }

    async addIdentifier(guildId, id) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE guild SET identifier = ? WHERE guildId = ?', [id, guildId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async removeIdentifier(guildId) {
        return new Promise((resolve, reject) => {
            this.db.run('UPDATE guild SET identifier = NULL WHERE guildId = ?', [guildId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async isSuperuser(guildId, userId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT 1 FROM superusers WHERE guildId = ? AND userId = ?', [guildId, userId], (err, row) => {
                if (err) reject(err);
                resolve(!!row);
            });
        });
    }

    async addSuperuser(guildId, userId) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO superusers (guildId, userId) VALUES (?, ?)', [guildId, userId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async removeSuperuser(guildId, userId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM superusers WHERE guildId = ? AND userId = ?', [guildId, userId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    
    async getSuperusers(guildId) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT userId FROM superusers WHERE guildId = ?', [guildId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    async getGuildMembers(guildId) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT userId FROM guildMembers WHERE guildId = ?', [guildId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    async addGuildMembers(guildId, members) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare('INSERT INTO guildMembers (guildId, userId) VALUES (?, ?)');
            let count = 0;
            this.db.parallelize(() => {
                members.forEach(member => {
                    stmt.run(guildId, member, (err) => {
                        if (err) reject(err);
                        else count++;
                    });
                });
            });
            stmt.finalize((err) => {
                if (err) reject(err);
                resolve(count);
            });
        });
    }

    async removeGuildMembers(guildId, members) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare('DELETE FROM guildMembers WHERE guildId = ? AND userId = ?');
            this.db.parallelize(() => {
                members.forEach(member => {
                    stmt.run(guildId, member);
                });
            });
            stmt.finalize((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async createUser(userId, username, avatarUrl) {
        return new Promise((resolve, reject) => {
            this.db.run('INSERT INTO users (userId, username, avatarUrl) VALUES (?, ?, ?)', [userId, username, avatarUrl], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async updateUser(userId, username, avatarUrl) {
        return new Promise((resolve, reject) => {
            const fields = [];
            const values = [];

            if (username !== undefined) {
                fields.push('username = ?');
                values.push(username);
            }

            if (avatarUrl !== undefined) {
                fields.push('avatarUrl = ?');
                values.push(avatarUrl);
            }

            if (fields.length === 0) {
                return resolve(); // No fields to update
            }

            values.push(userId);
            const sql = `UPDATE users SET ${fields.join(', ')} WHERE userId = ?`;

            this.db.run(sql, values, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async deleteUser(userId) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM users WHERE userId = ?', [userId], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    async getUser(userId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE userId = ?', [userId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    async getUsers() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM users', (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        this.db.close();
    }

    run(sql, params, callback) {
        this.db.run(sql, params, callback);
    }

    get(sql, params, callback) {
        this.db.get(sql, params, callback);
    }
}

module.exports = new Database();