"use client";

import { 
  History, 
  Trash2, 
  FileImage, 
  FileVideo, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  HardDrive,
  TrendingUp,
  TrendingDown,
  Eye,
  ChevronRight,
  BarChart3,
  Shield
} from "lucide-react";
import { ScanResult } from "@/app/page";

interface ScanHistoryDashboardProps {
  scanHistory: ScanResult[];
  onClearHistory: () => void;
  onSelectScan: (scan: ScanResult) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function ScanHistoryDashboard({ 
  scanHistory, 
  onClearHistory,
  onSelectScan 
}: ScanHistoryDashboardProps) {
  const totalScans = scanHistory.length;
  const aiDetectedCount = scanHistory.filter(s => s.result.ai_probability > 0.5).length;
  const realContentCount = totalScans - aiDetectedCount;
  const avgConfidence = totalScans > 0 
    ? scanHistory.reduce((acc, s) => acc + Math.max(s.result.ai_probability, s.result.real_probability), 0) / totalScans * 100
    : 0;

  const stats = [
    { 
      label: "Total Scans", 
      value: totalScans.toString(), 
      icon: BarChart3, 
      color: "var(--color-primary)" 
    },
    { 
      label: "AI Detected", 
      value: aiDetectedCount.toString(), 
      icon: AlertTriangle, 
      color: "var(--color-danger)" 
    },
    { 
      label: "Verified Real", 
      value: realContentCount.toString(), 
      icon: CheckCircle, 
      color: "var(--color-success)" 
    },
    { 
      label: "Avg Confidence", 
      value: `${avgConfidence.toFixed(1)}%`, 
      icon: Shield, 
      color: "var(--color-secondary)" 
    },
  ];

  return (
    <section id="dashboard" className="py-20 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-full mb-4">
              <History className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-sm text-[var(--color-accent)] font-medium">Scan History</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] text-balance">
              Analysis Dashboard
            </h2>
            <p className="text-[var(--color-muted)] mt-2">
              Track and review your previous media scans
            </p>
          </div>
          {totalScans > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="stats-card glass-panel rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* History List */}
        {totalScans === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center">
              <History className="w-10 h-10 text-[var(--color-muted)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
              No Scans Yet
            </h3>
            <p className="text-[var(--color-muted)] max-w-md mx-auto">
              Your scan history will appear here. Upload an image or video to start detecting deepfakes.
            </p>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-glass-border)] flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-foreground)]">Recent Scans</h3>
              <span className="text-sm text-[var(--color-muted)]">{totalScans} total</span>
            </div>
            <div className="divide-y divide-[var(--color-glass-border)] max-h-[500px] overflow-y-auto">
              {scanHistory.map((scan) => {
                const isAi = scan.result.ai_probability > 0.5;
                const confidence = Math.max(scan.result.ai_probability, scan.result.real_probability) * 100;
                
                return (
                  <div
                    key={scan.id}
                    onClick={() => onSelectScan(scan)}
                    className="history-item flex items-center gap-4 px-6 py-4 cursor-pointer"
                  >
                    {/* Thumbnail / Icon */}
                    <div className="flex-shrink-0">
                      {scan.thumbnail ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--color-surface)]">
                          <img 
                            src={scan.thumbnail} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[var(--color-surface-elevated)] flex items-center justify-center">
                          {scan.fileType === "video" ? (
                            <FileVideo className="w-6 h-6 text-[var(--color-muted)]" />
                          ) : (
                            <FileImage className="w-6 h-6 text-[var(--color-muted)]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[var(--color-foreground)] font-medium truncate">
                          {scan.fileName}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          isAi 
                            ? "bg-[var(--color-danger)]/20 text-[var(--color-danger)]" 
                            : "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                        }`}>
                          {isAi ? "AI Detected" : "Likely Real"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {getRelativeTime(scan.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5" />
                          {formatFileSize(scan.fileSize)}
                        </span>
                        <span className="capitalize">{scan.fileType}</span>
                      </div>
                    </div>

                    {/* Confidence */}
                    <div className="flex-shrink-0 text-right hidden sm:block">
                      <div className="flex items-center gap-2">
                        {isAi ? (
                          <TrendingUp className="w-4 h-4 text-[var(--color-danger)]" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-[var(--color-success)]" />
                        )}
                        <span className={`text-lg font-semibold ${
                          isAi ? "text-[var(--color-danger)]" : "text-[var(--color-success)]"
                        }`}>
                          {confidence.toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-muted)]">Confidence</span>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-[var(--color-muted)] flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
