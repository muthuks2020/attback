const validator = require('validator')
const isEmpty = require('is-empty')


const validateRegistrationInput = (data) => {
    let errors = {}

    let {
        name,
        email,
        password,
        password2
    } = data;
    // Convert empty fields to an empty string so we can use validator functions
    name = !isEmpty(name) ? name : "";
    email = !isEmpty(email) ? email : "";
    password = !isEmpty(password) ? password : "";
    password2 = !isEmpty(password2) ? password2 : "";

    // Checking the fields
    if (validator.isEmpty(name)) {
        errors.name = "Name field is required"
    }

    if (validator.isEmpty(email)) {
        errors.email = "Email field is required"
    } else if(!validator.isEmail(email)){
        errors.email = "Email is invalid";
    }

    if (validator.isEmpty(password)) {
        errors.password = "Password field is required"
    } else if (!validator.isLength(password, { min: 6, max: 30 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (validator.isEmpty(password2)) {
        errors.password2 = "Confirm password field is required"
    } else if (!validator.equals(password, password2)) {
        errors.password2 = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = validateRegistrationInput