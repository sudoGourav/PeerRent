import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CardSkeletonGrid from "../components/CardSkeletonGrid";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import ImageWithFallback from "../components/ImageWithFallback";

import {
  getMyItems,
  deleteItem,
} from "../services/item.service";

export default function MyItems() {
  const [items, setItems] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        const res = await getMyItems();

        if (!isMounted) return;

        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load items:", err);

        if (isMounted) {
          toast.error(
            err.response?.data?.message ||
              "Failed to load your items."
          );
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const openDeleteModal = (id) => {
    if (deleteLoading) return;

    setSelectedItemId(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const handleDelete = async () => {
    if (!selectedItemId || deleteLoading) return;

    try {
      setDeleteLoading(selectedItemId);

      await deleteItem(selectedItemId);

      setItems((prev) =>
        prev.filter((item) => item.id !== selectedItemId)
      );

      toast.success("Item deleted successfully!");

      setIsModalOpen(false);
      setSelectedItemId(null);
    } catch (err) {
      console.error("Failed to delete item:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete item."
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  if (pageLoading) {
    return <CardSkeletonGrid />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No Items Listed"
        description="Start earning by listing your first rental item."
        buttonText="List Your First Item"
        buttonLink="/create-item"
      />
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        loading={deleteLoading !== null}
      />

      <div>
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold sm:text-4xl">
            My Items
          </h1>

          <Link
            to="/create-item"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            + New Item
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border bg-white shadow transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="h-56 overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={item.imageUrl || ""}
                  alt={item.title || "Rental Item"}
                  className="h-full w-full object-cover"
                  fallbackIcon={
                    item.category?.icon || "📦"
                  }
                />
              </div>

              <div className="p-5">
                <h2 className="line-clamp-1 text-xl font-semibold">
                  {item.title || "Untitled Item"}
                </h2>

                <p className="mt-2 line-clamp-2 text-gray-600">
                  {item.description ||
                    "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-bold text-blue-600">
                    ₹
                    {Number(
                      item.dailyRate || 0
                    ).toLocaleString("en-IN")}
                    /day
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium sm:text-sm">
                    {item.category?.name ||
                      "Uncategorized"}
                  </span>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={`/items/${item.id}`}
                    className="flex-1 rounded-lg bg-blue-600 py-2 text-center font-medium text-white transition hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => {
                      if (!deleteLoading) {
                        navigate(
                          `/edit-item/${item.id}`
                        );
                      }
                    }}
                    disabled={deleteLoading !== null}
                    className="flex-1 rounded-lg bg-yellow-500 py-2 font-medium text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      openDeleteModal(item.id)
                    }
                    disabled={
                      deleteLoading === item.id
                    }
                    className="flex-1 rounded-lg bg-red-500 py-2 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {deleteLoading === item.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}