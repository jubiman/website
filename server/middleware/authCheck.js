module.exports = (req, res, next) => {
    // TODO: support bearer tokens for API access
    if (req.isAuthenticated()) {
        return next();
    } else {
        // The client should redirect to the login page, unneeded for API
        return res.status(401).json({error: 'Unauthorized'});
    }
}
