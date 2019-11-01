const validator = require("validator");
const isEmpty = require("is-empty");

const validateLoginInput = data => {
  let errors = {};

  let { email, password } = data;
  // Convert empty fields to an empty string so we can use validator functions
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  // Checking the fields
  if (validator.isEmpty(email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (validator.isEmpty(password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateLoginInput;
