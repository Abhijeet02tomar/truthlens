import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HuntAI - AI Deepfake Detector | Enterprise Media Verification",
  description: "Enterprise-grade AI-powered deepfake detection. Verify the authenticity of images and videos using state-of-the-art NVIDIA Vision AI models. Fast, accurate, and secure.",
  keywords: ["deepfake detection", "AI verification", "media authenticity", "NVIDIA AI", "image analysis", "video verification"],
  authors: [{ name: "HuntAI Team" }],
  openGraph: {
    title: "HuntAI - AI Deepfake Detector",
    description: "Enterprise-grade AI-powered deepfake detection using NVIDIA Vision AI",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
