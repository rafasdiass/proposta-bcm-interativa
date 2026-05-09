/**
 * SectionSkeleton Component
 *
 * Loading skeleton for sections while they're being lazy loaded
 * Provides visual feedback during component loading
 */
export function SectionSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded-md w-2/3"></div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Button skeleton */}
      <div className="flex justify-center space-x-4 pt-8">
        <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
        <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
      </div>
    </div>
  );
}
