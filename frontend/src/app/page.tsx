"use client";

import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import AnimatedBackground from "@/components/AnimatedBackground";
import UploadDropzone from "@/components/UploadDropzone";
import ProgressBar from "@/components/ProgressBar";
import EnhancedResultDashboard from "@/components/EnhancedResultDashboard";
import FeaturesSection from "@/components/FeaturesSection";
import TechnologySection from "@/components/TechnologySection";
import ScanHistoryDashboard from "@/components/ScanHistoryDashboard";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowDown,
  Play,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export interface ScanResult {
  id: string;
  timestamp: Date;
  fileName: string;
  fileType: "image" | "video";
  fileSize: number;
  result: {
    type: "image" | "video";
    ai_probability: number;
    real_probability: number;
    verdict: string;
  };
  thumbnail?: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollY, setScrollY] = useState(0);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const homeRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const technologyRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Load scan history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("truthlens-scan-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScanHistory(parsed.map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) })));
      } catch (e) {
        console.error("Failed to parse scan history");
      }
    }
  }, []);

  // Save scan history to localStorage
  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem("truthlens-scan-history", JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Update active section based on scroll position
      const sections = [
        { id: "home", ref: homeRef },
        { id: "features", ref: featuresRef },
        { id: "technology", ref: technologyRef },
        { id: "dashboard", ref: dashboardRef },
      ];

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      home: homeRef,
      features: featuresRef,
      technology: technologyRef,
      dashboard: dashboardRef,
    };

    refs[section]?.current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(section);
  };

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("media", uploadedFile);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/detect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Detection failed");
      }

      const data = await response.json();
      setResult(data);

      // Generate thumbnail for images
      let thumbnail: string | undefined;
      if (uploadedFile.type.startsWith("image/")) {
        thumbnail = URL.createObjectURL(uploadedFile);
      }

      // Add to scan history
      const newScan: ScanResult = {
        id: `scan-${Date.now()}`,
        timestamp: new Date(),
        fileName: uploadedFile.name,
        fileType: data.type,
        fileSize: uploadedFile.size,
        result: data,
        thumbnail,
      };

      setScanHistory((prev) => [newScan, ...prev].slice(0, 50)); // Keep last 50 scans
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem("truthlens-scan-history");
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground scrollY={scrollY} />
      <Navigation 
        activeSection={activeSection} 
        onNavigate={handleNavigate}
        scanCount={scanHistory.length}
      />

      {/* Hero Section */}
      <section ref={homeRef} id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full flex flex-col items-center">
          {/* Hero Badge */}
          <div className="animate-fade-in-up mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-sm text-[var(--color-primary)] font-medium">
                Powered by NVIDIA Vision AI
              </span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--color-primary)] rounded-2xl blur-2xl opacity-30" />
                <div className="relative p-5 bg-[var(--color-primary)]/20 rounded-2xl glass-panel">
                  <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-[var(--color-primary)]" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-[var(--color-foreground)] text-balance">
              Detect Deepfakes with
              <span className="block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-transparent bg-clip-text">
                AI Precision
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-muted)] max-w-2xl mx-auto leading-relaxed text-pretty">
              Enterprise-grade media verification powered by NVIDIA Vision AI. 
              Upload any image or video to instantly verify its authenticity with detailed analysis.
            </p>
          </div>

          {/* Upload Section */}
          <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {!file && !isProcessing && !result && (
              <UploadDropzone onUpload={handleUpload} />
            )}

            {isProcessing && (
              <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full text-center animate-scale-in">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-[var(--color-surface-elevated)]" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)] animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-[var(--color-foreground)]">
                  Analyzing Media...
                </h2>
                <p className="text-[var(--color-muted)] mb-8">
                  Scanning for AI-generated artifacts and deepfake signatures
                </p>
                <ProgressBar />
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-[var(--color-muted)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                    Feature Extraction
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                    AI Analysis
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="glass-panel border border-[var(--color-danger)]/30 rounded-3xl p-8 text-center animate-scale-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-danger)]/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />
                </div>
                <div className="text-[var(--color-danger)] text-xl font-semibold mb-4">Scan Failed</div>
                <p className="text-[var(--color-muted)] mb-6">{error}</p>
                <button
                  onClick={reset}
                  className="px-6 py-3 rounded-xl bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface)] border border-[var(--color-glass-border)] transition-colors text-[var(--color-foreground)]"
                >
                  Try Again
                </button>
              </div>
            )}

            {result && !isProcessing && file && (
              <EnhancedResultDashboard result={result} file={file} onReset={reset} />
            )}
          </div>

          {/* Scroll Indicator */}
          {!file && !isProcessing && !result && (
            <div className="mt-16 animate-bounce">
              <button 
                onClick={() => handleNavigate("features")}
                className="flex flex-col items-center gap-2 text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <span className="text-sm">Explore Features</span>
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* Technology Section */}
      <div ref={technologyRef}>
        <TechnologySection />
      </div>

      {/* Dashboard Section */}
      <div ref={dashboardRef}>
        <ScanHistoryDashboard 
          scanHistory={scanHistory} 
          onClearHistory={clearHistory}
          onSelectScan={(scan) => {
            setResult(scan.result);
            setFile(new File([], scan.fileName));
            handleNavigate("home");
          }}
        />
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--color-glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[var(--color-primary)]" />
              <span className="text-[var(--color-foreground)] font-semibold">TruthLens</span>
            </div>
            <p className="text-sm text-[var(--color-muted)]">
              Enterprise AI Deepfake Detection. Powered by NVIDIA Vision AI.
            </p>
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
              <span>Privacy First</span>
              <span>|</span>
              <span>Secure Processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
