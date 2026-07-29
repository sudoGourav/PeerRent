export default function ListSkeleton({
  count = 4,
}) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map(
        (_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-6 shadow animate-pulse"
          >
            <div className="h-6 w-1/3 rounded bg-gray-200"></div>

            <div className="mt-5 h-4 w-2/3 rounded bg-gray-200"></div>

            <div className="mt-3 h-4 w-1/2 rounded bg-gray-200"></div>

            <div className="mt-3 h-4 w-1/4 rounded bg-gray-200"></div>

            <div className="mt-6 flex gap-3">
              <div className="h-10 w-36 rounded bg-gray-200"></div>
              <div className="h-10 w-28 rounded bg-gray-200"></div>
            </div>
          </div>
        )
      )}
    </div>
  );
}