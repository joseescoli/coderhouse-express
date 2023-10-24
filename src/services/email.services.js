import { logger } from '../utils/logger.js';
import { createTransport } from 'nodemailer';
// Incorporación de variable "templateHtml" si se utilizara el archivo "/email/email.template.js"
// import templateHtml from './email/email.template.js';    // Dicho modelo de correo está sin utilizar
import config from '../config.js';

const transporter = createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT_ETHEREAL,
    auth: {
        user: config.FAKEMAIL,
        pass: config.PASSWORD
    }
});

const mailOptions = (email) => {
    return {
    from: config.FAKEMAIL,
    to: email.destination,
    subject: email.service === 'reg' ? 'You have been registered to Express Server ECOMMERCE' : 'Ecommerce | Password reset request',
    html: email.service === 'reg' ?
    `<h1>Welcome ${email.name} to Coderhouse</h1><br><p>This email is to confirm your registration to our site Ecommerce http://localhost:8080/</p><p>There, you will be able to check our latest products every day.</p><br>`
    :
    `<h1>Dear ${email.name},</h1><br><br>
    <p>This email from the Ecommerce webpage http://localhost:8080/</p>
    <p>From our site you have requested to reset your password with this email address registered in our database.</p>
    <p>From the link below you will be able to access the RESET Password form site in order to change you password:</p>
    <p><a href="http://localhost:8080/password/change?token=${email.token}&email=${email.destination}">CLICK HERE</a></p>
    <p>In case you have not requested the password reset, please, disregard this email and report this issue to our communication channels in oprder to verify it.</p>
    <br>
    <p>Best regards from Ecommerce site, at your service!,</p>
    <br><br>
    `
    
    /*
    // Parámetros sin utilizar
    text: 'Texto plano del cuerpo del correo',
    html: templateHtml [variable importada con html pre generado en otro archivo. En caso de utilizarse se debe importar arriba],
    // Definición de adjunto en el correo
    attachments: [
        {
            path: process.cwd() + '/src/services/adjunto.txt',
            filename: `resumen-de-cuenta-${config.FAKEMAIL}`
        }
    ]
    */

    }

}

export const sendMailEthereal = async (email) => {
    try {
        const response = await transporter.sendMail(mailOptions(email));
        logger.debug(response);
        return response
    } catch (error) {
        logger.error(error.message)
    }
}