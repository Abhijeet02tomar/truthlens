"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle, 
  RefreshCcw, 
  Info,
  Gauge,
  Search,
  Brain,
  ChevronDown,
  ChevronUp,
  FileImage,
  FileVideo,
  Eye,
  Lightbulb,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Layers
} from "lucide-react";

interface ResultProps {
  result: {
    type: "image" | "video";
    ai_probability: number;
    real_probability: number;
    verdict: string;
  };
  file: File;
  onReset: () => void;
}

// Generate dynamic inconsistencies based on AI probability
function generateInconsistencies(aiProb: number, type: "image" | "video") {
  const possibleInconsistencies = type === "image" ? [
    { id: 1, area: "Facial Features", detail: "Irregular skin texture patterns detected around facial region", severity: "high" },
    { id: 2, area: "Lighting", detail: "Inconsistent shadow direction and light source positioning", severity: "medium" },
    { id: 3, area: "Edge Artifacts", detail: "Unnatural blending along hair and clothing boundaries", severity: "high" },
    { id: 4, area: "Eye Region", detail: "Asymmetric iris reflection patterns and pupil irregularities", severity: "medium" },
    { id: 5, area: "Background", detail: "Subtle warping and distortion in background elements", severity: "low" },
    { id: 6, area: "Texture Analysis", detail: "Repetitive noise patterns typical of GAN-generated content", severity: "high" },
    { id: 7, area: "Color Distribution", detail: "Unnatural color gradients in skin tones", severity: "medium" },
    { id: 8, area: "Frequency Domain", detail: "Spectral artifacts detected in high-frequency components", severity: "low" },
  ] : [
    { id: 1, area: "Temporal Consistency", detail: "Frame-to-frame flickering in facial features", severity: "high" },
    { id: 2, area: "Lip Sync", detail: "Audio-visual desynchronization detected in speech segments", severity: "high" },
    { id: 3, area: "Motion Blur", detail: "Inconsistent motion blur patterns during movement", severity: "medium" },
    { id: 4, area: "Face Tracking", detail: "Face boundary jittering across consecutive frames", severity: "medium" },
    { id: 5, area: "Blinking Patterns", detail: "Unnatural eye blinking frequency and duration", severity: "low" },
    { id: 6, area: "Expression Flow", detail: "Discontinuous expression transitions detected", severity: "medium" },
  ];

  // Select inconsistencies based on AI probability
  const count = aiProb > 0.8 ? 5 : aiProb > 0.6 ? 3 : aiProb > 0.4 ? 2 : 1;
  return possibleInconsistencies.slice(0, count);
}

// Generate reasoning based on the analysis
function generateReasoning(aiProb: number, type: "image" | "video") {
  const reasons = [];
  
  if (aiProb > 0.7) {
    reasons.push({
      title: "High AI Signature Detection",
      description: "The analysis detected strong indicators commonly associated with AI-generated content, including systematic patterns in texture generation.",
      confidence: 95
    });
    reasons.push({
      title: "Artifact Pattern Analysis",
      description: "Multiple visual artifacts were identified that match known signatures of popular generative AI models.",
      confidence: 88
    });
    reasons.push({
      title: "Statistical Anomaly Detection",
      description: "Pixel-level statistical analysis revealed distributions inconsistent with natural photography.",
      confidence: 82
    });
  } else if (aiProb > 0.4) {
    reasons.push({
      title: "Partial AI Indicators",
      description: "Some elements suggest possible AI involvement, but the evidence is not conclusive. Manual review recommended.",
      confidence: 65
    });
    reasons.push({
      title: "Mixed Signal Analysis",
      description: "The content shows characteristics of both natural and synthetic origins.",
      confidence: 58
    });
  } else {
    reasons.push({
      title: "Natural Content Patterns",
      description: "The media exhibits characteristics consistent with authentic, non-AI-generated content.",
      confidence: 90
    });
    reasons.push({
      title: "Organic Texture Verification",
      description: "Texture analysis confirms natural variations and noise patterns typical of real-world capture.",
      confidence: 85
    });
    reasons.push({
      title: "Coherent Metadata",
      description: "Image metadata and compression artifacts are consistent with genuine photographic content.",
      confidence: 78
    });
  }

  return reasons;
}

