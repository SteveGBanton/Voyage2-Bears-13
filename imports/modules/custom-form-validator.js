
export default function customFormValidator(input, rules, messages) {
  function valMaxLength(string, length) {
    return string.length <= Number(length);
  }

  function valMinLength(string, length) {
    return string.length >= Number(length);
  }

  function valMinValue(number, min) {
    return Number(number) >= Number(min);
  }

  function valMaxValue(number, max) {
    return Number(number) <= Number(max);
  }

  function valEmail(email) {
    if (email !== '') {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    return true;
  }

  function valPassword(pass) {
    if (pass !== '') {
      const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{9,}$/;
      return re.test(pass);
    }
    return true;
  }

  const formErrors = {};

  Object.keys(rules).forEach((field) => {
    Object.keys(rules[field]).forEach((subrule) => {
      switch (subrule) {
        case 'required':
          if (!input[field]) {
            formErrors[field] = messages[field].required;
          }
          break;
        case 'minLength':
          if (input[field]) {
            if (!valMinLength(input[field], rules[field][subrule])) {
              formErrors[field] = messages[field].minLength;
            }
          }
          break;
        case 'maxLength':
          if (input[field]) {
            if (!valMaxLength(input[field], rules[field][subrule])) {
              formErrors[field] = messages[field].maxlength;
            }
          }
          break;
        case 'minValue':
          if (input[field]) {
            if (!valMinValue(input[field], rules[field][subrule])) {
              formErrors[field] = messages[field].minValue;
            }
          }
          break;
        case 'maxValue':
          if (input[field]) {
            if (!valMaxValue(input[field], rules[field][subrule])) {
              formErrors[field] = messages[field].maxValue;
            }
          }
          break;
        case 'email':
          if (input[field]) {
            if (!valEmail(input[field])) {
              formErrors[field] = messages[field].email;
            }
          }
          break;
        case 'password':
          if (input[field]) {
            if (!valPassword(input[field])) {
              formErrors[field] = messages[field].password;
            }
          }
          break;
        default:
          break;
      }
    });
  });

  // return false if no errors returned, return formError object if errors present
  if (
    Object.keys(formErrors).length === 0
    && formErrors.constructor === Object
  ) {
    return false;
  }

  return formErrors;
}
