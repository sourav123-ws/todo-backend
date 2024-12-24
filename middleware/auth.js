import jwt from "jsonwebtoken";

export const isAuthenticated = async(req,res,next)=>{
    try {
        console.log(req.cookies);
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"User not authenticated"
            });
        };
        const user = jwt.verify(token,process.env.JWT_SECRET);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not authenticated"
            });
        };
        req.user = user ;
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error" + error.message
        })
    }
}