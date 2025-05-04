module.exports = (request, response, next) => {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = cb => {
            cb();
        };
    }

    if (request.session && !request.session.save) {
        request.session.save = cb => {
            cb();
        };
    }

    next();
};
