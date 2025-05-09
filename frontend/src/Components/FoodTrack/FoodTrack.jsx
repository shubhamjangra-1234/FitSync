import { useState, useEffect } from "react";
import axios from "axios";
import LoggedMealsSection from "./LoggedMeal";

const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [foodData, setFoodData] = useState(null);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState("g");
  const [mealType, setMealType] = useState("morning");
  const [alerts, setAlerts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [meals, setMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [calorieGoal, setCalorieGoal] = useState(0);

  // Fetch user calorie goal and logged meals from the database
  const fetchCalorieGoal = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`http://localhost:5000/user/${userId}`);
      if (response.status === 200) {
        const user = response.data.user;
        setCalorieGoal(user.goalCalories || 0); // Default to 0 if not set
        setMeals(user.loggedMeals || []); // Default to empty array if no meals
        setTotalCalories(
          user.loggedMeals?.reduce((sum, meal) => sum + meal.calories, 0) || 0
        ); // Calculate total calories or default to 0
      } else {
        console.error("Failed to fetch user data. Status:", response.status);
        setCalorieGoal(0);
        setMeals([]);
        setTotalCalories(0);
      }
    } catch (err) {
      console.error(
        "Error fetching user data:",
        err.response?.data || err.message
      );
      setCalorieGoal(0);
      setMeals([]);
      setTotalCalories(0);
    }
  };

  // Fetch calorie goal on component mount
  useEffect(() => {
    fetchCalorieGoal();
  }, []);

  const apiKey = import.meta.env.VITE_USDA_API_KEY;
  console.log("API Key:", apiKey);
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFoodData(null);
    setAlerts([]);
    setRecommendations([]);

    if (!query.trim()) {
      setError("Please enter a food item.");
      return;
    }

    try {
      const response = await axios.get(
        "https://api.nal.usda.gov/fdc/v1/foods/search",
        {
          params: {
            api_key: apiKey,
            query: query,
            pageSize: 1,
          },
        }
      );

      const item = response.data.foods?.[0];

      if (!item) {
        setError("No results found.");
        return;
      }

      setFoodData(item);
      generateInsights(item);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nutrition data. Check your API key or query.");
    }
  };

  const generateInsights = (item) => {
    if (!item?.foodNutrients) return;

    const nutrients = item.foodNutrients.reduce((acc, curr) => {
      acc[curr.nutrientName.toLowerCase()] = {
        value: curr.value,
        unit: curr.unitName,
      };
      return acc;
    }, {});

    const scaled = (v) => (v * amount) / 100;
    const protein = scaled(nutrients["protein"]?.value || 0);
    const calories = scaled(nutrients["energy"]?.value || 0);

    const warnings = [];
    const recs = [];

    if (calories > 500) warnings.push("High calorie content.");
    if (protein < 5) recs.push("Consider adding protein-rich food.");
    if (protein >= 5 && calories < 300)
      recs.push("Good for high-protein low-calorie goals.");

    setAlerts(warnings);
    setRecommendations(recs);
  };

  const handleAddToMeal = () => {
    if (!foodData) return;

    const nutrients = foodData.foodNutrients.reduce((acc, curr) => {
      acc[curr.nutrientName.toLowerCase()] = curr.value;
      return acc;
    }, {});

    const calories = ((nutrients["energy"] || 0) * amount) / 100;
    const protein = ((nutrients["protein"] || 0) * amount) / 100;

    const meal = {
      foodName: foodData.description,
      calories: parseFloat(calories.toFixed(2)),
      protein: parseFloat(protein.toFixed(2)),
      mealType,
    };

    setMeals((prev) => [...prev, meal]);
    setTotalCalories((prev) => prev + calories);
    setFoodData(null);
    setQuery("");
    setAmount(100);
    setUnit("g");
    setAlerts([]);
    setRecommendations([]);
  };
  const handleSubmitLog = async () => {
    const userId = localStorage.getItem("userId");

    const payload = {
      userId,
      date: new Date().toISOString().split("T")[0],
      meals,
      totalCalories: parseFloat(totalCalories.toFixed(2)),
      calorieGoal,
    };

    try {
      const response = await axios.post(
        "https://fitsync-ttq9.onrender.com/log",
        payload
      );
      if (response.status === 200 || response.status === 201) {
        alert("Meal log saved successfully!");
        setMeals([]);
        setTotalCalories(0);
      } else {
        alert("Unexpected response from server.");
        console.error("Server response:", response);
      }
    } catch (err) {
      console.error("Axios error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save log.");
    }
  };

  const progress = Math.min((totalCalories / calorieGoal) * 100, 100);

  return (
    <div className="p-2 w-full text-gray-800">
      <h2 className="text-4xl text-center text-green-600 mb-4">
        Daily Nutrition Tracker
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Take charge of your health by tracking your meals, monitoring your
        nutrition, and achieving your daily calorie goals effortlessly!
      </p>
      <form onSubmit={handleSearch} className="flex flex-col gap-3 mb-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="e.g. Milk, Banana"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 flex-1 rounded"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-24 rounded"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="g">g</option>``
            <option value="ml">ml</option>
            <option value="oz">oz</option>
          </select>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="morning">Morning</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {alerts.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-3">
          {alerts.map((a, i) => (
            <p key={i}>⚠️ {a}</p>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-3">
          {recommendations.map((r, i) => (
            <p key={i}>💡 {r}</p>
          ))}
        </div>
      )}

      {foodData && (
        <div className="bg-gray-100 p-4 rounded shadow mb-3">
          <h3 className="font-semibold text-lg mb-2">{foodData.description}</h3>
          <ul className="list-disc ml-5">
            {foodData.foodNutrients.map((nutrient, i) => {
              const scaled = (nutrient.value * amount) / 100;
              return (
                <li key={i}>
                  {nutrient.nutrientName}: {scaled.toFixed(2)}{" "}
                  {nutrient.unitName}
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleAddToMeal}
            className="mt-3 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Add to {mealType}
          </button>
        </div>
      )}

      {meals.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-lg mb-2">📋 Today&apos;s Meals</h4>
          <ul className="list-disc ml-5 space-y-1">
            {meals.map((meal, idx) => (
              <li key={idx}>
                <strong>{meal.mealType}:</strong> {meal.foodName} -{" "}
                {meal.calories} kcal, {meal.protein}g protein
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <h4 className=" mb-1"> Calorie Progress</h4>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1">
          {Math.round(totalCalories)} / {calorieGoal} kcal
        </p>
      </div>
      <p className="text-center  mb-2">
        Click the save button to securely log your daily meals and track your
        progress effortlessly.
      </p>
      <button
        onClick={handleSubmitLog}
        className="bg-purple-600 my-2 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        💾 Save Today&apos;s Log
      </button>

      <LoggedMealsSection />
    </div>
  );
};

export default FoodSearch;
