import nodemailer from "nodemailer";

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.IMAP_HOST,
            port: process.env.IMAP_PORT,
            secure: false,
            auth: {
                user: process.env.IMAP_USER,
                pass: process.env.IMAP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.IMAP_USER,
            to: to,
            subject: `Account activation on: ${process.env.API_URL}` ,
            text: '',
            html:
                `
                    <div>
                        <h1>Please, click the link in order to activate your account</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })

    }
}

export default new MailService();