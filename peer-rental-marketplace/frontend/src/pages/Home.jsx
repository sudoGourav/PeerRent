import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getItems } from "../services/item.service";
import { getCategories } from "../services/category.service";

import ItemCard from "../components/ItemCard";
import CardSkeletonGrid from "../components/CardSkeletonGrid";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [itemsRes, categoriesRes] = await Promise.all([
          getItems(),
          getCategories(),
        ]);

        if (!isMounted) return;

        setItems(
          Array.isArray(itemsRes?.data?.items)
            ? itemsRes.data.items
            : []
        );

        setCategories(
          Array.isArray(categoriesRes?.data)
            ? categoriesRes.data
            : []
        );
      } catch (err) {
        console.error("Failed to load homepage data:", err);

        if (isMounted) {
          toast.error(
            err.response?.data?.message ||
              "Failed to load items."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return items;

    return items.filter((item) =>
      (item.title || "")
        .toLowerCase()
        .includes(keyword)
    );
  }, [items, search]);

  if (loading) {
    return <CardSkeletonGrid />;
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
          className="mt-8 w-full rounded-lg border-none p-4 text-black outline-none ring-0 focus:ring-2 focus:ring-white md:w-96"
        />
      </section>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No Items Found"
          description="Try changing your search keyword or browse all available rental items."
          buttonText={
            search.trim()
              ? "Clear Search"
              : undefined
          }
          onButtonClick={() => setSearch("")}
        />
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