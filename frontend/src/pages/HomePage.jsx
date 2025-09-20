import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  


  // Navbar Component
  const Navbar = () => (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/98' : 'bg-white/95'} backdrop-blur-md shadow-lg`}>
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-2xl font-bold text-purple-600 flex items-center gap-2 hover:text-purple-700 transition-colors"
        >
          🍭 Sweet Dreams
        </button>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Features</a>
          <a href="#about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</a>
          <a href="#contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</a>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-full border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-600 hover:text-white transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );

  // Home Page Component
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center text-white px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Welcome to Sweet Dreams
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up animation-delay-200">
            Your premium destination for the finest sweets and confections. Manage your sweet cravings with our comprehensive management system.
          </p>
          <button 
            onClick={() => setCurrentPage('register')}
            className="px-8 py-4 text-lg rounded-full bg-white text-purple-600 font-bold hover:bg-gray-100 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 animate-fade-in-up animation-delay-400"
          >
            Start Your Sweet Journey
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Sweet Dreams?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "🍬", title: "Premium Quality", desc: "We source only the finest ingredients to create sweets that melt in your mouth and create lasting memories." },
              { icon: "📱", title: "Easy Management", desc: "Our intuitive system makes it easy to browse, purchase, and manage your sweet collection with just a few clicks." },
              { icon: "🚀", title: "Fast Delivery", desc: "Get your favorite sweets delivered fresh to your doorstep with our lightning-fast delivery service." },
              { icon: "🛡️", title: "Secure Payments", desc: "Shop with confidence using our secure payment system that protects your financial information." },
              { icon: "🎯", title: "Smart Search", desc: "Find your perfect sweet with our advanced search and filtering system by category, price, and preferences." },
              { icon: "👑", title: "VIP Experience", desc: "Enjoy exclusive access to premium sweets, early releases, and special member-only discounts." }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300 text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Sweet Varieties" },
              { number: "10K+", label: "Happy Customers" },
              { number: "50+", label: "Countries Served" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <div key={index}>
                <h3 className="text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            {['Privacy Policy', 'Terms of Service', 'Support', 'FAQ', 'Contact'].map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p className="text-gray-400">
            © 2024 Sweet Dreams. All rights reserved. Made with ❤️ for sweet lovers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );


  // Main App Render
  return (
    <div className="font-sans">
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'login' && <LoginPage />}
      {currentPage === 'register' && <RegisterPage />}
    </div>
  );
};

export default HomePage;