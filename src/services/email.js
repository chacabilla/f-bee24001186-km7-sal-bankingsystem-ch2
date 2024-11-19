const { text } = require('express');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'blablabla@gmail.com',
    text: 'Helo',
    subject: 'Test email',
    html: '<b>Hey there! </b> <br> This is our first message sent with Nodemailer<br/>',
};

transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});