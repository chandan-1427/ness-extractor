import React, { useState, useEffect } from 'react';
import { Menu, X, UserPlus, LogIn, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check authentication status (usually from a Context or State)
  const isAuthenticated = !!localStorage.getItem('accessToken');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    toast.success("Identity dissociated. Vault locked.");
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#121212]/80 backdrop-blur-xl border-b border-white/5 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Dynamic Logo Redirection */}
          <Link 
            to={isAuthenticated ? "/dashboard" : "/"} 
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center transition-transform">
              <span className="text-[#121212] font-black text-xs">N</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">
              NESS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              /* Authenticated View: Logout Only */
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="text-zinc-400 hover:text-white hover:bg-white/5 font-mono text-xs"
              >
                <LogOut className="mr-2 h-4 w-4" />
                TERMINATE_SESSION
              </Button>
            ) : (
              /* New User View: Login & Register */
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white font-medium">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-white text-black hover:bg-zinc-200 font-bold px-6 rounded-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Ness
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        className={`md:hidden absolute w-full bg-[#121212] border-b border-white/5 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 space-y-4">
          {isAuthenticated ? (
            <Button 
              onClick={handleLogout}
              className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white py-6"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout of Vault
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg py-6 text-zinc-300">
                  <LogIn className="mr-4 h-5 w-5" />
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-white text-black py-6 text-lg font-bold">
                  <UserPlus className="mr-4 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;