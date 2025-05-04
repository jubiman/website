const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

class AuthDatabase {
    constructor() {
        if (AuthDatabase._instance) {
            return AuthDatabase._instance;
        }
        AuthDatabase._instance = this;

        this.db = new sqlite3.Database('auth.db'); // Create or open the user database
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users
                (
                    username        TEXT PRIMARY KEY,
                    password        TEXT NOT NULL,
                    role            TEXT NOT NULL
                )`);
            this.db.run(`
                CREATE TABLE IF NOT EXISTS tokens
                (
                    token       TEXT PRIMARY KEY,
                    username    TEXT NOT NULL,
                    expiresAt   DATETIME NOT NULL,
                    FOREIGN KEY (username) REFERENCES users (username)
                )`);
        });
    }

    // Password Management
    async storePassword(username, password) {
        return new Promise((resolve, reject) => {
            console.log("Storing password");
            this.db.run(
                'INSERT OR REPLACE INTO users (username, password) VALUES (?, ?)',
                [username, password],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
            console.log("Password stored");
        });
    }

    async verifyPassword(username, password) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT password FROM users WHERE username = ?',
                [username],
                async (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(false);
                    resolve(await bcrypt.compare(password, row.password));
                }
            );
        });
    }

    // Token Management
    async storeToken(token, username, expiresAt) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO tokens (token, username, expiresAt) VALUES (?, ?, ?)',
                [token, username, expiresAt],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    async getToken(token) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM tokens WHERE token = ?',
                [token],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }

    async invalidateToken(token) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM tokens WHERE token = ?',
                [token],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    async invalidateExpiredTokens() {
        return new Promise((resolve, reject) => {
            this.db.run(
                'DELETE FROM tokens WHERE expiresAt < ?',
                [new Date().toISOString()],
                (err) => {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }

    async getUserById(username) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE username = ?',
                [username],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = new AuthDatabase();
