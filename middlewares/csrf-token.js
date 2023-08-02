const { generateToken } = require('../config/csrf');

function addCsrfToken(req, res, next) {
    res.locals.csrfToken = generateToken(res, req);
    next();    
}

module.exports = addCsrfToken;