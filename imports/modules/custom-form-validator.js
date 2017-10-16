import PropTypes from 'prop-types';

export default function customFormValidator(input, rules, messages) {
  function valString(field) {
    return (typeof field === 'string');
  }

  function valNumber(field) {
    return (typeof Number(field) === 'number' && !(isNaN(Number(field))));
  }

  function valBool(field) {
    return (typeof field === 'boolean');
  }

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

  function getField(inputField) {
    const correctField = inputField.split('.');
    // Only works to verify up to 2 levels deep
    if (correctField.length === 2) {
      return input[correctField[0]][correctField[1]];
    }
    if (correctField.length === 3) {
      return input[correctField[0]][correctField[1]][correctField[2]];
    }
    return input[correctField[0]];
  }

  const formErrors = {};

  Object.keys(rules).forEach((field) => {
    Object.keys(rules[field]).forEach((subrule) => {
      switch (subrule) {
        case 'required':
          if (!getField(field)) {
            formErrors[field] = messages[field].required;
          }
          break;
        case 'minLength':
          if (getField(field)) {
            (!valMinLength(getField(field), rules[field][subrule]))
            ? formErrors[field] = messages[field].minLength
            : null;
          }
          break;
        case 'maxLength':
          if (getField(field)) {
            (!valMaxLength(getField(field), rules[field][subrule]))
            ? formErrors[field] = messages[field].maxlength
            : null;
          }
          break;
        case 'minValue':
          if (getField(field)) {
            (!valMinValue(getField(field), rules[field][subrule]))
            ? formErrors[field] = messages[field].minValue
            : null;
          }
          break;
        case 'maxValue':
          if (getField(field)) {
            (!valMaxValue(getField(field), rules[field][subrule]))
            ? formErrors[field] = messages[field].maxValue
            : null;
          }
          break;
        case 'email':
          if (getField(field)) {
            (!valEmail(getField(field)))
            ? formErrors[field] = messages[field].email
            : null;
          }
          break;
        case 'password':
          if (getField(field)) {
            (!valPassword(getField(field)))
            ? formErrors[field] = messages[field].password
            : null;
          }
          break;
        case 'string':
          if (getField(field)) {
            (!valString(getField(field)))
            ? formErrors[field] = messages[field].string
            : null;
          }
          break;
        case 'bool':
          if (getField(field)) {
            (!valBool(getField(field)))
            ? formErrors[field] = messages[field].bool
            : null;
          }
          break;
        case 'number':
          if (getField(field)) {
            (!valNumber(getField(field)))
            ? formErrors[field] = messages[field].number
            : null;
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
