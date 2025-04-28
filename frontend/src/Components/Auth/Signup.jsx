import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
       // Redirect to the /track route after successful registration
      navigate("/track");
    try {
      const response = await axios.post(
        "https://fitsync-ttq9.onrender.com/register",
        formData
      );
      setMessage(response.data?.message || "Registration successful");
      setFormData({ name: "", email: "", number: "" });
      console.log(formData);

   
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-5xl text-center text-green-500 mb-2">FitSync</h1>
      <p className="text-center text-gray-600 mb-6">
        Welcome to FitSync, your ultimate fitness companion. Join us today and
        take the first step toward a healthier, more active lifestyle.
      </p>
      <div className="flex items-center justify-center   ">
        <div className="w-full max-w-md bg-white p-8 rounded-md shadow-md shadow-zinc-500">
          {message && (
            <p className="text-center text-red-500 mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