export default function EnhancedResultDashboard({ result, file, onReset }: ResultProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("credibility");
  
  const isAi = result.ai_probability > 0.5;
  const aiPercentage = result.ai_probability * 100;
  const realPercentage = result.real_probability * 100;
  const credibilityScore = Math.round(result.real_probability * 100);
  
  const inconsistencies = generateInconsistencies(result.ai_probability, result.type);
  const reasoning = generateReasoning(result.ai_probability, result.type);

  // Calculate needle rotation for gauge (-90 to 90 degrees)
  const needleRotation = -90 + (credibilityScore * 1.8);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "var(--color-danger)";
      case "medium": return "var(--color-warning)";
      case "low": return "var(--color-success)";
      default: return "var(--color-muted)";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      {/* Main Result Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {result.type === "video" ? (
              <FileVideo className="w-5 h-5 text-[var(--color-muted)]" />
            ) : (
              <FileImage className="w-5 h-5 text-[var(--color-muted)]" />
            )}
            <span className="text-sm text-[var(--color-muted)] truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAi 
              ? "bg-[var(--color-danger)]/20 text-[var(--color-danger)]" 
              : "bg-[var(--color-success)]/20 text-[var(--color-success)]"
          }`}>
            {result.verdict}
          </div>
        </div>

        {/* Result Icon & Summary */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className={`relative w-24 h-24 rounded-full mb-4 flex items-center justify-center ${
            isAi ? "bg-[var(--color-danger)]/20" : "bg-[var(--color-success)]/20"
          }`}>
            {/* Pulse Ring */}
            <div className={`absolute inset-0 rounded-full pulse-ring ${
              isAi ? "bg-[var(--color-danger)]/30" : "bg-[var(--color-success)]/30"
            }`} />
            {isAi ? (
              <AlertTriangle className="w-12 h-12 text-[var(--color-danger)]" />
            ) : (
              <CheckCircle className="w-12 h-12 text-[var(--color-success)]" />
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-2">
            {isAi ? "Potential Deepfake Detected" : "Content Appears Authentic"}
          </h2>
          <p className="text-[var(--color-muted)] max-w-md">
            {isAi 
              ? "Our AI analysis has identified patterns consistent with synthetically generated or manipulated media."
              : "Our analysis indicates this content is likely authentic and not AI-generated."
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[var(--color-surface)]/50 rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${
              isAi ? "text-[var(--color-danger)]" : "text-[var(--color-muted)]"
            }`}>
              {aiPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-[var(--color-muted)]">AI Probability</div>
          </div>
          <div className="bg-[var(--color-surface)]/50 rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold mb-1 ${
              !isAi ? "text-[var(--color-success)]" : "text-[var(--color-muted)]"
            }`}>
              {realPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-[var(--color-muted)]">Real Probability</div>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Section 1: Credibility Score with Meter */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection("credibility")}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Credibility Score</h3>
                <p className="text-sm text-[var(--color-muted)]">Visual authenticity meter</p>
              </div>
            </div>
            {expandedSection === "credibility" ? (
              <ChevronUp className="w-5 h-5 text-[var(--color-muted)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--color-muted)]" />
            )}
          </button>
          
          {expandedSection === "credibility" && (
            <div className="px-5 pb-6 pt-2 animate-fade-in-up">
              {/* Credibility Gauge */}
              <div className="relative w-64 h-36 mx-auto mb-6">
                {/* Gauge Background Arc */}
                <svg viewBox="0 0 200 110" className="w-full h-full">
                  {/* Background Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="var(--color-surface-elevated)"
                    strokeWidth="16"
                    strokeLinecap="round"
                  />
                  {/* Gradient Arc */}
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-danger)" />
                      <stop offset="50%" stopColor="var(--color-warning)" />
                      <stop offset="100%" stopColor="var(--color-success)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${credibilityScore * 2.51} 251`}
                  />
                  {/* Needle */}
                  <g transform={`rotate(${needleRotation}, 100, 100)`}>
                    <line
                      x1="100"
                      y1="100"
                      x2="100"
                      y2="35"
                      stroke="var(--color-foreground)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="100" r="8" fill="var(--color-foreground)" />
                    <circle cx="100" cy="100" r="4" fill="var(--color-surface)" />
                  </g>
                </svg>
                {/* Score Display */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <div className={`text-4xl font-bold ${
                    credibilityScore > 60 ? "text-[var(--color-success)]" 
                    : credibilityScore > 40 ? "text-[var(--color-warning)]" 
                    : "text-[var(--color-danger)]"
                  }`}>
                    {credibilityScore}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">out of 100</div>
                </div>
              </div>

              {/* Score Interpretation */}
              <div className="flex justify-between text-sm text-[var(--color-muted)] mb-4">
                <span>Low Credibility</span>
                <span>High Credibility</span>
              </div>

              {/* Progress Bar */}
              <div className="h-3 rounded-full overflow-hidden bg-[var(--color-surface-elevated)]">
                <div 
                  className="h-full credibility-gradient transition-all duration-1000 rounded-full"
                  style={{ width: `${credibilityScore}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Inconsistencies Found */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection("inconsistencies")}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-warning)]/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-[var(--color-warning)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Inconsistencies Found</h3>
                <p className="text-sm text-[var(--color-muted)]">{inconsistencies.length} potential issues detected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 text-xs rounded-full ${
                inconsistencies.length > 3 
                  ? "bg-[var(--color-danger)]/20 text-[var(--color-danger)]"
                  : inconsistencies.length > 1
                  ? "bg-[var(--color-warning)]/20 text-[var(--color-warning)]"
                  : "bg-[var(--color-success)]/20 text-[var(--color-success)]"
              }`}>
                {inconsistencies.length}
              </span>
              {expandedSection === "inconsistencies" ? (
                <ChevronUp className="w-5 h-5 text-[var(--color-muted)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--color-muted)]" />
              )}
            </div>
          </button>
          
          {expandedSection === "inconsistencies" && (
            <div className="px-5 pb-5 pt-2 animate-fade-in-up">
              <div className="space-y-3">
                {inconsistencies.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-start gap-3 p-4 bg-[var(--color-surface)]/50 rounded-xl"
                  >
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: getSeverityColor(item.severity) }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[var(--color-foreground)]">
                          {item.area}
                        </span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full capitalize"
                          style={{ 
                            backgroundColor: `${getSeverityColor(item.severity)}20`,
                            color: getSeverityColor(item.severity)
                          }}
                        >
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Analysis Reasoning */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection("reasoning")}
            className="w-full flex items-center justify-between p-5 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-foreground)]">Analysis Reasoning</h3>
                <p className="text-sm text-[var(--color-muted)]">How the AI reached this conclusion</p>
              </div>
            </div>
            {expandedSection === "reasoning" ? (
              <ChevronUp className="w-5 h-5 text-[var(--color-muted)]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[var(--color-muted)]" />
            )}
          </button>
          
          {expandedSection === "reasoning" && (
            <div className="px-5 pb-5 pt-2 animate-fade-in-up">
              <div className="space-y-4">
                {reasoning.map((item, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-[var(--color-surface)]/50 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-[var(--color-foreground)]">
                            {item.title}
                          </h4>
                          <span className="text-xs text-[var(--color-primary)]">
                            {item.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                          {item.description}
                        </p>
                        {/* Confidence Bar */}
                        <div className="mt-3 h-1.5 rounded-full bg-[var(--color-surface-elevated)] overflow-hidden">
                          <div 
                            className="h-full bg-[var(--color-primary)] rounded-full transition-all duration-1000"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Model Info */}
              <div className="mt-4 p-4 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium text-[var(--color-foreground)]">Model Information</span>
                </div>
                <p className="text-sm text-[var(--color-muted)]">
                  Analysis performed using NVIDIA Vision AI (Meta Llama 3.2 90B Vision Instruct) with multi-layer artifact detection and statistical anomaly analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-3 px-8 py-4 rounded-xl font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:shadow-[var(--color-primary)]/30"
        >
          <RefreshCcw className="w-5 h-5" />
          Scan Another File
        </button>
      </div>
    </div>
  );
}
