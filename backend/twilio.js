// const twilio = require('twilio');
// require('dotenv').config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// const sendWhatsAppMessage = async (to, body) => {
//   try {
//     await client.messages.create({
//       from: 'whatsapp:+14155238886',
//       to: `whatsapp:${to}`, // User's WhatsApp number
//       body: "This is a test message!", // Default message body
//     //   contentSid: contentSid,
//     //   contentVariables: JSON.stringify(contentVariables),
//     });
//     console.log(`Message sent to ${to}`);
//     console.log("Message body:", body);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// module.exports = sendWhatsAppMessage;
