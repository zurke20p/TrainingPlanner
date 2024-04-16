require('dotenv').config();

const jwt = require("jsonwebtoken");
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
    },
    authenticate: async (req, name = 'jwt') =>
    {
        const cookie = req.cookies[name];
        if(!cookie) return false;
        
        const claims = jwt.verify(cookie, process.env.JWT_SECRET);

        if(!claims) return false;
        
        return true;
    },
}