import { logger } from '../utils/logger.js';
import { createTransport } from 'nodemailer';
// Incorporación de variable "templateHtml" si se utilizara el archivo "/email/email.template.js"
// import templateHtml from './email/email.template.js';    // Modelo de correo sin utilizar
import config from '../config.js';

const transporter = createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT_ETHEREAL,
    auth: {
        user: config.FAKEMAIL,
        pass: config.PASSWORD
    }
});

const service = (email) => {
    const emails = [
        {   template:   'reg',
            subject:    'You have been registered to Express Server ECOMMERCE',
            html:       `<h1>Welcome ${email.name} to Coderhouse</h1><br>
            <p>This email is to confirm your registration to our site Ecommerce <a href="${config.RAILWAY_APP}">LOGIN</a></p>
            <p>There, you will be able to check our latest products every day.</p>
            <br></br>`
        },
        {   template:   'resetPass',
            subject:    'Ecommerce | Password reset request',
            html:       `<h1>Dear ${email.name},</h1><br><br>
            <p>This email is from the Ecommerce webpage <a href="${config.RAILWAY_APP}">${config.RAILWAY_APP}</a></p>
            <p>From our site you have requested to reset your password with this email address registered in our database.</p>
            <p>From the link below you will be able to access the RESET Password form site in order to change you password:</p>
            <p><a href="${config.RAILWAY_APP}/password/change?token=${email.token}&email=${email.destination}">CLICK HERE</a></p>
            <p>In case you have not requested the password reset, please, disregard this email and report this issue to our communication channels in oprder to verify it.</p>
            <br>
            <p>Best regards from Ecommerce site, at your service!,</p>
            <br><br>
            `
        },
        {   template:   'userDeleted',
            subject:    'Ecommerce | User deleted - Account inactive',
            html:       `<h1>Dear ${email.name},</h1><br><br>
            <p>This email is from the Ecommerce webpage <a href="${config.RAILWAY_APP}">${config.RAILWAY_APP}</a></p>
            <p>The administrator from our site has removed your account due to inactivity.</p>
            <p>In case you want to create another user click the link below to access our website again in the future:</p>
            <p><a href="${config.RAILWAY_APP}/register">CLICK HERE</a></p>
            <p>You have not logged in to our website more than ${config.DAYS_TO_REMOVE_INACTIVE_USERS} days!</p>
            <p>The account is considered inactive and thus deleted.</p>
            <br>
            <p>Best regards from Ecommerce site, at your service!,</p>
            <br><br>
            `
        },
        {   template:   'productDeleted',
            subject:    'Ecommerce | Product deleted - Product owner',
            html:       `<h1>Dear ${email.name},</h1><br><br>
            <p>This email is from the Ecommerce webpage <a href="${config.RAILWAY_APP}">${config.RAILWAY_APP}</a></p>
            <p>The administrator from our site has removed a product that you were the owner of.</p>
            <p>In case you want to create another product remember to send a POST request to the link below and create another:</p>
            <p><a href="${config.RAILWAY_APP}/api/products">CLICK HERE</a></p>
            <p>Details of the product that has been removed from our database:</p>
            <p>${JSON.stringify(email.product)}</p>
            <br>
            <p>Best regards from Ecommerce site, at your service!,</p>
            <br><br>
            `
        },
        {   template:   'purchase',
            subject:    'Ecommerce | Invoice | Products purchased!',
            html:       `<h1>Dear ${email.name},</h1><br><br>
            <p>This email is from the Ecommerce webpage <a href="${config.RAILWAY_APP}">${config.RAILWAY_APP}</a></p>
            <p>We are sending the proper invoice generated for you purchase.</p>
            <p><strong>TOTAL Spent: U$S${email.amount}!</strong></p>
            <br>
            <p>You will find the list of products you adquired below:</p>
            <ul>
            ${email.products.map( item => '<li>' + JSON.stringify(item) + '</li>' )}
            </ul>
            <p>We hope you enjoy them very much!</p>
            <br>
            <p>Best regards from Ecommerce site, at your service!,</p>
            <br><br>
            `
        }
    ]

    return emails.find ( item => item.template === email.service )
}

const mailOptions = (email) => {

    const template = service(email)
    return {
    from: config.FAKEMAIL,
    to: email.destination,
    subject: template.subject,
    html: template.html
/****************************************************************
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
****************************************************************/
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