import Users from '../models/Users.model.js'
import { verifyJWT } from '../helpers/jsonwebtoken.js'

export const authMiddleware = async (request, response, next) => {

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        try {
            verifyJWT(request)
            const id = verifyJWT(request)
            request.user  = await Users.findById(id).select("-password -verified -createdAt -updatedAt -__v -token")
            next()
        } catch {
            const error = new Error('Tóken no válido')
            response.status(403).json({
                msg: error.message
            })
        }
    } else {
        const error = new Error('Tóken no válido ó Inexistente')
        response.status(403).json({
            msg: error.message
        })
    }
}

