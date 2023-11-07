const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
    const mongoDBStore = mongoDbStore(expressSession);

    const store = new mongoDBStore({
        uri: 'mongodb://127.0.0.1:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}


function createSessionConfig() {
    return {
        secret: 'fruitypplforpresident2024!#%slay',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore()
    };
}

module.exports = createSessionConfig;


