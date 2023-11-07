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
const { doubleCsrfProtection } = require('./config/csrf');
const adminRoutes = require('./routes/admin-routes');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const cartRoutes = require('./routes/cart-routes');
const ordersRoutes = require('./routes/orders-routes');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');

const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cookieParser('supersecretbanget'));

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use('/cart', doubleCsrfProtection, cartRoutes);

app.use(checkAuthStatusMiddleware);

app.use('/admin', addCsrfTokenMiddleware, protectRoutesMiddleware, adminRoutes);

app.use(doubleCsrfProtection);
app.use(addCsrfTokenMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlingMiddleware);

db.connectToDatabase()
    .then(function () {
        app.listen(3000);
    })
    .catch(function (error) {
        console.log('Failed to connect to the database!');
        console.log(error);
    });
