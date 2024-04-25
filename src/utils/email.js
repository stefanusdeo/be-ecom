const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_EMAIL_SENDER,
    pass: process.env.NODE_EMAIL_PASS,
  },
});

const sendEmailOrder = (to, name, store) => {
  transporter.sendMail(
    {
      from: {
        name: store,
        address: process.env.NODE_EMAIL_SENDER,
      }, // Gantilah dengan email pengirim
      to: [to.toString()], // Gantilah dengan email penerima
      subject: "Your order already process",
      text: `Hai ${name},
    
        Thank you for placing an order with our store. We would like to inform you that your order is currently being processed.

        We will notify you further once your order has been shipped. Thank you for your patience and cooperation.
        
        If you have any questions or need further assistance, please feel free to contact us.
        
        Thank you,
        Tim ${store}`,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

const sendEmailShipping = (name, noShipping, shipping) => {
  transporter.sendMail(
    {
      from: {
        name: store,
        address: process.env.NODE_EMAIL_SENDER,
      }, // Gantilah dengan email pengirim
      to: [to.toString()], // Gantilah dengan email penerima
      subject: "Your order already process",
      text: `Hai ${name},
    
        It is your number shipping : ${noShipping} shipping by ${shipping}
        
        Thank you
        ShinPro`,
    },
    (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    }
  );
};

module.exports = { sendEmailOrder, sendEmailShipping };
