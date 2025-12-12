import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-busy="true"
      aria-label="Carregando..."
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full">
      <Skeleton variant="rectangular" height="100%" className="aspect-[4/5]" />
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <Skeleton variant="text" width="40%" height={12} />
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="100%" height={20} />
        <div className="mt-auto space-y-2">
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={14} />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="text" width={120} height={20} className="mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={500} className="rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} variant="rectangular" height={100} className="rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton variant="text" width="80%" height={36} />
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="rectangular" width="100%" height={120} className="rounded-xl" />
          <Skeleton variant="text" width="100%" height={100} />
          <div className="flex gap-4">
            <Skeleton variant="rectangular" width={120} height={48} className="rounded-lg" />
            <Skeleton variant="rectangular" width="100%" height={48} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

















