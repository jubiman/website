// This middleware must not be called before authCheck
function HasRole(role) {
    return HasRole[role] || (HasRole[role] = function(req, res, next) {
        if (role !== req.user.role) {
            console.log(`User ${req.user.username} does not have the required role: ${role}`);
            return res.status(403).json({error: 'Forbidden'});
        }
        else next();
    })
}

module.exports = HasRole;
