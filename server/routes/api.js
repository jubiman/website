const path = require('path');
const fs = require('fs');
const authCheck = require('../middleware/authCheck');
const permissionCheck = require('../middleware/permissionCheck');

module.exports = (app) => {
    const routesPath = path.join(__dirname, '../api/jubicord/v1');
    fs.readdirSync(routesPath).forEach(file => {
        const route = require(path.join(routesPath, file));
        const routeName = file.split('.')[0];
        app.use(`/api/jubicord/v1/${routeName}`, authCheck, permissionCheck('admin'), route);
        console.log(`Loaded route: /api/jubicord/v1/${routeName}`);
    });
}
