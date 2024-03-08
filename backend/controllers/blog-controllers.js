import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find().populate("user");
  } catch (error) {
    return console.log(error);
  }

  if (!blogs || blogs.length === 0) {
    return res.status(404).json({ message: "No Blogs Found" });
  }
  return res.status(200).json({ blogs });
};

export const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find User By This ID" });
  }
  const blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    // await blog.save();
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save();
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
  return res.status(200).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { title, description } = req.body;
  const blogId = req.params.id; // Use req.params.id to get the blog ID

  try {
    const blog = await Blog.findByIdAndUpdate(blogId, {
      title,
      description,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getById = async (req, res, next) => {
    const id = req.params.id;

    // Check if the provided ID is "search" for search functionality
    if (id === 'search') {
        return searchBlogs(req, res); // Call the searchBlogs function for search
    }

    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!blog) {
        return res.status(404).json({ message: "No Blog Found" });
    }

    return res.status(200).json({ blog });
};



export const deleteById = async (req, res, next) => {
  const id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "Successfully deleted" });
};

export const getByUserId = async (req, res, next) => {
  const userId = req.params.id;
  let userBlogs;
  try {
    userBlogs = await User.findById(userId).populate("blogs");
  } catch (error) {
    return console.log(error);
  }
  if (!userBlogs) {
    return res.status(404).json({ message: "No bLogs Found" });
  }
  return res.status(200).json({ user: userBlogs });
};



export const searchBlogs = async (req, res) => {
  const { query } = req.query;

  try {
    const results = await Blog.find({
      title: { $regex: new RegExp(query, "i") },
    });

    res.json(results);
  } catch (error) {
    console.error("Error searching blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
