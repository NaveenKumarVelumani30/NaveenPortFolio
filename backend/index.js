const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'naveenkumaroct8@gmail.com', // Your Gmail
            pass: 'hmzz gkfc ujnb syoe'   // App Password (not regular password)
        }
    });

    const mailOptions = {
        from: email,        
        to: 'naveenkumaroct8@gmail.com', // Your email (receiver)
        subject: `New message from ${name} (via Website Form)`,
        text: `Name: ${name}\nEmail: ${email}\n Subject: ${subject}\nMessage: ${message}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error: Email not sent.');
        }
        res.status(200).send('Message sent successfully!');
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});