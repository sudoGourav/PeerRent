import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import CardSkeletonGrid from "../components/CardSkeletonGrid";
import EmptyState from "../components/EmptyState";
import ImageWithFallback from "../components/ImageWithFallback";

import { getWishlist } from "../services/wishlist.service";
import { useWishlist } from "../context/WishlistContext";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState(null);

  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();
      setItems(res.data);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      setRemoveLoading(itemId);

      await toggleWishlist(itemId);

      setItems((prev) =>
        prev.filter(
          (wishlist) =>
            wishlist.item.id !== itemId
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setRemoveLoading(null);
    }
  };

  if (loading) {
    return <CardSkeletonGrid />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="❤️"
        title="Your wishlist is empty"
        description="Save your favourite rental items here so you can find them quickly later."
        buttonText="Browse Items"
        buttonLink="/"
      />
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        My Wishlist ❤️
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((wishlist) => (
          <div
            key={wishlist.id}
            className="rounded-xl border bg-white p-5 shadow"
          >
            <ImageWithFallback
              src={wishlist.item.imageUrl}
              alt={wishlist.item.title}
              className="mb-4 h-40 w-full rounded-lg object-cover"
              fallbackIcon={
                wishlist.item.category?.icon || "📦"
              }
            />

            <h2 className="text-xl font-semibold">
              {wishlist.item.title}
            </h2>

            <p className="mt-2 line-clamp-2 text-gray-600">
              {wishlist.item.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold text-blue-600">
                ₹{wishlist.item.dailyRate}/day
              </span>

              <button
                onClick={() =>
                  handleRemove(wishlist.item.id)
                }
                disabled={
                  removeLoading ===
                  wishlist.item.id
                }
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {removeLoading ===
                wishlist.item.id
                  ? "Removing..."
                  : "Remove"}
              </button>
            </div>

            <Link
              to={`/items/${wishlist.item.id}`}
              className="mt-4 block rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}