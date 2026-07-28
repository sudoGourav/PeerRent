import { useEffect, useState } from "react";

import { getItems } from "../services/item.service";
import { getCategories } from "../services/category.service";
import ItemCard from "../components/ItemCard";

export default function Home() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadItems();
    loadCategories();
  }, []);

  const loadItems = async () => {
    try {
      const res = await getItems();
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      console.log("Categories:", res);
    } catch (err) {
      console.error("Category Error:", err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 rounded-2xl bg-blue-600 px-8 py-14 text-white">
        <h1 className="text-5xl font-bold">
          Rent Anything, Anytime
        </h1>

        <p className="mt-4 text-lg">
          Peer-to-peer rental marketplace for
          cameras, laptops, bikes and more.
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}