const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

const gmailEmail = functions.config().gmail.email;
const gmailPass = functions.config().gmail.pass;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass
  }
});

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).send("Missing fields");
    }

    try {
      await transporter.sendMail({
        from: `"Neutill Admin" <${gmailEmail}>`,
        to,
        subject,
        text: message
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      return res.status(500).send("Email failed");
    }
  });
});
