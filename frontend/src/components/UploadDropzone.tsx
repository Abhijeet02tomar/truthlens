import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileType, FileVideo, AlertCircle } from "lucide-react";

interface UploadDropzoneProps {
  onUpload: (file: File) => void;
}

export default function UploadDropzone({ onUpload }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov']
    },
    maxSize: 200 * 1024 * 1024, // 200MB
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`glass-panel rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
        isDragActive ? "border-blue-400 bg-blue-500/10 scale-[1.02]" : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
      } ${isDragReject ? "border-red-500 bg-red-500/10" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {isDragReject ? (
          <AlertCircle className="w-16 h-16 text-red-400 mb-2" />
        ) : (
          <UploadCloud className={`w-16 h-16 mb-2 transition-colors ${isDragActive ? "text-blue-400" : "text-slate-400"}`} />
        )}
        
        <p className="text-xl sm:text-2xl font-medium text-slate-200">
          {isDragActive
            ? isDragReject
              ? "File type not supported!"
              : "Drop your file here..."
            : "Drag & drop your media here"}
        </p>
        <p className="text-slate-400">or click to browse from your device</p>
        
        <div className="flex gap-4 mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileType className="w-4 h-4" /> Images: JPG, PNG
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileVideo className="w-4 h-4" /> Videos: MP4, MOV
          </div>
        </div>
        <p className="text-xs text-slate-600 mt-2">Max file size: 200MB</p>
      </div>
    </div>
  );
}
