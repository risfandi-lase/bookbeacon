import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken"

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(401)
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        })
        if(!user[0]) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403)
            const userId = user[0].id
            const user_name = user[0].user_name
            const accessToken = jwt.sign({userId, user_name}, process.env.ACCES_TOKEN_SECRET, {
               expiresIn: '15s' 
            })
            res.json({accessToken})
        })    

    } catch (error) {
        console.log(error)
    }
}