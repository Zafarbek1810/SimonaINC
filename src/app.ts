import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.set('trust proxy', true);
require('dotenv').config();
const PORT: number = +process.env.PORT;

// Middlewares
app.use(cors()); // To handle CORS
app.use(bodyParser.urlencoded({ extended: true })); // To parse form data

app.get('/', async (req: Request, res: Response) => {
    return res.status(200).json({ message: 'Whatsup there ?!' });
});

app.post('/app/send-mail', async (req: Request, res: Response) => {
  const { name, email, phone, subject, description } = req.body;

  // Check for required fields
  if (!name || !email || !phone || !subject || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  // Create a nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // Usually 587 for secure SMTP
    secure: true,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
  //   tls: {
  //     ciphers:'SSLv3'
  // }
});
    const userAgent = req.get('User-Agent') || 'Unknown';

    // console.log(`User-Agent: ${userAgent}`);
  // Email options
  const mailOptions = {
      from: email,
      to: 'info@simonainc.com',
      subject: `💵 New quote from simonainc.com`,
      text: `
          -------- 📧 Message 📧 -------- 

          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          Subject: ${subject}
          Description: ${description}
          
          -------- 🪪 Info 🪪 -------- 

          Agent: ${userAgent}
          Ip-Address: ${req.ip}

          *Use ip address to get more info about user, for example to know his location
      `,
  };

  try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Email sent successfully!' });
  } catch (error) {
      console.error('Error sending email: ', error);
      res.status(500).json({ message: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
