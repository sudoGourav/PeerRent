import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow transition hover:shadow-lg">
      <div className="mb-4 h-40 overflow-hidden rounded-lg bg-gray-100">
  {item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt={item.title}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-5xl">
      {item.category?.icon || "📦"}
    </div>
  )}
</div>

      <h2 className="text-xl font-semibold">
        {item.title}
      </h2>

      <p className="mt-2 line-clamp-2 text-gray-600">
        {item.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          ₹{item.dailyRate}/day
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          {item.category?.name}
        </span>
      </div>

      <Link to={`/items/${item.id}`}>
        <button className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
}