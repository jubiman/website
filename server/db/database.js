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
                    iconUrl     TEXT,
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
                    avatarUrl       TEXT
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
            this.db.run('INSERT OR IGNORE INTO guild (guildId, guildName, iconUrl) VALUES (?, ?, ?)', [guildId, guildName, iconUrl], (err) => {
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

    async removeIdentifier(guildId, id) {
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
                resolve(rows.map(row => row.userId));
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