import { AlertTriangle, CheckCircle, RefreshCcw, Info } from "lucide-react";

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

export default function ResultDashboard({ result, file, onReset }: ResultProps) {
  const isAi = result.ai_probability > 0.5;
  const aiPercentage = (result.ai_probability * 100).toFixed(1);
  const realPercentage = (result.real_probability * 100).toFixed(1);

  return (
    <div className="glass-panel rounded-3xl p-8 sm:p-12 w-full max-w-2xl mx-auto animate-in slide-in-from-bottom flex flex-col items-center">
      <div className={`p-4 rounded-full mb-6 ${isAi ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
        {isAi ? <AlertTriangle className="w-16 h-16" /> : <CheckCircle className="w-16 h-16" />}
      </div>
      
      <h2 className="text-3xl font-bold mb-2">
        {result.verdict}
      </h2>
      <p className="text-slate-400 mb-8 flex items-center gap-2">
        <Info className="w-4 h-4" />
        File: {file.name} ({result.type})
      </p>

      <div className="w-full max-w-md bg-slate-800/50 p-6 rounded-2xl mb-8 border border-slate-700">
        <div className="flex justify-between mb-2">
          <span className="text-slate-300 font-medium">AI Generated</span>
          <span className={isAi ? "text-red-400 font-bold" : "text-slate-300"}>{aiPercentage}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 mb-6">
          <div
            className="h-full rounded-full bg-red-500 transition-all duration-1000"
            style={{ width: `${aiPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-slate-300 font-medium">Real Content</span>
          <span className={!isAi ? "text-green-400 font-bold" : "text-slate-300"}>{realPercentage}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-1000"
            style={{ width: `${realPercentage}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-blue-500/25"
      >
        <RefreshCcw className="w-5 h-5" />
        Scan Another File
      </button>
    </div>
  );
}
