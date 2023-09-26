import express from "express";
import userController from "../controller/user-controller.js";
import blogController from "../controller/blog-controller.js";
import categoryController from "../controller/category-controller.js";
import { uploadBlogImage, uploadSingle } from "../utils/upload.js";

const publicRouter = new express.Router();

// Users Routes
publicRouter.post("/api/auth", userController.register);
publicRouter.post("/api/auth/login", userController.login);
publicRouter.get("/api/auth", userController.keepLogin);
publicRouter.put("/api/auth/forgotPass", userController.forgotPassword);
publicRouter.patch("/api/auth/resetPass", userController.resetPassword);
publicRouter.patch("/api/auth/verify", userController.verifyAccount);
publicRouter.patch("/api/auth/changeUsername", userController.changeUsername);
publicRouter.patch("/api/auth/changePass", userController.changePass);
publicRouter.patch("/api/auth/changeEmail", userController.changeEmail);
publicRouter.patch("/api/auth/changePhone", userController.changePhone);
publicRouter.post(
  "/api/profile/single-uploaded",
  uploadSingle.single("file"),
  userController.changeProfilePicture
);

// Blog Routes
publicRouter.post(
  "/api/blog",
  uploadBlogImage.single("file"),
  blogController.createBlog
);
publicRouter.get("/api/blog", blogController.getBlogs);
publicRouter.get("/api/blog/auth", blogController.getBlogsByUser);
publicRouter.post("/api/blog/like", blogController.likeBlog);
publicRouter.get("/api/blog/pagFav", blogController.getMostFavBlogs);
publicRouter.get("/api/blog/pagLike", blogController.pagLike);
publicRouter.delete("/api/blog/unlike/:userId", blogController.unlikeBlog);
publicRouter.patch("/api/blog/remove/:id", blogController.removeBlog);

// Category
publicRouter.get("/api/blog/allCategory", categoryController.getAllCategory);


export { publicRouter };
