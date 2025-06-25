import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id', 'user_name']
        })
        res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const Register = async(req, res) => {
    const {user_name, password} = req.body

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            user_name: user_name,
            password: hashPassword

        })
        res.json({msg: "Register Succes"})
    } catch (error) {
       console.log(error) 
    }
}


export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                user_name: req.body.user_name
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if(!match) return res.status(400).json({msg: "Wrong password"})
        const userId = user[0].id
        const user_name = user[0].user_name
        const accessToken = jwt.sign({userId, user_name}, process.env.ACCES_TOKEN_SECRET, {
            expiresIn: '20S'
        })
        const refreshToken = jwt.sign({userId, user_name}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        })
        res.cookie("refreshToken", refreshToken, {
            httppOnly:true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true
        })
        res.json({accessToken})
    } catch (error) {
        res.status(404).json({msg:"User not found"})
    }
}


export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
        if(!refreshToken) return res.sendStatus(204)
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        })
        if(!user[0]) return res.sendStatus(204)
        const userId = user [0].id
        await Users.update({refresh_token : null}, {
            where:{
                id: userId
            }
        })
        res.clearCookie("refreshToken")
        return res. sendStatus(200)
}