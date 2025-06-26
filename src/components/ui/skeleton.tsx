interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circle' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded h-4"
            style={{
              width: i === lines - 1 ? '60%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  const baseClasses = "animate-pulse bg-gray-200";
  const variantClasses = {
    text: "rounded h-4",
    circle: "rounded-full",
    rectangular: "rounded"
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components for common use cases
export function ChordSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-gray-200">
      <div className="p-6">
        <Skeleton className="mb-2" height={24} />
        <Skeleton className="mb-3" width="60%" height={16} />
        <div className="flex justify-between items-center">
          <Skeleton width={80} height={24} />
          <Skeleton width={60} height={14} />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border-t-4 border-gray-200">
      <div className="p-6 text-center">
        <Skeleton className="mx-auto mb-2" width={80} height={40} />
        <Skeleton className="mx-auto mb-1" width={60} height={20} />
        <Skeleton className="mx-auto" width={100} height={14} />
      </div>
    </div>
  );
}
