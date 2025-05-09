import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="">
      
      
       {/* Footer Section */}
       <footer className="bg-gray-700 text-white p-10 mt-10">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Logo & Call to Action */}
          <div>
            <img src="../../../Images/logo.png" alt="FitSync Logo" className="h-24 mx-auto md:mx-0" />
            <h2 className="text-2xl font-bold mt-3">FitSync</h2>
            <p className="text-gray-200 mt-2">Your personalized health & nutrition tracker.</p>
         
            <a
            href="/signup"
            className="bg-linear-to-r inline-block mt-4 from-green-400 to-green-600 text-white px-6 py-3 rounded-3xl shadow-lg hover:scale-x-95 duration-300"
          >
            Start Today
          </a>
          </div>
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold">Quick LInks</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/Track" className="hover:underline">Tracks</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-300 mt-8">
          <p>© 2025 FitSync. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
