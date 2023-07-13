const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessiondata(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        };
    }

    res.render('customer/auth/signup', {inputData: sessionData});
}

async function setSignup(req, res, next) {

    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city
    }

    if (!validation.isUserDetailsAreValid(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal, req.body.city) || !validation.isEmailIsConfirmed(req.body.email, req.body['confirm-email'])) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input, Password minimum 6 characters long.',
            ...enteredData
        }, function () {
            res.redirect('/signup');
        })
        return;
    }

    const user = new User(req.body.email, req.body.password, req.body.fullname, req.body.street, req.body.postal, req.body.city);

    try {
        const existAlready = await user.isUserExistAlready();

        if (existAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'Email already used.',
                ...enteredData
            }, function () {
                res.redirect('/signup');
            })
            return;
        }

        await user.signup();
    } catch (error) {
        return next(error);
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessiondata(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    }

    res.render('customer/auth/login', {inputData: sessionData});
}

async function setLogin(req, res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        return next(error);
    }

    const sessionErrorData = {
        errorMessage: 'Invalid credentials, please check your email and password!',
        email: user.email,
        password: user.password
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        });
        return;
    }

    const isPasswordCorrect = await user.isPasswordsMatch(existingUser.password);

    if (!isPasswordCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect('/login');
        });
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    setSignup: setSignup,
    setLogin: setLogin,
    logout: logout
}