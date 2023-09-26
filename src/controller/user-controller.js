import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
       const result = await userService.register(req.body);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const login = async (req, res, next) => {
    try {
       const { token, user } = await userService.login(req.body);
       res.status(200).json({
        token: token,
        isAccountExist: {...user},
       });
    } catch (e) {
        next(e);
    }
}

const keepLogin = async (req, res, next) => {
    try {
       const result = await userService.keepLogin(req);
       res.status(200).json({
        data: {...result}
       });
    } catch (e) {
        next(e);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
       const result = await userService.forgotPassword(req.body);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const resetPassword = async (req, res, next) => {
    try {
       const result = await userService.resetPassword(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const verifyAccount = async (req, res, next) => {
    try {
       const result = await userService.verifyAccount(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const changeUsername = async (req, res, next) => {
    try {
       const result = await userService.changeUsername(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const changeEmail = async (req, res, next) => {
    try {
       const result = await userService.changeEmail(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const changePass = async (req, res, next) => {
    try {
       const result = await userService.changePass(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const changePhone = async (req, res, next) => {
    try {
       const result = await userService.changePhone(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const changeProfilePicture = async (req, res, next) => {
    try {
       const result = await userService.changeProfilePicture(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

export default {
    register,
    login,
    keepLogin,
    forgotPassword,
    resetPassword,
    verifyAccount,
    changeEmail,
    changePhone,
    changePass,
    changeProfilePicture,
    changeUsername
}