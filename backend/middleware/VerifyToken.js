import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, decoded) =>{
            if(err) return res.sendStatus(403)
            req.user_name = decoded.user_name
            next()
        })
}