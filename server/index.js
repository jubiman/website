// Define the formatting function
function formatMessage(level, ...args) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return `[${timestamp}] [${level}] ${args.join(' ')}`;
}

// Override console.log
const originalLog = console.log;
console.log = (...args) => {
    originalLog(formatMessage('LOG', ...args));
};

// Override console.debug
const originalDebug = console.debug;
console.debug = (...args) => {
    originalDebug(formatMessage('DEBUG', ...args));
};

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());

// Load all route files from the api/v1/ folder
const routesPath = path.join(__dirname, 'api/jubicord/v1');
fs.readdirSync(routesPath).forEach(file => {
    const route = require(path.join(routesPath, file));
    app.use('/api/jubicord/v1', route);
    console.log(`Loaded route: /api/jubicord/v1/${file}`);
});
console.log('Loaded all routes');

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.on('error', error => {
    console.error('Server error:', error);
    db.close();
});

app.on('close', () => {
    console.log('Server closing...');
    db.close();
});
