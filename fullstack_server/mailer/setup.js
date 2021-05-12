const nodemailer = require('nodemailer');
const env = require('../config/config');
const { verificationEmailTemplate } = require('./templates/verificationEmail');

// Create a connection to your gmail account
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.email, // generated ethereal user
    pass: env.email_pass, // generated ethereal password
  },
});

exports.sendVerificationEmail = async (user) => {
  // Setup your email options
  const mailOptions = {
    from: env.email,
    to: user.email,
    subject: 'Account Verification - WHATEVER TODO CORP',
    // text: `Heyyyyy ${user.firstName}`,
    html: verificationEmailTemplate(user),
  };

  try {
    // Shoot the email
    await transporter.sendMail(mailOptions);
    console.log(`Send verification email to user ${user.fullName}`);
  } catch (error) {
    console.log(error);
  }
};
