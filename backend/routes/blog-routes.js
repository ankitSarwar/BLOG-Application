import express from 'express';
import { addBlog, deleteById, getAllBlogs, getById, getByUserId, updateBlog } from '../controllers/blog-controllers.js';

const blogRouter = express.Router();

blogRouter.get("/",getAllBlogs);
blogRouter.post("/add",addBlog);
blogRouter.put("/update/:id",updateBlog);
blogRouter.get("/:id",getById);
blogRouter.delete("/:id",deleteById);
blogRouter.get("/user/:id",getByUserId);

export default blogRouter;

