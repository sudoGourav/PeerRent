import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyItems } from "../services/item.service";

export default function MyItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getMyItems();
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">
          You haven't listed any items yet.
        </h2>

        <Link
          to="/create-item"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          List Your First Item
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          My Items
        </h1>

        <Link
          to="/create-item"
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          + New Item
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl border bg-white shadow"
          >
            <div className="h-52 bg-gray-100">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-6xl">
                  {item.category?.icon || "📦"}
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold">
                {item.title}
              </h2>

              <p className="mt-2 line-clamp-2 text-gray-600">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-blue-600">
                  ₹{item.dailyRate}/day
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {item.category?.name}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/items/${item.id}`}
                  className="flex-1 rounded bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
                >
                  View
                </Link>

                <button
                  className="flex-1 rounded bg-yellow-500 py-2 text-white"
                >
                  Edit
                </button>

                <button
                  className="flex-1 rounded bg-red-500 py-2 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}