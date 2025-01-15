const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow React frontend to connect
app.use(express.json());


// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ravaltushar11@gmail.com',
    pass: 'gvql vvwr bmtc ppwt'
  }
});




// Twilio setup
const twilioClient = twilio('ACea641b9bf6b1735bbf8170c200340581', '32e1b7e57fcad579a68e99bf647043e3');
const twilioPhoneNumber = '+16205165346';

app.post('/api/form', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, message } = req.body;

  if (!firstName || !lastName || !phoneNumber || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Send email
    const mailOptions = {
      from: 'ravaltushar11@gmail.com',
      to: 'recipient-email@example.com',
      subject: 'New Enquiry Submitted',
      text: `A new enquiry has been submitted:\n
      Name: ${firstName} ${lastName}
      Phone: ${phoneNumber}
      Email: ${email}
      Message: ${message}`
    };

    const emailResponse = await transporter.sendMail(mailOptions);
    console.log('Email Response:', emailResponse);

    // Send SMS
    const smsResponse = await twilioClient.messages.create({
      body: `New enquiry from ${firstName} ${lastName}. Message: ${message}`,
      from: twilioPhoneNumber,
      to: '+919574278717'
    });
    console.log('SMS Response:', smsResponse);

    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
