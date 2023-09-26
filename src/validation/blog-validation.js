import Joi from "joi";

const createBlogValidation = Joi.object({
    title: Joi.string().max(150).required(),
    content: Joi.string().max(500).required(),
    country: Joi.string().max(20).required(),
    url: Joi.string().required(),
    keywords: Joi.string().max(20).required(),
    categoryID: Joi.number().required(),
    authorID: Joi.number().required(),
});

export {
    createBlogValidation
}