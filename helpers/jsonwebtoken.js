import jwt from 'jsonwebtoken'

export const generateJWT = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4h' })
    return token
}

export const verifyJWT = (request) => {
    const token = request.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET)
    return tokenDecoded.id
}

