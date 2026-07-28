import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getItemById } from "../services/item.service";
import { createBooking } from "../services/booking.service";

export default function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadItem();
  }, []);

  const loadItem = async () => {
    try {
      const res = await getItemById(id);
      setItem(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    try {
      await createBooking({
        itemId: item.id,
        startDate,
        endDate,
      });

      alert("Booking Created Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Booking Failed");
    }
  };

  if (!item) {
    return (
      <div className="py-20 text-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image Section */}
        <div className="h-96 overflow-hidden rounded-2xl bg-gray-100 shadow">
  {item.imageUrl ? (
    <img
      src={item.imageUrl}
      alt={item.title}
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <span className="text-8xl">
        {item.category?.icon || "📦"}
      </span>
    </div>
  )}
</div>

        {/* Item Details */}
        <div>
          <h1 className="text-4xl font-bold">
            {item.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {item.description}
          </p>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">
              ₹{item.dailyRate}/day
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              {item.available ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Information Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Category
              </p>
              <p className="mt-1 font-semibold">
                {item.category.name}
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Owner
              </p>
              <p className="mt-1 font-semibold">
                {item.owner.name}
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Deposit
              </p>
              <p className="mt-1 font-semibold">
                ₹{item.deposit}
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Status
              </p>
              <p className="mt-1 font-semibold text-green-600">
                {item.available
                  ? "Ready to Rent"
                  : "Not Available"}
              </p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="mt-10 rounded-2xl border bg-white p-6 shadow">
            <h2 className="mb-6 text-2xl font-semibold">
              Book this Item
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium">
                  Start Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  End Date
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />
              </div>

              <button
                onClick={handleBooking}
                className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}