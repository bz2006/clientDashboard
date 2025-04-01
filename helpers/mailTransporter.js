import nodemailer from 'nodemailer';

export const Transporter = nodemailer.createTransport({
  service: 'gmail', 
  host: 'smtp.gmail.com',
port: 465,
secure: true,
  auth: {
    user: 'noreply.trak24.in@gmail.com', 
    pass: 'gtly iari dxxm dnue' 
  }
});