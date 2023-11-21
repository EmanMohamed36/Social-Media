import Blog from "../model/Blog.js";
import User from "../model/user.js"
import bcrypt from "bcryptjs"

export const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();

    } catch (err) {
        return console.log(err);
    }
    if (!users) {
        return res
            .status(404)
            .json({message: "No Users found"})
    } else {

        return res
            .status(200)
            .json({users});
    }
}
export const singUpUser = async (req, res, next) => {
    const {name, email, password} = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({email})

    } catch (err) {
        return console.log(err)
    }
    if (existingUser) {
        return res
            .status(400)
            .json({message: "The User Already Existing !! Login Instead"})
    }
    const hashPassword = bcrypt.hashSync(password);

    const user = new User({name, email, password: hashPassword, blogs: []})
    try {
        await user.save()

    } catch (err) {
        console.log(err);
    }
    return res
        .status(201)
        .json({user})

}

export const loginUser = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser
    try {
        existingUser = await User.findOne({email});

    } catch (err) {
        return console.log(err);
    }
    if (!existingUser) {
        return res
            .status(404)
            .json({message: "You haven't account !! try signup"});
    }

    const isPassword = bcrypt.compareSync(password, existingUser.password);

    if (!isPassword) {
        return res
            .status(404)
            .json({message: "Incorrect password"})
    }

    return res
        .status(200)
        .json({message: "Login Successfull!!"});

}
