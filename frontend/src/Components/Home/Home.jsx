import React from "react";

export default function Home() {
  const [review, setReview] = React.useState("");

  React.useEffect(() => {
    const reviews = [
      "FitSync helped me lose 30 pounds and maintain a healthy lifestyle. I feel more energetic and confident!",
      "Thanks to FitSync, I can easily track my meals and stay on top of my fitness goals.",
      "The meal reminders and calorie tracking features are game changers for my health journey.",
      "I've never felt more in control of my nutrition and fitness. FitSync is amazing!",
      "FitSync's insights have helped me make smarter food choices and stay motivated.",
    ];
    const reviewInterval = setInterval(() => {
      setReview(reviews[Math.floor(Math.random() * reviews.length)]);
    }, 1000);
    return () => clearInterval(reviewInterval);
  }, []);

  return (
    <div className=" p-2 min-h-screen">
      {/* Hero Section */}
        <h1 className="p-2 bg-green-300 rounded-md shadow-sm shadow-zinc-500 text-center " >Let food be your medicine and medicine be your food. – Hippocrates</h1>
      <div className=" rounded-2xl text-center flex flex-col md:flex-row items-center justify-center md:text-left px-6 gap-2 py-4">
        <div className="md:text-left md:w-1/2 pb-10">
          <h1 className="text-3xl text-green-600 mb-4">Meet FitSync</h1>
          <h2 className="text-5xl text-blue-700 font-semibold my-8">
            Track Your Health & Nutrition
          </h2>
          <p className="text-gray-700 text-xl sm:text-2xl mb-6">
            Monitor your daily calorie intake, set health goals, and get meal
            reminders to stay on track.
          </p>
          {/* Get Started */}
          <a
            href="/signup"
            className="bg-linear-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-3xl shadow-lg hover:scale-x-95 duration-300"
          >
            Start Today
          </a>
        </div>
        <div className="hidden md:flex justify-center h-96 overflow-hidden md:w-1/3 p-8">
          <img
            src="https://imgs.search.brave.com/EIyZ8M0zvwm8XcsUqsPA8doPwcPCNL95E36f-9xC9UE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Zm9vZGZvcmZpdG5l/c3MuY28udWsvd3At/Y29udGVudC91cGxv/YWRzLzIwMjMvMDgv/YXBwX2ltYWdlXzMy/MC53ZWJw"
            alt="Track Calories"
            className="full rounded-md"
          />
        </div>
      </div>
      {/* Overview Section */}
      <div className=" mt-5 text-center text-gray-800">
        <h2 className="p-1 text-5xl font-mono text-blue-700 mb-4">
          Hit Your Goals In Just 1-2-3
        </h2>
        <p className="text-lg  mb-6">
          Our platform helps you track your daily calories, monitor your diet,
          and stay healthy effortlessly.
        </p>
        <div className="flex p-2 flex-col md:flex-col justify-center items-center">
          <div className="flex flex-col md:flex-row items-center">
            <div className=" flex justify-center md:w-1/2 p-4">
                <img
                  src="/Images/ss.png"
                  className=" w-1/2 object-cover rounded-md"
                />
            </div>
            <div className="w-full flex-col text-start justify-center md:w-1/2 p-4">
              <h3 className="text-6xl my-4 text-blue-700">1</h3>
              <h3 className="text-3xl font-mono my-4">
                Track food, fitness & fasting
              </h3>
              <p className="mt-2 text-lg">
                Tracking calories and macros is easy with our barcode scanner
                and device integration.
              </p>
            </div>
          </div>

          <div className="flex p-2 flex-col md:flex-row items-center">
          <div className="w-full flex justify-center md:w-1/2 p-4">
                <img
                  src="/Images/track.png"
                  className="w-1/2 object-cover rounded-md"
                />
            </div>
            <div className="w-full flex-col text-start justify-center md:w-1/2 p-4">
              <h3 className="text-6xl my-2 text-blue-700">2</h3>
              <h3 className="text-3xl my-2 font-mono">Learn what works</h3>
              <p className="mt-2 text-lg">
                Personalized nutrition insights reveal what&apos;s working so
                you can make smarter choices
              </p>
            </div>
           
          </div>

          <div className="flex p-2 flex-col md:flex-row items-center">
            <div className="w-full flex justify-center md:w-1/2 p-4">
                <img
                  src=
                  "/Images/3.png"
                  className="w-1/2 object-cover rounded-md"
                />
            </div>
            <div className="w-full flex-col text-start justify-center md:w-1/2 p-4">
              <h3 className="text-6xl my-2 text-blue-700">3</h3>
              <h3 className="text-3xl my-2 font-mono">
                Track and Save your daily progress
              </h3>
              <p className="mt-2 text-lg">
                Now you have the tools and knowledge to track your healthy habits for
                life and stay fit
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Banner Section */}
      <div className="bg-green-500 text-white text-center py-20 mt-10 rounded-lg shadow-lg">
        <h2 className="text-4xl font-mono mb-4">
          We Track Almost All Kinds of Food Items
        </h2>
        <p className="text-lg">
          Get detailed nutritional information and insights for a wide variety
          of food items.
        </p>
      </div>
      {/* Proof of Work Section */}
      <div className="p-2  mt-10 text-center  text-gray-800">
        <h2 className=" font-bold text-center text-5xl font-mono text-blue-700 mb-4">
          Nutrition tracking works, here&apos;s the proof
        </h2>
        <p className="text-lg mb-6">
          See how FitSync has helped countless individuals achieve their health
          goals and transform their lives.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="w-72 p-4 bg-white flex flex-wrap justify-between items-center gap-2 rounded-lg shadow-md">
            <div>
              <img
                className="w-full h-full"
                src="https://www.myfitnesspal.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsuccess-users-right.e843aecc.png&w=1920&q=75"
              />
            </div>
          </div>
          <div className="w-80 p-4 bg-white rounded-lg shadow-md">
            <p className="text-gray-900 font-serif">{review}</p>
          </div>
          <div className="w-72 p-4 bg-white flex flex-wrap justify-between items-center gap-2 rounded-lg shadow-md">
            <div>
              <img
                className="w-full h-full"
                src="https://www.myfitnesspal.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsuccess-users-left-desktop.e9cc5aaf.png&w=1920&q=75"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className=" mt-10 text-center text-gray-800">
        <p className="text-sm mb-6 bg-green-500 text-white p-2 rounded-md">
          At FitSync, we are dedicated to helping you achieve your health and
          fitness goals. Our platform offers comprehensive tools for tracking
          your daily calorie intake, monitoring your diet, and setting
          personalized health goals. With features like meal reminders,
          nutrition insights, and fitness tracking, we make it easy for you to
          stay on track and make informed decisions about your health. Join us
          on a journey to a healthier, happier you!
        </p>
      </div>
    </div>
  );
}
