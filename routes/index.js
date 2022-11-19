const express = require("express");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const { stringify } = require("querystring");

const router = express.Router();

const emailPass = process.env.EMAIL_PASSWORD;

router.get("/", (req, res) => {
  res.render("index.html");
});

router.post("/contact", async (req, res) => {
  if (!req.body.captcha) {
    return res.json({
      success: false,
      msg: "Por favor completar el captcha.",
    });
  }

  // Secret Key
  const secretKey = process.env.CAPTCHA_SECRET_KEY;

  // Verify Url
  const query = stringify({
    secret: secretKey,
    response: req.body.captcha,
    remoteip: req.connection.remoteAddress,
  });

  const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

  // Make request to verify url
  const body = await fetch(verifyURL).then((res) => res.json());

  // If not successful
  console.log(body);
  if (body.success !== undefined && !body.success) {
    return res.json({
      success: false,
      msg: "Captcha Fallado.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "LindaRealtyEmailer@gmail.com",
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: "LindaRealtyEmailer@gmail.com",
      to: "ceo@lindarealtytulum.com",
      subject: `Mensaje de ${req.body.name}`,
      text: `Nombre: ${req.body.name}, \nNumero: ${
        req.body.number || "..."
      }, \nCorreo: ${req.body.email || "..."},
            \n\nMensaje: ${req.body.message}`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
    });

    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false });
  }
});

module.exports = router;
