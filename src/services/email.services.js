import { logger } from '../utils/logger.js';
import { createTransport } from 'nodemailer';
// import templateHtml from './email/email.template.js';
import config from '../config.js';

export const transporter = createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT_ETHEREAL,
    auth: {
        user: config.FAKEMAIL,
        pass: config.PASSWORD
    }
});

export const mailOptions = (destination) => {
    return {
    from: config.FAKEMAIL,
    to: destination,
    subject: 'You have been registered to Express Server ECOMMERCE',
    // text: 'Este es el texto del email',
    html: `<h1>Bienvenido a Coderhouse</h1><br><p>TEST EMAIL FROM Express Server</p><br>`,
    // html: templateHtml,
    /*
    attachments: [
        {
            path: process.cwd() + '/src/services/adjunto.txt',
            filename: `resumen-de-cuenta-${config.FAKEMAIL}`
        }
    ]
    */
    }

}

// import { mailOptions, transporter } from "../services/email.service.js";
export const sendMailEthereal = async (email) => {
    try {
        const response = await transporter.sendMail(mailOptions(email));
        logger.debug(response);
        return response
    } catch (error) {
        logger.error(error.message)
    }
}