"use client";

import { useState } from "react";
import UploadDropzone from "@/components/UploadDropzone";
import ProgressBar from "@/components/ProgressBar";
import ResultDashboard from "@/components/ResultDashboard";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-4xl w-full z-10 flex flex-col items-center">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-500/20 rounded-2xl glass-panel">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            TruthLens
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            AI Media Detector. Upload an image or video to verify its authenticity using state-of-the-art NVIDIA Vision AI models.
          </p>
        </div>

        <div className="w-full">
          {!file && !isProcessing && !result && (
            <UploadDropzone onUpload={handleUpload} />
          )}

          {isProcessing && (
            <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-2xl mx-auto text-center animate-in fade-in duration-500">
              <h2 className="text-2xl font-semibold mb-6 flex items-center justify-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </span>
                Analyzing Media...
              </h2>
              <p className="text-slate-400 mb-8">
                Extracting features and scanning for AI-generated artifacts using NVIDIA Deepfake detection models.
              </p>
              <ProgressBar />
            </div>
          )}

          {error && (
            <div className="glass-panel border-red-500/30 rounded-3xl p-8 text-center max-w-2xl mx-auto">
              <div className="text-red-400 text-xl font-semibold mb-4">Scan Failed</div>
              <p className="text-slate-300 mb-6">{error}</p>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {result && !isProcessing && file && (
            <ResultDashboard result={result} file={file} onReset={reset} />
          )}
        </div>
      </div>
    </main>
  );
}
