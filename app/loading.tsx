export default function Loading() {
  return (
    <div className="container py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="card space-y-4">
          <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card">
              <div className="h-16 bg-gray-200 rounded-full w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
