import nodemailer from "nodemailer";

const emailRecuperar = async datos => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const { nombre, email, token } = datos;

    const html = `
    <p>Hola: ${nombre}, has solicitado restablecer tu password.</p>
    <p>Sigue el siguiente enlace para generar un nuevo password</p>
    <a href="${process.env.FRONTEND_URL}/recuperar/${token}">Restablecer Password</a>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `;

    const info = await transporter.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Restablece tu Password',
        text: 'Restablece tu Password',
        html: html
    });

    console.log("Mensaje enviado: %s", info.messageId);
}

export default emailRecuperar;