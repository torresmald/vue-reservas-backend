import { createTransport } from '../config/nodemailer.js'

export const sendEmailVerification = async ({ name, email, token }) => {
    const transporter = createTransport(
        process.env.EMAIL_HOST,
        process.env.EMAIL_PORT,
        process.env.EMAIL_USER,
        process.env.EMAIL_PASSWORD

    )

    await transporter.sendMail({
        from: 'Vue-Reservas <cuentas@appsalon.com>',
        to: email,
        subject: 'Confirma tu cuenta',
        html: `<p>Hola ${name}, confirma tu cuenta</p> 
                <p>Tu cuenta está casi lista, confirmala en el siguiente enlace</p>
                <a href="${process.env.FRONT_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
                <p>Si no creaste esta cuenta, ignora el mensaje</p>`
    })
}
