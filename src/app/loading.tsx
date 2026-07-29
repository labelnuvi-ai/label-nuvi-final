export default function Loading() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-6 space-y-12 animate-pulse font-sans">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <div className="h-3 w-32 bg-neutral-200 rounded-full mx-auto" />
        <div className="h-8 w-64 bg-neutral-300 rounded-2xl mx-auto" />
        <div className="h-3 w-48 bg-neutral-200 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white p-4 rounded-3xl border border-neutral-200/80 space-y-4">
            <div className="w-full h-80 bg-neutral-200 rounded-2xl" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded-full" />
            <div className="h-3 w-1/2 bg-neutral-200 rounded-full" />
            <div className="h-4 w-1/3 bg-neutral-300 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
