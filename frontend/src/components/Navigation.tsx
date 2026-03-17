"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  Cpu, 
  History, 
  Home,
  Github,
  ChevronDown
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  scanCount: number;
}

export default function Navigation({ activeSection, onNavigate, scanCount }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "features", label: "Features", icon: Sparkles },
    { id: "technology", label: "Technology", icon: Cpu },
    { id: "dashboard", label: "Dashboard", icon: History, badge: scanCount > 0 ? scanCount : undefined },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "glass-panel border-b border-[var(--color-glass-border)]" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate("home")}
          >
            <div className="p-2 bg-[var(--color-primary)]/20 rounded-xl group-hover:bg-[var(--color-primary)]/30 transition-colors">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-[var(--color-foreground)]">
                HuntAI
              </span>
              <span className="text-[10px] sm:text-xs text-[var(--color-muted)] -mt-1">
                AI Deepfake Detector
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-link flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-[var(--color-primary)] text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/Abhijeet02tomar/huntai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30"
            >
              <Sparkles className="w-4 h-4" />
              Start Scan
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-panel-solid rounded-2xl mb-4 p-4 animate-scale-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeSection === item.id
                      ? "text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-surface)]"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-[var(--color-primary)] text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-[var(--color-glass-border)] my-2" />
              <button
                onClick={() => {
                  onNavigate("home");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-primary)] text-white font-medium rounded-xl"
              >
                <Sparkles className="w-4 h-4" />
                Start Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
