const { doubleCsrf } = require("csrf-csrf");

const {
    doubleCsrfProtection,
    generateToken // This is the default CSRF protection middleware.
} = doubleCsrf({
    getSecret: () => 'i4GTf}U_Oyy;1700#5l?_V"NAZoT}(=`*B5{~HIRG@9e&o?S,b*v"/qxQ^cK;K<', // A function that optionally takes the request and returns a secret
    cookieName: 'x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
    cookieOptions: {
        secure: false,
        maxAge: 172800,
    },
    getTokenFromRequest: (req) =>  req.body['csrfToken']
});


module.exports = {
    doubleCsrfProtection: doubleCsrfProtection,
    generateToken: generateToken    
}