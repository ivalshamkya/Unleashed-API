import Joi from "joi";

const registerUserValidation = Joi.object({
    email: Joi.string().max(100).required(),
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    confirmPassword: Joi.string().max(100).required(),
    phone: Joi.string().max(20).required()
});

const loginUserValidation = Joi.object({
    email: Joi.string().max(100).allow('', null),
    username: Joi.string().max(100).allow('', null),
    phone: Joi.string().max(20).allow('', null),
    password: Joi.string().max(100).required(),
});

const forgotPasswordValidation = Joi.object({
    email: Joi.string().max(100).required()
});

const resetPasswordValidation = Joi.object({
    password: Joi.string().max(100).required(),
    confirmPassword: Joi.string().max(100).required(),
});

export {
    registerUserValidation,
    loginUserValidation,
    forgotPasswordValidation,
    resetPasswordValidation
}