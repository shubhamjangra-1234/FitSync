// const express = require("express");
// const app = express();
// const cors = require("cors");
// const sendScheduledMessages = require("./cron"); // Ensure this matches the exported function
// app.use(cors());
// // Middleware to parse incoming JSON requests
// app.use(express.json()); // This line ensures `req.body` is properly populated

// app.use("/home", (req, res) => {
//   res.send("server is fine");
// });
// // Save user details
// app.post("/register", async (req, res) => {
//   try {
//     const { name, number, email } = req.body;

//     if (!name || !number || !email) {
//       return res
//         .status(400)
//         .json({ message: "Name, phone, and email are required" });
//     }

//     const userExists = await User.findOne({ number });
//     if (userExists) {
//       return res
//         .status(400)
//         .json({ message: "Phone number already registered" });
//     }

//     const newUser = new User({ name, number, email });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Clean up documents where the phone number is null
// const cleanUpNullPhoneNumbers = async () => {
//   try {
//     const result = await User.deleteMany({ number: null });
//     console.log("Successfully cleaned up null phone records:", result);
//   } catch (err) {
//     console.error("Error cleaning up null phone records:", err);
//   }
// };
// const accountSid = "ACe55dac4bdb845ffb69bc0ce463e9d163";
// const authToken = "954913f782e079a49c24c5182eb8e1fe";
// const client = require("twilio")(accountSid, authToken);

// client.messages
//   .create({
//     body: `Hi User!

// Its a quick reminder to have your meals and workout on time.

// Take Care.
// FitSync`,
//     from: "whatsapp:+14155238886",
//     to: "whatsapp:+917082545147",
//   })
//   .then((message) => console.log(message.sid));

// // Call the cleanup function
// cleanUpNullPhoneNumbers();

// // Start the cron jobs
// sendScheduledMessages();
// app.get("/test-whatsapp", async (req, res) => {
//   const message = "This is a test message!";
//   const number = "whatsapp:+14155238886"; // Replace with your test number
//   try {
//     await sendWhatsAppMessage(number, message);
//     res.send("Message sent successfully!");
//   } catch (error) {
//     res.status(500).send("Error sending message");
//   }
// });
// app.get("/users/numbers", async (req, res) => {
//   try {
//     const users = await User.find({}, "number"); // Fetch only the 'number' field
//     const numbers = users.map(user => user.number);
//     res.status(200).json(numbers);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
// // module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const User = require("./Models/User");
const app = express();
require('dotenv').config();
// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/home", (req, res) => {
  res.send("Server is running!");
});
console.log('Twilio Account SID:', accountSid);
// Register and Send Thank You Message
app.post("/register", async (req, res) => {
  try {
    const { name, number, email } = req.body;

    if (!name || !number || !email) {
      return res.status(400).json({ message: "Name, number, and email required" });
    }

    const userExists = await User.findOne({ number });
    if (userExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    const newUser = new User({ name, number, email });
    await newUser.save();
  // ✨ Normalize the phone number
  let normalizedNumber = number;
  if (!number.startsWith("+91")) {
    normalizedNumber = `+91${number}`;
  }
  
  // Send Thank You WhatsApp message
  await client.messages.create({
      body: `Hi ${name}!\n\nThank you for registering at FitSync! 🎉\n\nStay healthy, stay fit! 💪`,
      from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${normalizedNumber}`, // Assuming Indian numbers
    });

    res.status(201).json({ message: "User registered Successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});
// Login Route
app.post("/login", async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const user = await User.findOne({ number });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/users/numbers", async (req, res) => {
  try {
    const users = await User.find({}, "number"); // Fetch only the 'number' field
    const numbers = users.map(user => user.number);
    res.status(200).json(numbers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// WhatsApp Reminder Message Function
const sendReminderMessage = async (user) => {
  try {
    await client.messages.create({
      body: `Hi ${user.name}!\n\n⏰ Quick Reminder!\n\nStay on track:\n- Have your meals on time 🍽️\n- Complete your workout 🏋️\n\n- FitSync`,
      from: `${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${user.number}`,
    });
    console.log(`✅ Reminder sent to ${user.number}`);
  } catch (error) {
    console.error(`❌ Error sending reminder to ${user.number}:`, error.message);
  }
};

// Cron Jobs for Scheduled Reminders
const scheduleReminders = () => {
  // 7 AM Reminder
  cron.schedule("0 7 * * *", async () => {
    console.log("Sending 7AM reminders...");
    const users = await User.find();
    users.forEach(sendReminderMessage);
  });

  // 1 PM Reminder
  cron.schedule("0 13 * * *", async () => {
    console.log("Sending 1PM reminders...");
    const users = await User.find();
    users.forEach(sendReminderMessage);
  });

  // 8 PM Reminder
  cron.schedule("0 20 * * *", async () => {
    console.log("Sending 8PM reminders...");
    const users = await User.find();
    users.forEach(sendReminderMessage);
  });
};

// Start Cron Jobs
scheduleReminders();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
