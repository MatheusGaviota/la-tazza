import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-accent/10 via-accent/20 to-accent/10 bg-[length:200%_100%]',
    none: '',
  };

  const styles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`bg-accent/10 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={styles}
      role="status"
      aria-label="Carregando conteúdo"
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
