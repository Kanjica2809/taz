
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.apartments, path: "/apartments" },
    { name: t.nav.contact, path: "/contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);
  
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/80 backdrop-blur-lg py-3 shadow-md" : "bg-transparent py-5")}>
      <nav className="container flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img 
              src="/lovable-uploads/d36fc446-7f39-48c7-b1a2-3e77fd484949.png" 
              alt="GF Temporadas" 
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map(link => <li key={link.name} className="relative">
              <Link to={link.path} className="font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                {link.name}
              </Link>
            </li>)}
        </ul>

        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" className="border-sea/30 text-sea hover:bg-sea hover:text-white">
                <Link to="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  Minha Conta
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={logout}
                className="border-sea/30 text-sea hover:bg-sea hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild className="bg-sea hover:bg-sea-dark text-white">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-sea hover:bg-sea-dark text-white">
                <Link to="/register">Cadastrar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="android-touch rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu - Android Optimized */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 md:hidden">
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto">
            <div className="p-6 pb-safe-area-inset-bottom">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Menu</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="android-touch rounded-lg"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <div className="space-y-2 mb-8">
                {navLinks.map(link => 
                  <Link
                    key={link.name}
                    to={link.path} 
                    className="block text-lg font-medium transition-colors hover:text-primary py-4 px-5 rounded-xl hover:bg-gray-50 android-touch" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-3">
                  <Button asChild className="w-full bg-sea hover:bg-sea-dark text-white android-touch text-base rounded-xl">
                    <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Minha Conta
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-sea/30 text-sea hover:bg-sea hover:text-white android-touch text-base rounded-xl"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button asChild className="w-full bg-sea hover:bg-sea-dark text-white android-touch text-base rounded-xl">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-sea hover:bg-sea-dark text-white android-touch text-base rounded-xl">
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      Cadastrar
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>;
}
