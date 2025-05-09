const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
  mealType: { type: String},
  foodName: { type: String},
  calories: { type: Number},
  protein: { type: Number},
});

const dailyLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId,  ref: "User" },
  date: { type: String },
  meals: { type: [mealSchema] },
  totalCalories: { type: Number },
  calorieGoal: { type: Number },
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);
