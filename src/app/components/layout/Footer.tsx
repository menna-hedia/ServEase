import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import logo from "../../components/images/logoWhite.png"
export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <img
    src={logo}
    alt="ServEase"
    className="w-8 h-8 object-contain"
  />
              </div>
              <span className="text-2xl font-bold">ServEase</span>
            </Link>
            <p className="text-white/80">
              Your trusted platform for connecting with professional home service providers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-white/80 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/customer/services" className="block text-white/80 hover:text-white transition-colors">
                Services
              </Link>
              <Link to="/signin" className="block text-white/80 hover:text-white transition-colors">
                Sign In
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">For Providers</h4>
            <div className="space-y-2">
              <Link to="/signup/provider" className="block text-white/80 hover:text-white transition-colors">
                Join as Provider
              </Link>
              <a href="#" className="block text-white/80 hover:text-white transition-colors">
                How it Works
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-5 h-5" />
                <span>support@servease.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-white/60">
          <p>&copy; 2026 ServEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

