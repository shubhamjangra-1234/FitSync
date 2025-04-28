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

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/features" className="hover:underline">Features</Link></li>
              <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
              <li><Link to="/testimonials" className="hover:underline">Testimonials</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/careers" className="hover:underline">Careers</Link></li>
              <li><Link to="/blog" className="hover:underline">Blog</Link></li>
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
