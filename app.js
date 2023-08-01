const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlingMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/auth-check');
const createSessionConfig = require('./config/session');
const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');
const baseRoutes = require('./routes/base-routes');
const doubleCsrfProtection = require('./config/csrf');
const adminRoutes = require('./routes/admin-routes');

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cookieParser('supersecretbanget'));

app.use(checkAuthStatusMiddleware);

app.use('/admin', adminRoutes);

app.use(doubleCsrfProtection);
app.use(addCsrfTokenMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

app.use(errorHandlingMiddleware);


db.connectToDatabase()
    .then(function () {
        app.listen(3000);
    })
    .catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });
