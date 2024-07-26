import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

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

  const url = 'https://youraccountant.us/php/contact-form.php';

  // Create a FormData object
  let formData = new FormData();
  
  // Append data fields to the formData object
  formData.append("name", name);
  formData.append("email", email);
  formData.append("message", `Subject: ${subject}, Description: ${description}`);



  // Use Axios to send a POST request with FormData
  axios.post(url, formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  })
  .then(function (response) {
      console.log('Response from the server:', response.data);
      // Handle success here
  })
  .catch(function (error) {
      console.error('Error:', error);
      // Handle error here
  });

//   await axios.post("https://youraccountant.us/php/contact-form.php", {
//     name: name,
//     email: email,
//     message: `Subject: ${subject}, Description: ${description}`
//   }).then(data => {
//     console.log(data);
    
//   }).catch(err => {
//     console.log(err);
    
//   });

  

  res.json({ message: 'Email sent successfully!' });
  return;
  // Create a nodemailer transporter using SMTP
  console.log(process.env.MAIL_USERNAME + " " + process.env.MAIL_PASSWORD);
  
  const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465, // Usually 587 for secure SMTP
    secure: true,
    auth: {
        user: "info@simonainc.com",
        pass: "puda loek lwkd cbun",
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
    //   to: 'info@simonainc.com',
      to: 'zcoderuz@gmail.com',
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
      res.status(500).json({ message: 'Failed to send email...' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
