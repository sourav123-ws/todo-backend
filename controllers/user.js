import { client } from "../db/config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken" ;
import dotenv from "dotenv";
dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide an email and a password",
      });
    }
    const existEmail = await client.query(
      `
            SELECT * FROM users WHERE email = $1 ;`,
      [email]
    );
    console.log(existEmail.rows);
    if (existEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "USer Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(email, password);
    const response = await client.query(
      `
            INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *;`,
      [email, hashedPassword]
    );
    console.log("User Created Successfully:", response.rows[0]);
    return res.status(201).json({
      message: "User created successfully",
      user: response.rows[0],
    });
  } catch (error) {
    console.log("Error creating User:", error.message);
  }
};


export const loginUser = async(req,res)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
      return res.status(400).json({
        message:"Please provide an email and a password"
      });
    }
    const response = await client.query(`
      SELECT * FROM users WHERE email = $1 ; `,[email]);
      if(response.rows.length === 0){
        return res.status(400).json({
          success:false,
          message:"User does not exist" 
        })
      }
      const user = response.rows[0];
      console.log(user);
      const matchPassword = await bcrypt.compare(password,user.password);
      if(!matchPassword){
        return res.status(400).json({
          success: false ,
          message : "Invalid Credentials"
        })
      }
      const payload = {
        id:user.id,
        email:user.email
      };
      const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1h"});
      return res.cookie("token",token,{
        httpOnly:true
      }).status(200).json({
        success:true,
        message:"User logged in successfully",
        token
      });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal Server Error" + error.message
    })
  }
}

export const logout = async(req,res)=>{
  try {
    return res.clearCookie("token").status(200).json({
      success:true,
      message:"User logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Internal Server Error" + error.message
    })    
  }
}