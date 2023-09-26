import blogService from "../service/blog-service.js";

const createBlog = async (req, res, next) => {
    try {
       const result = await blogService.createBlog(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const getBlogs = async (req, res, next) => {
    try {
       const result = await blogService.getBlogs(req);
       res.status(200).json({
        data: {...result}
       });
    } catch (e) {
        next(e);
    }
}

const getBlogsAuth = async (req, res, next) => {
    try {
       const result = await blogService.getBlogsAuth(req);
       res.status(200).json({
        data: {...result}
       });
    } catch (e) {
        next(e);
    }
}

const getBlogsByUser = async (req, res, next) => {
    try {
       const result = await blogService.getBlogsByUser(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const likeBlog = async (req, res, next) => {
    try {
       const result = await blogService.likeBlog(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const getMostFavBlogs = async (req, res, next) => {
    try {
       const result = await blogService.getMostFavBlogs(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const pagLike = async (req, res, next) => {
    try {
       const result = await blogService.pagLike(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const unlikeBlog = async (req, res, next) => {
    try {
       const result = await blogService.unlikeBlog(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

const removeBlog = async (req, res, next) => {
    try {
       const result = await blogService.removeBlog(req);
       res.status(200).json({
        data: result
       });
    } catch (e) {
        next(e);
    }
}

export default {
    createBlog,
    getBlogs,
    getBlogsAuth,
    getBlogsByUser,
    likeBlog,
    unlikeBlog,
    getMostFavBlogs,
    pagLike,
    removeBlog,
}