// const cron = require('node-cron');
// const sendWhatsAppMessage = require('./twilio.js');
// const User = require('./models/user'); 
// // Function to send scheduled messages
// const sendScheduledMessages = async () => {
//     try {
//       const users = await User.find(); // Get all users from DB
//       const morningMessage = "Good morning! Don't forget to have your breakfast!";
//       const afternoonMessage = "Good afternoon! Time for lunch!";
//       const dinnerMessage = "Good evening! It's dinner time!";
  
//       // Send messages to all users
//       users.forEach(async (user) => {
//         // Send morning message at 7 AM
//         cron.schedule('0 7 * * *', () => {
//           sendWhatsAppMessage(user.number, morningMessage);
//         });
  
//         // Send afternoon message at 1 PM
//         cron.schedule('0 13 * * *', () => {
//           sendWhatsAppMessage(user.number, afternoonMessage);
//         });
  
//         // Send dinner message at 7 PM
//         cron.schedule('0 19 * * *', () => {
//           sendWhatsAppMessage(user.number, dinnerMessage);
//         });
//       });
//     } catch (error) {
//       console.error("Error sending scheduled messages:", error);
//     }
//   };
  
//   // Call sendScheduledMessages function
//   module.exports = sendScheduledMessages;