import React from "react";
import { Globe, DollarSign, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-gray-700 text-sm">
        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Safety information
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Cancellation options
              </a>
            </li>
          </ul>
        </div>

        {/* Hosting */}
        <div>
          <h4 className="font-semibold mb-4">Hosting</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Try Hosting
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                AirCover for Hosts
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Hosting responsibly
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Newsroom
              </a>
            </li>
            <li>
              <a href="#" className=" hover:text-[#FF385C] hover:underline">
                Accessibility
              </a>
            </li>
          </ul>
        </div>

        {/* Discover */}
        <div>
          <h4 className="font-semibold mb-4">Discover</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline hover:text-[#FF385C]">
                New features
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#FF385C]">
                Gift Cards
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-[#FF385C]">
                Explore Kashmir stays
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-gray-600 text-sm">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <p>&copy; {currentYear} Stay Finder, Inc.</p>
            <a href="#" className="hover:underline hover:text-[#FF385C] ">
              Privacy
            </a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-[#FF385C]">
              Terms
            </a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-[#FF385C]">
              Sitemap
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            {/* Language */}
            <button className="flex items-center space-x-1 hover:underline">
              <Globe size={16} /> <span>English (IN)</span>
            </button>
            {/* Currency */}
            <button className="flex items-center space-x-1 hover:underline">
              <DollarSign size={16} /> <span>INR</span>
            </button>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-[#FF385C]">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-[#FF385C]">
                <Twitter size={16} />
              </a>
              <a href="#" className="hover:text-[#FF385C]">
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
