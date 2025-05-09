const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const User = require("./models/user");
const DailyLog = require("./models/Dailylog"); // ✅ Correct path and model usage

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());



// ✅ Routes
app.get("/home", (req, res) => {
  res.send("Server is running!");
});

// ✅ Register
app.post("/register", async (req, res) => {
  try {
    const { name, number, email } = req.body;

    if (!name || !number || !email) {
      return res
        .status(400)
        .json({ message: "Name, number, and email required" });
    }

    const userExists = await User.findOne({ number });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const newUser = new User({ name, number, email });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Login
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
// ✅ Get All Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});
// ✅ Get All Data Related to User
app.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all logs related to the user
    const logs = await DailyLog.find({ userId });

    res.status(200).json({ user, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user data", error: err.message });
  }
});
// ✅ Get All User Numbers
app.get("/users/numbers", async (req, res) => {
  try {
    const users = await User.find({}, "number");
    const numbers = users.map((user) => user.number);
    res.status(200).json(numbers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Save or Update Log
app.post("/log", async (req, res) => {
  const { userId, date, meals, totalCalories, calorieGoal } = req.body;

if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
  return res.status(400).json({ message: "Invalid or missing userId" });
}

if (!date || isNaN(Date.parse(date))) {
  return res.status(400).json({ message: "Invalid or missing date" });
}

if (!Array.isArray(meals) || meals.length === 0) {
  return res.status(400).json({ message: "Meals must be a non-empty array" });
}

for (const meal of meals) {
  if (
    typeof meal !== "object" ||
    !meal.foodName ||
    typeof meal.foodName !== "string" ||
    typeof meal.calories !== "number"
  ) {
    return res.status(400).json({ message: "Each meal must have a valid name (string) and calories (number)" });
  }
}

if (typeof totalCalories !== "number" || isNaN(totalCalories)) {
  return res.status(400).json({ message: "Invalid or missing totalCalories" });
}

if (typeof calorieGoal !== "number" || isNaN(calorieGoal)) {
  return res.status(400).json({ message: "Invalid or missing calorieGoal" });
}


  try {
    let existing = await DailyLog.findOne({ userId, date });

    if (existing) {
      existing.meals.push(...meals);
      existing.totalCalories += totalCalories;
      await existing.save();
      return res.json({ message: "Updated daily log", data: existing });
    }

    const newLog = await DailyLog.create({
      userId: new  mongoose.Types.ObjectId(userId),
      date,
      meals,
      totalCalories,
      calorieGoal,
    });

    res.status(201).json({ message: "Log created", data: newLog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save log", error: err.message });
  }
});
// ✅ Get All Logs
app.get("/logs", async (req, res) => {
  try {
    const logs = await DailyLog.find(); // Fetch all logs
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found" });
    }
    res.status(200).json({ data: logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching logs", error: err.message });
  }
});


// POST /api/users/set-goal
app.post('/set-goal', async (req, res) => {
  const { userId, goalCalories } = req.body;

  // Validate input
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  if (typeof goalCalories !== "number" || isNaN(goalCalories) || goalCalories <= 0) {
    return res.status(400).json({ message: "Invalid or missing goalCalories" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { goalCalories },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: 'Goal saved', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save goal calories' });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
});

