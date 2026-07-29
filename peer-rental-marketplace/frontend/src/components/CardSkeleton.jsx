export default function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow animate-pulse">
      <div className="h-52 bg-gray-200"></div>

      <div className="p-5">
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>

        <div className="mt-4 h-4 rounded bg-gray-200"></div>
        <div className="mt-2 h-4 w-5/6 rounded bg-gray-200"></div>

        <div className="mt-6 flex justify-between">
          <div className="h-5 w-20 rounded bg-gray-200"></div>
          <div className="h-5 w-16 rounded bg-gray-200"></div>
        </div>

        <div className="mt-6 h-10 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
}