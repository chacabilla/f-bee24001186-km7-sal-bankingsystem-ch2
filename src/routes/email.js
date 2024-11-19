const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true
});

router.post('/', (req, res) => {
    const {to, subject, text } = req.body;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html: '<b>Hey there! </b> <br> This is our first message sent with Nodemailer<br/>',
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: err.message });
        }
        res.status(200).send({ message: "Mail sent", message_id: info.messageId });
    });
});

module.exports = router;