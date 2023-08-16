import { createTransport } from '../config/nodemailer.js'

export const sendEmailVerification = async ({ name, email, token }) => {
    const transporter = createTransport(
        "sandbox.smtp.mailtrap.io", 2525, 'ddce4e205024f9', 'b129393e9a87dc'
    )

    await transporter.sendMail({
        from: 'Vue-Reservas',
        to: email,
        subject: 'Confirma tu cuenta',
        html: `<p>Hola ${name}, confirma tu cuenta</p> 
                <p>Tu cuenta está casi lista, confirmala en el siguiente enlace</p>
                <a href="http://localhost:4000/api/auth/verify/${token}">Confirmar cuenta</a>
                <p>Si no creaste esta cuenta, ignora el mensaje</p>`
    })
}
