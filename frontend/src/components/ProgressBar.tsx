import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake progress animation that slows down as it approaches 95%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
