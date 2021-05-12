// generate me some custom error
const customError = (msg, status = 400) => {
  let error = new Error(msg);
  error.status = status;
  return error;
};

// I am exporting only customError because
// module.exports = ()  => {...customError}
module.exports = customError;
