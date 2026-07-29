import { useEffect, useState } from "react";

import { getItems } from "../services/item.service";
import { getCategories } from "../services/category.service";

import ItemCard from "../components/ItemCard";
import Loader from "../components/Loader";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        getItems(),
        getCategories(),
      ]);

      setItems(itemsRes.data.items || []);

      // Keep for future category filter implementation
      console.log("Categories:", categoriesRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <Loader text="Loading items..." />;
  }

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 rounded-2xl bg-blue-600 px-8 py-14 text-white">
        <h1 className="text-5xl font-bold">
          Rent Anything, Anytime
        </h1>

        <p className="mt-4 text-lg">
          Peer-to-peer rental marketplace for cameras,
          laptops, bikes and more.
        </p>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-8 w-full rounded-lg border-none p-4 text-black md:w-96"
        />
      </section>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            No items found
          </h2>

          <p className="mt-2 text-gray-500">
            Try a different search keyword.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}