
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Calculate parallax effect
  const backgroundY = scrollY * 0.5;
  const contentY = scrollY * 0.2;
  
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/6f9c7f8e-77c4-4ece-9ff3-79bbf5dda6d5.png')`,
          transform: `translateY(${backgroundY}px)`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundAttachment: 'scroll',
          imageRendering: 'crisp-edges' as any,
          filter: 'none',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          willChange: 'transform'
        } as React.CSSProperties}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      
      {/* Content */}
      <div
        className="relative h-full flex flex-col justify-center items-center text-center px-4"
        style={{ transform: `translateY(${contentY}px)` }}
      >
        <div className="max-w-3xl animate-fade-in">
          <span className="inline-block text-white/90 text-lg mb-4 tracking-wide border-b border-white/30 pb-2">
            {t.hero.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t.hero.title}
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {t.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="hero" size="lg" className="min-w-[200px] rounded-xl transform transition-all duration-200 hover:translate-y-[-2px] android-touch">
              <Link to="/apartments">{t.hero.exploreApartments}</Link>
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
}
