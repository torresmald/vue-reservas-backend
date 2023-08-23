import Users from '../models/Users.model.js'
import bcrypt from 'bcrypt';
import { sendEmailVerification, sendEmailForgotPassword } from '../email/authEmailService.js';
import { uniqueId } from '../helpers/uniqueId.js';
import { generateJWT } from '../helpers/jsonwebtoken.js'
import { verifyJWT } from '../helpers/jsonwebtoken.js';


const user = async (request, response) => {
    const id = verifyJWT(request)
    const user = await Users.findById(id).select("-password -verified -createdAt -updatedAt -__v -token")
    response.status(200).json(
        user
    )
}

const registerUser = async (request, response, next) => {
    const { name, email, password } = request.body
    const MIN_LENGTH = 8
    if (Object.values(request.body).includes('')) {
        const error = new Error('Todos los campos son Obligatorios')
        return response.status(400).json({
            msg: error.message
        })
    }
    const existUser = await Users.findOne({ email })
    if (existUser) {
        const error = new Error('El Usuario ya existe, Loguéate')
        return response.status(400).json({
            msg: error.message
        })
    }
    if (password.trim().length < MIN_LENGTH) {
        const error = new Error('El Password es demasiado corto, mínimo 8 carácteres.')
        return response.status(400).json({
            msg: error.message
        })
    }
    try {
        const encryptedPassword = await bcrypt.hash(password.toString(), parseInt(10));
        if (!encryptedPassword) {
            return next();
        }
        const newUser = new Users({
            name,
            email,
            password: encryptedPassword,
            token: uniqueId()
        })

        sendEmailVerification({
            name: newUser.name,
            email: newUser.email,
            token: newUser.token
        })
        await newUser.save()
        response.status(200).json({
            msg: 'Usuario Creado correctamente. Revisa tu email'
        })
    } catch (error) {
        console.log(error);
    }
}

const verifyAccount = async (request, response) => {
    const token = request.params.token;
    const existUser = await Users.findOne({ token })
    if (!existUser) {
        const error = new Error('El Token no es váido')
        return response.status(401).json({
            msg: error.message
        })
    }
    try {
        existUser.verified = true
        existUser.token = ''
        await existUser.save()
        response.status(200).json({
            msg: 'Usuario Confirmado Correctamente'
        })
    } catch (error) {
        console.log(error);
    }

}

const loginUser = async (request, response) => {
    const { email, password } = request.body;

    const existUser = await Users.findOne({ email })
    if (!existUser) {
        const error = new Error('El Usuario No existe, Registrate')
        return response.status(400).json({
            msg: error.message
        })
    }
    if (!existUser.verified) {
        const error = new Error('No has verificado tu cuenta, revisa tu email')
        return response.status(400).json({
            msg: error.message
        })
    }

    const isValidPassword = await bcrypt.compare(password, existUser.password);
    if (!isValidPassword) {
        const error = new Error('El password no es correcto')
        return response.status(403).json({ msg: error.message })
    }

    const token = generateJWT(existUser._id)

    response.status(200).json({
        token,
        msg: 'Logueado correctamente'
    })

}


const forgotPassword = async (request, response) => {
    const { email } = request.body
    const user = await Users.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')
        return response.status(404).json({ msg: error.message })
    }
    try {
        user.token = uniqueId()
        const result = await user.save()
        await sendEmailForgotPassword({
            name: result.name,
            email: result.email,
            token: result.token
        })
        response.json({
            msg: 'Hemos enviado un email con las instrucciones'
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyPasswordResetToken = async (request, response) => {
    const { token } = request.params

    const user = await Users.findOne({ token })
    if (!user) {
        const error = new Error('Token no Valido')
        return response.status(404).json({
            msg: error.message
        })
    }
    response.status(200).json({
        msg: 'Token Valido'
    })
}

const updatePassword = async (request, response) => {
    const { password } = request.body
    const { token } = request.params
    const user = await Users.findOne({ token })
    if (!user) {
        const error = new Error('Token no Valido')
        return response.status(404).json({
            msg: error.message
        })
    }

    try {
        const encryptedPassword = await bcrypt.hash(password.toString(), parseInt(10));
        user.token = ''
        user.password = encryptedPassword
        await user.save()
        response.status(201).json({
            msg: 'Password Modificado Correctamente'
        })

    } catch (error) {
        console.log(error);
    }
}


const admin = async (request, response) => {
    const id = verifyJWT(request)
    const user = await Users.findById(id).select("-password -verified -createdAt -updatedAt -__v -token")
    if (!user.admin) {
        const error = new Error('Acceso Prohibido')
        return response.status(403).json({
            msg: error.message
        })
    }
    response.status(200).json(
        user
    )
}

export {
    user,
    registerUser,
    verifyAccount,
    loginUser,
    forgotPassword,
    verifyPasswordResetToken,
    updatePassword,
    admin
}