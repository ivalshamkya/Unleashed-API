import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({  
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendVerificationEmail = async (recipient, verificationUrl) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: recipient,
    subject: "Email Verification",
    html: `
      <p>Please click the button below to verify your account.</p>
      <a href="${verificationUrl}">
        <button style="background-color: #2b52ff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;">
          Verify Email
        </button>
      </a>
      <p>If you didn't ask to verify this address, you can ignore this email.</p>
      <p>Thanks.</p>

    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendResetPasswordEmail = async (recipient, resetPassUrl) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: recipient,
    subject: "Reset Password",
    html: `
      <p>We've received a request to reset the password for this user account.</p>
      <a href="${resetPassUrl}">
        <button style="background-color: #2b52ff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;">
          Reset Password
        </button>
      </a>
      <p>If you didn't ask to reset your password, you can ignore this email.</p>
      <p>Thanks.</p>

    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendChangeProfileEmail = async (recipient, data) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: recipient,
    subject: `${data} Change`,
    text: `Your ${data} has changed\n\nIf you didn't ask to reset your password, you can ignore this email.\n\nThanks.`,
  };

  await transporter.sendMail(mailOptions);
};