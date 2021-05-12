const env = require('../../config/config');

exports.verificationEmailTemplate = (user) => {
  return `<h4>Welcome to the Whatever Todo Corporation</h4>
    <p>Please verify you account using the following lonk link</p>
    <a target="_blank" href="${env.frontendOrigin}/users/verify/${user.emailVerificationToken}">${env.frontendOrigin}/users/verify/${user.emailVerificationToken}</a>`;
};
