"use client";

import { 
  Shield, 
  Zap, 
  Eye, 
  Brain, 
  FileVideo, 
  FileImage,
  Lock,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Detection",
    description: "Leverages NVIDIA's advanced vision AI models to analyze media with unprecedented accuracy.",
    color: "var(--color-primary)",
  },
  {
    icon: Eye,
    title: "Deep Analysis",
    description: "Detects subtle artifacts, unnatural lighting, and structural inconsistencies invisible to the human eye.",
    color: "var(--color-secondary)",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Get instant results with our optimized pipeline that processes images and videos in seconds.",
    color: "var(--color-warning)",
  },
  {
    icon: FileVideo,
    title: "Video Support",
    description: "Analyze entire videos frame-by-frame with intelligent sampling for comprehensive detection.",
    color: "var(--color-accent)",
  },
  {
    icon: BarChart3,
    title: "Detailed Reports",
    description: "Receive comprehensive analysis with credibility scores, inconsistency mapping, and reasoning.",
    color: "var(--color-success)",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your media is processed securely and deleted immediately after analysis. No data retention.",
    color: "var(--color-danger)",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-full mb-6">
            <Shield className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-sm text-[var(--color-primary)] font-medium">Enterprise Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-6 text-balance">
            Advanced Detection Capabilities
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto text-pretty">
            Powered by state-of-the-art AI models, TruthLens provides comprehensive media verification with detailed analysis and reporting.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card glass-panel rounded-2xl p-6 sm:p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon 
                  className="w-6 h-6" 
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: "99.2%", label: "Detection Accuracy" },
            { value: "<3s", label: "Average Processing" },
            { value: "50K+", label: "Scans Performed" },
            { value: "24/7", label: "Availability" },
          ].map((stat) => (
            <div key={stat.label} className="stats-card glass-panel rounded-2xl p-6 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
