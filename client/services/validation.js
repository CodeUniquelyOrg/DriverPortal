/* eslint-disable */
const expressions = {
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
  email: /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
  ukMobile: /^(07\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
  mobile: /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
  number: /^\d+$/,
  day: /^(0[1-9]|[12][0-9]|3[01])$/,
  month: /^(0[1-9]|1[012])$/,
  year: /^(?:(?:18|19|20)[0-9]{2})$/,
  // will be internally held as ISO formatt YYYY-MM-DD
  dob: /^([0-9]{4}[-/]?((0[13-9]|1[012])[-/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-/]?31|02[-/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-/]?02[-/]?29)$/,
  allowedText: /a-zA-Z0-9 _.,?!:;'""'()&%#@\-\+]+/g,
};
/* eslint-enable */

export const required = (value) => {
  if (typeof value === 'undefined') {
    return false;
  } else if (typeof value === 'string' && value.trim().length === 0) {
    return false;
  }
  return true;
};

export const email = (value) => {
  return value && expressions.email.test(value);
};

export const mobile = (value) => {
  return value && expressions.mobile.test(value);
};

export const optionalText = (value) => {
  if (!value || value.trim().length === 0) {
    return true;
  }
  return expressions.allowedText.test(value);
};

export const length = (value, param) => {
  return value && value.length === param;
};

export const minLength = (value, param) => {
  return value && value.length >= param;
};

export const maxLength = (value, param) => {
  return !value || value.length <= param;
};

export const minValue = (value, param) => {
  return !value || (value && parseInt(value, 10) >= parseInt(param, 10));
};

export const maxValue = (value, param) => {
  return !value || (value && parseInt(value, 10) <= parseInt(param, 10));
};

export const minFloat = (value, param) => {
  return !value || (value && parseFloat(value, 10) >= parseFloat(param, 10));
};

export const maxFloat = (value, param) => {
  return !value || (value && parseFloat(value, 10) <= parseFloat(param, 10));
};

