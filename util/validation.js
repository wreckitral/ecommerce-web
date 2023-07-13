function isValueExist(value) {
    return value && value.trim() !== '';
}

function isUserCredentialsValid(email, password) {
    return (
        email && 
        email.includes('@') &&
        password && 
        password.trim().length > 5
    );
}

function isUserDetailsAreValid(email, password, fullname, street, postal, city) {
    return (
        isUserCredentialsValid(email, password) &&
        isValueExist(fullname) &&
        isValueExist(street) &&
        isValueExist(postal) &&
        isValueExist(city)
    );
}

function isEmailIsConfirmed(email, confirmEmail) {
    return email === confirmEmail;
}

module.exports = {
    isUserDetailsAreValid: isUserDetailsAreValid,
    isEmailIsConfirmed: isEmailIsConfirmed
}