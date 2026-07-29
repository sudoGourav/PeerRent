import CardSkeleton from "./CardSkeleton";

export default function CardSkeletonGrid({
  count = 6,
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map(
        (_, index) => (
          <CardSkeleton key={index} />
        )
      )}
    </div>
  );
}