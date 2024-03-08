import User from "../model/User.js";
// import bcrypt from 'bcryptjs';
import bcrypt from "bcrypt";


export const getAllUser = async(req,res,next) =>{
    let users;
    try{
        users=await User.find();
    }catch(err){
       return console.log(err);
    }
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({users});
}


export const signup = async(req,resp,next) => {
    const {name, email, password } = req.body;
    let existingUser;
    try {
       existingUser = await User.findOne({email});

    } catch (error) {
       return console.log(error);
    }

    if(existingUser){
        return resp.status(400).json({message:"User Alredy Exists! Login Instead"})
    }
    const saltRounds = 10; // // Adjust the number of salt rounds according to your security requirements
    const hashPassword = bcrypt.hashSync(password, saltRounds);
    
    const user = new User({
        name, 
        email,
        password: hashPassword,
        blos:[],
    });
    

    try {
       await user.save(); // mongoose function save
    } catch (error) {
      return console.log(error);
    }
    return resp.status(200).json({user});
}




export const login = async (req,res,next)=>{
    const {email, password} =req.body;
    let existingUser;
    try {
       existingUser =await User.findOne({email});

    } catch (error) {
       return console.log(error);
    }

    if(!existingUser){
        return resp.status(404).json({message: "Could not find User by this Email" });
    }
    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        res.status(400).json({message: "Incorrect Password"})
    }
    return res.status(200).json({message:"Login Successfull" ,user: existingUser});

}