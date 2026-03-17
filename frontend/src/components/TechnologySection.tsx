"use client";

import { 
  Cpu, 
  Server, 
  Database, 
  Code2,
  Layers,
  GitBranch,
  Box,
  Workflow
} from "lucide-react";

const technologies = [
  {
    category: "AI & Machine Learning",
    icon: Cpu,
    items: [
      { name: "NVIDIA Vision AI", description: "Meta Llama 3.2 90B Vision Model" },
      { name: "Deep Learning", description: "Multi-layer artifact detection" },
      { name: "Computer Vision", description: "Advanced image analysis" },
    ],
  },
  {
    category: "Backend Infrastructure",
    icon: Server,
    items: [
      { name: "Node.js", description: "High-performance runtime" },
      { name: "Express.js", description: "RESTful API framework" },
      { name: "FFmpeg", description: "Video frame extraction" },
    ],
  },
  {
    category: "Frontend Stack",
    icon: Code2,
    items: [
      { name: "Next.js 16", description: "React framework with SSR" },
      { name: "TypeScript", description: "Type-safe development" },
      { name: "Tailwind CSS", description: "Utility-first styling" },
    ],
  },
  {
    category: "Processing Pipeline",
    icon: Workflow,
    items: [
      { name: "Multer", description: "File upload handling" },
      { name: "Sharp", description: "Image processing" },
      { name: "Axios", description: "HTTP client for APIs" },
    ],
  },
];

const techBadges = [
  "NVIDIA API", "React 19", "Next.js 16", "TypeScript", "Tailwind CSS", 
  "Node.js", "Express", "FFmpeg", "Multer", "Axios", "Llama Vision"
];

export default function TechnologySection() {
  return (
    <section id="technology" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 rounded-full mb-6">
            <Layers className="w-4 h-4 text-[var(--color-secondary)]" />
            <span className="text-sm text-[var(--color-secondary)] font-medium">Tech Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] mb-6 text-balance">
            Built With Modern Technology
          </h2>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto text-pretty">
            TruthLens leverages cutting-edge AI models and modern web technologies to deliver fast, accurate, and reliable deepfake detection.
          </p>
        </div>

        {/* Technology Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {techBadges.map((badge) => (
            <span
              key={badge}
              className="tech-badge px-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-glass-border)] rounded-full text-sm text-[var(--color-foreground)] cursor-default"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technologies.map((tech, index) => (
            <div
              key={tech.category}
              className="glass-panel rounded-2xl p-6 sm:p-8"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center">
                  <tech.icon className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                  {tech.category}
                </h3>
              </div>
              <div className="space-y-4">
                {tech.items.map((item) => (
                  <div key={item.name} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-[var(--color-foreground)] font-medium">
                        {item.name}
                      </div>
                      <div className="text-sm text-[var(--color-muted)]">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="mt-16 glass-panel rounded-2xl p-8 sm:p-12">
          <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-8 text-center">
            Detection Pipeline Architecture
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: Box, label: "Media Upload", color: "var(--color-primary)" },
              { icon: GitBranch, label: "Frame Extraction", color: "var(--color-secondary)" },
              { icon: Cpu, label: "AI Analysis", color: "var(--color-accent)" },
              { icon: Database, label: "Result Generation", color: "var(--color-success)" },
            ].map((step, index) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  </div>
                  <span className="text-sm text-[var(--color-muted)] text-center">
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className="hidden sm:block w-12 h-0.5 bg-[var(--color-glass-border)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
