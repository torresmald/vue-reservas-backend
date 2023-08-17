import jwt from 'jsonwebtoken'
import Users from '../models/Users.model.js'
import {verifyJWT} from '../helpers/jsonwebtoken.js'

export const authMiddleware = async (request, response, next) => {

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
        try {
            verifyJWT(request)
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

