import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import FoodTrack from "../FoodTrack/FoodTrack";

export default function Track() {
  const [user, setUser] = useState(null);
  const [Logs, setLogs] = useState(null);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
    activity: "1.2",
    goal: "maintain",
    dietType: "veg",
  });
  const [calories, setCalories] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateCalories = () => {
    const { height, weight, age, gender, activity, goal } = formData;
    if (height && weight && age) {
      let BMR;
      if (gender === "male") {
        BMR =
          10 * parseFloat(weight) +
          6.25 * parseFloat(height) -
          5 * parseInt(age) +
          5;
      } else {
        BMR =
          10 * parseFloat(weight) +
          6.25 * parseFloat(height) -
          5 * parseInt(age) -
          161;
      }

      let TDEE = BMR * parseFloat(activity);

      if (goal === "gain") {
        TDEE += 500;
      } else if (goal === "lose") {
        TDEE -= 500;
      }

      setCalories(TDEE);
      generateDietPlan(TDEE, formData.dietType);
    }
  };

  const saveGoalCalories = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.post("http://localhost:5000/set-goal", {
        userId,
        goalCalories: calories,
      });
      console.log("Calories amount:", calories);
      console.log("response data:" + response.data),
        alert("🎯 Goal calories saved successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save goal calories.");
    }
  };
  const generateDietPlan = (calories, dietType) => {
    const mealCalories = {
      morning: calories * 0.3,
      afternoon: calories * 0.4,
      evening: calories * 0.3,
    };

    const vegMeals = {
      morning: [
        {
          item: "Oats with milk and almonds",
          protein: 12,
          carbs: 45,
          fiber: 8,
        },
        { item: "Paneer stuffed paratha", protein: 18, carbs: 50, fiber: 6 },
        {
          item: "Fruit smoothie with chia seeds",
          protein: 10,
          carbs: 40,
          fiber: 7,
        },
      ],
      afternoon: [
        {
          item: "Mixed vegetable curry + brown rice",
          protein: 20,
          carbs: 55,
          fiber: 10,
        },
        { item: "Paneer tikka + salad", protein: 25, carbs: 20, fiber: 5 },
        {
          item: "Dal + roti + vegetable stir fry",
          protein: 22,
          carbs: 50,
          fiber: 9,
        },
      ],
      evening: [
        {
          item: "Vegetable soup + grilled tofu",
          protein: 15,
          carbs: 20,
          fiber: 6,
        },
        {
          item: "Quinoa salad with chickpeas",
          protein: 18,
          carbs: 35,
          fiber: 8,
        },
        {
          item: "Moong dal chilla with curd",
          protein: 20,
          carbs: 30,
          fiber: 7,
        },
      ],
    };

    const nonVegMeals = {
      morning: [
        {
          item: "Boiled eggs + whole wheat toast",
          protein: 20,
          carbs: 25,
          fiber: 4,
        },
        {
          item: "Chicken sandwich with veggies",
          protein: 25,
          carbs: 40,
          fiber: 5,
        },
        { item: "Greek yogurt with berries", protein: 15, carbs: 20, fiber: 3 },
      ],
      afternoon: [
        {
          item: "Grilled chicken breast + rice",
          protein: 35,
          carbs: 45,
          fiber: 3,
        },
        { item: "Fish curry + quinoa", protein: 30, carbs: 40, fiber: 4 },
        { item: "Egg curry + roti + salad", protein: 28, carbs: 50, fiber: 6 },
      ],
      evening: [
        { item: "Chicken salad", protein: 30, carbs: 10, fiber: 5 },
        {
          item: "Grilled fish with steamed veggies",
          protein: 28,
          carbs: 15,
          fiber: 4,
        },
        {
          item: "Scrambled eggs with sautéed spinach",
          protein: 22,
          carbs: 10,
          fiber: 4,
        },
      ],
    };

    const meals = dietType === "veg" ? vegMeals : nonVegMeals;

    setDietPlan({
      morning: {
        items: meals.morning,
        calories: mealCalories.morning.toFixed(0),
      },
      afternoon: {
        items: meals.afternoon,
        calories: mealCalories.afternoon.toFixed(0),
      },
      evening: {
        items: meals.evening,
        calories: mealCalories.evening.toFixed(0),
      },
    });
  };

  const data = {
    labels: ["Morning", "Afternoon", "Evening"],
    datasets: [
      {
        label: "Recommended Calories",
        data: calories
          ? [calories * 0.3, calories * 0.4, calories * 0.3]
          : [0, 0, 0],
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "#22c55e",
        borderWidth: 2,
      },
    ],
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId || userId.trim() === "") {
          console.warn("User ID is missing or invalid in local storage.");
          return;
        }
        const res = await axios.get(`http://localhost:5000/user/${userId}`);
        if (res.data) {
          setUser(res.data.user);
          setLogs(res.data.Logs);
        } else {
          console.warn("No data returned from the server.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("❌ Failed to fetch user data. Please try again later.");
      }
    };

    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen p-2 flex flex-col items-center">
      <p className="bg-green-300 p-2 rounded-md text-gray-500 my-2 text-center">
        This tool is designed to help you achieve your fitness goals by
        providing a detailed breakdown of your daily calorie needs and a
        personalized diet plan.
      </p>
      <h2 className="text-4xl text-center text-green-600 mb-4">
        Track Your Daily Calorie Needs
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Enter your details below to calculate your daily calorie requirements
        and get a customized protein-rich diet plan.
      </p>
      {user && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md mb-4">
          Welcome, {user.name} 🎉
        </div>
      )}
      <div className="bg-white mb-10 p-4 rounded-lg  max-w-5xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {["height", "weight", "age"].map((field, idx) => (
            <div key={idx}>
              <label className="block text-gray-800 text-sm mb-2 capitalize">
                {field}{" "}
                {field === "height" ? "(cm)" : field === "weight" ? "(kg)" : ""}
              </label>
              <input
                type="number"
                name={field}
                onChange={handleChange}
                className="w-full  p-2  border shadow-sm shadow-zinc-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-gray-800 text-sm mb-2">Gender</label>
            <select
              name="gender"
              onChange={handleChange}
              className="w-full  p-2  border shadow-sm shadow-zinc-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm mb-2">
              Activity Level
            </label>
            <select
              name="activity"
              onChange={handleChange}
              className="w-full  p-2  border shadow-sm shadow-zinc-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1.2">Sedentary (little/no exercise)</option>
              <option value="1.375">
                Lightly Active (light exercise 1-3 days/week)
              </option>
              <option value="1.55">
                Moderately Active (moderate exercise 3-5 days/week)
              </option>
              <option value="1.725">
                Very Active (hard exercise 6-7 days/week)
              </option>
              <option value="1.9">
                Extremely Active (very hard exercise + physical job)
              </option>
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm mb-2">Goal</label>
            <select
              name="goal"
              onChange={handleChange}
              className="w-full  p-2  shadow-sm shadow-zinc-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
              <option value="lose">Lose Weight</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-800 text-sm mb-2">
              Diet Preference
            </label>
            <select
              name="dietType"
              onChange={handleChange}
              className="w-full  p-2  shadow-sm shadow-zinc-300 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="veg">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
          </div>
        </div>
        <button
          onClick={calculateCalories}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition duration-200"
        >
          Calculate
        </button>
      </div>
      {calories && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Your daily goal: {calories} kcal
          </p>
          <button
            onClick={saveGoalCalories}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save as Goal Calories
          </button>
        </div>
      )}
      {calories && (
        <div className=" w-full flex items-center justify-center flex-col p-4 ">
          <h2 className="text-4xl text-center text-green-600">
            Calculated Calories & Diet Plan
          </h2>
          <div className="mt-4 w-full max-w-5xl text-center">
            <span className="block bg-green-300 rounded-md text-zinc-800 text-sm font-medium px-4 py-2 ">
              This graph represents the distribution of your recommended daily
              calorie intake across meals.
            </span>
          </div>
          <div className="mt-10 w-full max-w-2xl bg-white p-4 rounded-lg shadow-sm shadow-zinc-500">
            <h3 className="text-2xl text-green-700 font-bold text-center mb-4">
              Your Daily{" "}
              {formData.goal.charAt(0).toUpperCase() + formData.goal.slice(1)}{" "}
              Calories: {calories.toFixed(2)} kcal
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Based on your input, this is the recommended daily calorie intake.
            </p>
            <Line data={data} />
          </div>
        </div>
      )}

      {dietPlan && (
        <div className="mt-10 w-full max-w-5xl bg-white p-6 rounded-lg shadow-sm shadow-zinc-500">
          <h3 className="text-2xl  text-green-700 text-center mb-6">
            Protein Rich Diet Plan (
            {formData.dietType === "veg" ? "Vegetarian" : "Non-Vegetarian"})
          </h3>
          <p className="text-gray-500 text-center mb-4">
            Below is a detailed breakdown of your meals, including protein,
            carbs, and fiber content for each item.
          </p>
          <div className="space-y-6">
            {["morning", "afternoon", "evening"].map((meal) => (
              <div key={meal}>
                <h4 className="text-xl bg-green-500 rounded-md p-2  text-zinc-100 capitalize mb-2">
                  {meal} ({dietPlan[meal].calories} kcal)
                </h4>
                <ul className=" text-center text-gray-800 space-y-4">
                  {dietPlan[meal].items.map((item, index) => (
                    <li key={index}>
                      <span className="">{item.item}</span> —
                      <span className="ml-1 text-green-700 text-sm">
                        Protein: {item.protein}g | Carbs: {item.carbs}g | Fiber:{" "}
                        {item.fiber}g
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
<FoodTrack/>
      <footer className="mt-10 text-center text-gray-500">
        <p>
          Note: This tool provides general recommendations. For personalized
          advice, consult a healthcare or nutrition professional.
        </p>
      </footer>
    </div>
  );
}
