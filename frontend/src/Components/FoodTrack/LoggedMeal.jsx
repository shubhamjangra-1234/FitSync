import { useEffect, useState } from "react";
import axios from "axios";

const LoggedMealsSection = () => {
  const [loggedMeals, setLoggedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [calorieGoal, setCalorieGoal] = useState(0);

  const fetchLoggedMeals = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("User ID not found in localStorage.");
        setLoggedMeals([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(`https://fitsync-ttq9.onrender.com/user/${userId}`);

      if (res.status === 200 && res.data?.logs) {
        setLoggedMeals(res.data.logs);
        setUser(res.data.user);
        setCalorieGoal(res.data.user?.goalCalories || 0);

        // Assuming API returns { logs: [...] }
      } else {
        console.warn("Unexpected response format:", res.data);
        setLoggedMeals([]);
        setCalorieGoal(0);
      }
    } catch (err) {
      console.error(
        "Error fetching logged meals:",
        err.response?.data || err.message
      );
      setCalorieGoal("");
      setLoggedMeals([]); // Ensure state is cleared on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedMeals();
  }, []);

  return (
    <div className="p-2 min-h-screen">
      <h2 className="text-2xl  text-center  mb-4 text-gray-800">
        📋 Your Logged Meals
      </h2>

      {user && (
        <div className="mb-6 p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg text-center text-blue-800">
            🎯 Your Calorie Goal:<strong> {calorieGoal}</strong> kcal
          </h3>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : loggedMeals.length === 0 ? (
        <p>No meal logs found.</p>
      ) : (
        <div className="space-y-6">
          {loggedMeals.map((log, index) => (
            <div
              key={log._id || index}
              className="bg-white p-4 rounded-xl shadow-sm shadow-zinc-500"
            >
              <h3 className="text-lg mb-5 border-b border-blue-600 p font-semibold text-blue-600">
                📅 Date: {log.date}
              </h3>
              <p className="">
                Total Calories: <strong>{log.totalCalories}</strong>
              </p>
              <p>
                Calorie Goal: <strong>{calorieGoal}</strong>
              </p>

              <div className="mt-3">
                <h4 className="font-semibold text-blue-700 mb-5 p border-b border-blue-700">
                  🍽 Meals:
                </h4>
                <ul className="list-disc ml-6">
                  {log.meals.map((meal, idx) => (
                    <li key={idx} className="mt-1">
                      <span className="text-zinc-700">
                        <strong>{meal.foodName}</strong> — {meal.calories} kcal,{" "}
                        {meal.protein}g protein
                      </span>

                      <span className="text-sm text-gray-500">
                        {" "}
                        ({meal.mealType})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoggedMealsSection;
