const util = require('util');
// Define the formatting function
function formatMessage(level, ...args) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const formattedArgs = args.map(arg =>
        typeof arg === 'object' ? util.inspect(arg, { depth: 5, colors: true }) : arg
    );
    return `[${timestamp}] [${level}] ${formattedArgs.join(' ')}`;
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
const cors = require('cors');
const app = express();
const port = 3000;
const guildDatabase = require('./db/guildDatabase');
const authDatabase = require('./db/authDatabase');
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());

// Initialize Passport
// app.use(require('./middleware/passportFix'));
require('./auth/passport')(app);

// Load API
require('./routes/api')(app);
app.use(require('./routes'));
console.log('Loaded all routes');

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function closeAll() {
    guildDatabase.close();
    authDatabase.close();
}

app.on('error', error => {
    console.error('Server error:', error);
    closeAll();
});

app.on('close', () => {
    console.log('Server closing...');
    closeAll();
});
