require('dotenv').config();

const nodemailer = require("nodemailer");

module.exports = {
    sendMail: async (email, subject, text) => {
        try
        {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
        
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: subject,
                html: text,
            });

            return true;
        } catch (error) {
            console.log(error);

            return false;
        }
    }
}