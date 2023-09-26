import { validate } from "../validation/validation.js";
import {
  forgotPasswordValidation,
  loginUserValidation,
  registerUserValidation,
  resetPasswordValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  sendChangeProfileEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../utils/emails.js";
import { logger } from "../application/logging.js";

const FE_URL = process.env.FE_URL;

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const isUsernameTaken = await prismaClient.user.findFirst({
    where: {
      username: user.username,
    },
  });

  const isEmailTaken = await prismaClient.user.findFirst({
    where: {
      email: user.email,
    },
  });

  const isPhoneNumberTaken = await prismaClient.user.findFirst({
    where: {
      phone: user.phone,
    },
  });

  if (isUsernameTaken) {
    throw new ResponseError(400, "Username already taken");
  }

  if (isEmailTaken) {
    throw new ResponseError(400, "Email already registered");
  }

  if (isPhoneNumberTaken) {
    throw new ResponseError(400, "Phone number already registered");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const tokenPayload = {
    username: user.username,
    email: user.email,
    phone: user.phone,
  };

  const verificationToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const verificationUrl = `${FE_URL}/verification/${verificationToken}`;

  user.token = verificationToken;

  await prismaClient.user.create({
    data: {
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password,
    },
  });

  await sendVerificationEmail(user.email, verificationUrl);

  return {
    message: "A verification link has been sent to your email account",
  };
};

const login = async (request) => {
  const { email, phone, username, password } = validate(
    loginUserValidation,
    request
  );

  const user = await prismaClient.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          phone: phone,
        },
        {
          username: username,
        },
      ],
    },
  });

  if (!user) {
    throw new ResponseError(404, "Username or Password wrong");
  }

  if (user.isVerified == 0) {
    throw new ResponseError(400, "Account not verified");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid password");
  }

  const tokenPayload = {
    username: user.username,
    email: user.email,
    phone: user.phone,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token: token,
    user: user,
  };
};

const keepLogin = async (request) => {
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;
  return prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });
};

const forgotPassword = async (request) => {
  const { email } = validate(forgotPasswordValidation, request);
  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(
      400,
      "The email address is incorrect or the account doesn`t exists "
    );
  }

  const verificationUrl = `${FE_URL}/reset-password/${user.token}`;

  await sendResetPasswordEmail(user.email, verificationUrl);

  return {
    message: "A reset password link has been sent to your email account",
  };
};

const resetPassword = async (request) => {
  const data = validate(resetPasswordValidation, request.body);
  const { token } = request.query;

  if (data.password !== data.confirmPassword) {
    throw new ResponseError(400, "Password doesn't match!");
  }

  const user = await prismaClient.user.findFirst({
    where: {
      token: token,
    },
  });

  data.password = await bcrypt.hash(data.password, 10);

  return prismaClient.user.update({
    data: data,
    where: {
      id: user.id,
    },
  });
};

const verifyAccount = async (request) => {
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User not found");
  }

  return prismaClient.user.update({
    data: {
      isVerified: 1,
    },
    where: {
      id: user.id,
    },
  });
};

const changeUsername = async (request) => {
  const { newUsername } = request.body;
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const result = await prismaClient.user.update({
    data: {
      username: newUsername,
    },
    where: {
      id: user.id,
    },
  });

  await sendChangeProfileEmail(user.email, "Username");

  return result;
};

const changeEmail = async (request) => {
  const { newEmail } = request.body;
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const result = await prismaClient.user.update({
    data: {
      email: newEmail,
    },
    where: {
      id: user.id,
    },
  });

  await sendChangeProfileEmail(user.email, "Email");

  return result;
};

const changePass = async (request) => {
  const { currentPassword, password, confirmPassword } = request.body;

  const token = request.headers["authorization"].split(" ")[1];

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(400, "Pengguna tidak ditemukan.");
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new ResponseError(400, "Password saat ini tidak valid.");
  }

  if (password !== confirmPassword) {
    throw new ResponseError(400, "Konfirmasi password tidak cocok.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  const result = {
    success: true,
    message: "Password berhasil diubah.",
    data: {
      user: updatedUser,
    },
  };

  await sendChangeProfileEmail(user.email, "Password");

  return result;
};

const changePhone = async (request) => {
  const { newPhone } = request.body;
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const result = await prismaClient.user.update({
    data: {
      phone: newPhone,
    },
    where: {
      id: user.id,
    },
  });

  await sendChangeProfileEmail(user.email, "Phone Number");

  return result;
};

const changeProfilePicture = async (request) => {
  const newFilename = request.file.filename;
  const token = request.headers["authorization"].split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const email = decodedToken.email;

  const user = await prismaClient.user.findFirst({
    where: {
      email: email,
    },
  });

  const result = await prismaClient.user.update({
    data: {
      imgProfile: newFilename,
    },
    where: {
      id: user.id,
    },
  });

  await sendChangeProfileEmail(user.email, "Profile Picture");

  return result;
};

export default {
  register,
  login,
  keepLogin,
  forgotPassword,
  resetPassword,
  verifyAccount,
  changeUsername,
  changeEmail,
  changePass,
  changePhone,
  changeProfilePicture,
};
