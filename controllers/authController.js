import Users from '../models/Users.model.js'
import bcrypt from 'bcrypt';
import { sendEmailVerification } from '../email/authEmailService.js';
import { uniqueId } from '../helpers/uniqueId.js';


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
    const {email, password} = request.body;

    const existUser = await Users.findOne({email})
    if(!existUser){
        const error = new Error('El Usuario No existe, Registrate')
        return response.status(400).json({
            msg: error.message
        })
    }
    if(!existUser.verified){
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

    response.status(200).json({
        msg: 'Usuario Logado Correctamente'
    })
   
}

export {
    registerUser,
    verifyAccount,
    loginUser
}