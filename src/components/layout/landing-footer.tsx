import { Film } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingFooter() {
  return (
    <footer className="py-16 px-6 border-t border-yellow-200 bg-yellow-50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">FilmCollab</span>
            </div>
            <p className="text-gray-600 mb-6">
              Connecting the global film community to create extraordinary stories together.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/features" className="hover:text-yellow-600 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-yellow-600 transition-colors">Pricing</Link></li>
              <li><Link to="/#community" className="hover:text-yellow-600 transition-colors">Community</Link></li>
              <li><Link to="/about" className="hover:text-yellow-600 transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/contact" className="hover:text-yellow-600 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-yellow-600 transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-yellow-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-yellow-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-600">
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-yellow-600 transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-yellow-200 mt-12 pt-8 text-center">
          <p className="text-gray-600">
            © 2026 FilmCollab. All rights reserved. Made for creators, by creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
