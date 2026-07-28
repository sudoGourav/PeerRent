import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";

export default function ItemCard({ item }) {
  const { wishlistIds, toggleWishlist } = useWishlist();

  const isWishlisted = wishlistIds.includes(item.id);

  const handleWishlist = async () => {
    try {
      await toggleWishlist(item.id);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Wishlist operation failed"
      );
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow transition hover:shadow-lg">
      {/* Image Section */}
      <div className="relative mb-4 h-40 overflow-hidden rounded-lg bg-gray-100">
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-2xl shadow transition hover:scale-110"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

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

      {/* Item Title */}
      <h2 className="text-xl font-semibold">
        {item.title}
      </h2>

      {/* Description */}
      <p className="mt-2 line-clamp-2 text-gray-600">
        {item.description}
      </p>

      {/* Price & Category */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-600">
          ₹{item.dailyRate}/day
        </span>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
          {item.category?.name}
        </span>
      </div>

      {/* View Details */}
      <Link to={`/items/${item.id}`}>
        <button className="mt-5 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700">
          View Details
        </button>
      </Link>
    </div>
  );
}