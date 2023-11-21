import mongoose from "mongoose"
import Blog from "../model/Blog.js"
import User from "../model/user.js"

export const getAllBlogs = async (req, res, next) => {
    let blogs
    try {
        blogs = await Blog.find()
    } catch (err) {
        return console.log(err);
    }
    if (!blogs) {
        return res
            .status(404)
            .json({message: "Blog doesn't found"});
    }
    return res
        .status(200)
        .json({blogs})

}
export const addBlog = async (req, res, next) => {
    const {title, description, image, user} = req.body;
    let existingUser
    try {
        existingUser = await User.findById(user)
    } catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res
            .status(400)
            .json({message: "Unable To Find User by this ID "})
    }

    const newBlog = new Blog({title, description, image, user})

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({session})
        existingUser
            .blogs
            .push(newBlog);
        await existingUser.save({session})
        await session.commitTransaction()

    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({message: err})
    }
    return res
        .status(200)
        .json({newBlog})
}
export const updateBlog = async (req, res, next) => {
    const {title, description} = req.body;
    const blogId = req.params.id;
    let blogs
    try {
        blogs = await Blog.findByIdAndUpdate(blogId, {title, description})
    } catch (err) {
        return console.log(err)
    }
    if (!blogs) {
        return res
            .status(500)
            .json({message: "unable to update"});
    }
    console.log("updated blog");
    return res
        .status(200)
        .json({blogs})
}
export const getById = async (req, res, nex) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id);
    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res
            .status(404)
            .json({message: "this blog not found"})
    }
    return res
        .status(200)
        .json({blog})
}
export const deleteBlog = async (req, res, next) => {
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog
            .findByIdAndDelete(id)
            .populate("user");
        await blog
            .user
            .blogs
            .pull(blog)
        await blog
            .user
            .save()

    } catch (err) {
        return console.log(err);
    }
    if (!blog) {
        return res
            .status(400)
            .json({message: "Unable To Delete"})
    }
    return res
        .status(200)
        .json({message: "Successfully Deleted"});
}
export const getByUserID = async(req,res,next) =>{
    const usrId = req.params.id;
    let userBlogs
    try
    {
        userBlogs = await User.findById(usrId).populate("blogs")

    }catch(err)
    {
        return console.log(err);
    }
    if(!userBlogs)
    {
        return res.status(404).json({message:"No Blog Found"})
    }
    return res.status(200).json({blogs:userBlogs})
}
