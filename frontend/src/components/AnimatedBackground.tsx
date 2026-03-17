"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedBackgroundProps {
  scrollY: number;
}

export default function AnimatedBackground({ scrollY }: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // Calculate parallax offset based on scroll
  const parallaxOffset = scrollY * 0.3;

  return (
    <div className="animated-bg" ref={containerRef}>
      {/* Planet Image with Parallax */}
      <div 
        className="planet-container"
        style={{ 
          transform: `translateY(${-parallaxOffset}px)`,
        }}
      >
        <img
          src="/planet-bg.jpg"
          alt=""
          className="planet-image"
          style={{
            transform: `translateX(-50%) scale(${1 + scrollY * 0.0002})`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="gradient-overlay" />

      {/* Additional Gradient for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, 
              rgba(2, 8, 23, 0.3) 0%, 
              rgba(2, 8, 23, 0.6) 30%,
              rgba(2, 8, 23, 0.9) 70%,
              rgba(2, 8, 23, 1) 100%
            )
          `,
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.2 + Math.random() * 0.3,
            transform: `translateY(${-parallaxOffset * (0.5 + Math.random() * 0.5)}px)`,
          }}
        />
      ))}

      {/* Scan Lines Effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(59, 130, 246, 0.5) 2px,
            rgba(59, 130, 246, 0.5) 4px
          )`,
        }}
      />

      {/* Vignette Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(2, 8, 23, 0.5) 100%)`,
        }}
      />
    </div>
  );
}
