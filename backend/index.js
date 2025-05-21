const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); 

const app = express();

// Enable CORS for all routes
app.use(cors()); 

// Alternatively, you can configure CORS with specific options:
/*
app.use(cors({
    origin: 'https://yourfrontenddomain.com', // or '*' to allow all
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'naveenkumaroct8@gmail.com', 
            pass: 'hmzz gkfc ujnb syoe'   
        }
    });

    const mailOptions = {
        from: email,        
        to: 'naveenkumaroct8@gmail.com', 
        subject: `New message from ${name} (via Website Form)`,
        text: `Name: ${name}\nEmail: ${email}\n Subject: ${subject}\nMessage: ${message}`
    };

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