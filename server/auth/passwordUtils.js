const bcrypt = require('bcrypt');
const db = require('../db/authDatabase');
const saltRounds = 10;

async function validatePassword(user, candidatePassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
}

async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return reject(err);

            // Hash the password with the salt
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return reject(err);
                resolve(hash);
            });
        });
    });
}

async function storePassword(username, password) {
    const passwordHash = await hashPassword(password);
    console.log(passwordHash);
    return new Promise((resolve, reject) => {
        db.storePassword(username, passwordHash).then(() => {
            resolve();
        }).catch((err) => {
            console.error('Error storing password:', err);
            if (err.code === 11000) {
                reject(new Error('Invalid username or password'));
            }
            reject(err);
        })
    });
}

module.exports = {
    validatePassword,
    hashPassword,
    storePassword
}
