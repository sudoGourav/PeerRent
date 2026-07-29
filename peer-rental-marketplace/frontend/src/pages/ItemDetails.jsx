import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";

import {
  getItemReviews,
  createReview,
} from "../services/review.service";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  differenceInCalendarDays,
  eachDayOfInterval,
} from "date-fns";

import {
  createBooking,
  getUnavailableDates,
} from "../services/booking.service";

import { getItemById } from "../services/item.service";

export default function ItemDetails() {
  const { id } = useParams();

  const [item, setItem] = useState(null);

  const [pageLoading, setPageLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [reviewLoading, setReviewLoading] =
    useState(false);

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [unavailableDates, setUnavailableDates] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [averageRating, setAverageRating] =
    useState(0);

  const [totalReviews, setTotalReviews] =
    useState(0);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadItem(),
        loadReviews(),
        loadUnavailableDates(),
      ]);
    } finally {
      setPageLoading(false);
    }
  };

  const loadItem = async () => {
    try {
      const res = await getItemById(id);
      setItem(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      const res =
        await getItemReviews(id);

      setReviews(res.data.reviews);
      setAverageRating(
        res.data.averageRating
      );
      setTotalReviews(
        res.data.totalReviews
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadUnavailableDates =
    async () => {
      try {
        const res =
          await getUnavailableDates(id);

        const blocked = [];

        res.data.forEach((booking) => {
          blocked.push(
            ...eachDayOfInterval({
              start: new Date(
                booking.startDate
              ),
              end: new Date(
                booking.endDate
              ),
            })
          );
        });

        setUnavailableDates(blocked);
      } catch (err) {
        console.error(err);
      }
    };

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert(
        "Please select both dates"
      );
      return;
    }

    try {
      setBookingLoading(true);

      await createBooking({
        itemId: item.id,
        startDate:
          startDate
            .toISOString()
            .split("T")[0],
        endDate:
          endDate
            .toISOString()
            .split("T")[0],
      });

      alert(
        "Booking Created Successfully"
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit =
    async () => {
      if (!comment.trim()) {
        alert(
          "Please enter a review."
        );
        return;
      }

      try {
        setReviewLoading(true);

        await createReview({
          itemId: item.id,
          rating,
          comment,
        });

        alert(
          "Review added successfully!"
        );

        setRating(5);
        setComment("");

        loadReviews();
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Failed to add review."
        );
      } finally {
        setReviewLoading(false);
      }
    };

  const rentalDays =
    startDate && endDate
      ? differenceInCalendarDays(
          endDate,
          startDate
        )
      : 0;

  const rentalCost =
    rentalDays > 0
      ? rentalDays *
        Number(item?.dailyRate || 0)
      : 0;

  const totalCost =
    rentalCost +
    Number(item?.deposit || 0);

  if (pageLoading) {
    return (
      <Loader text="Loading item..." />
    );
  }  return (
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
              {item.available
                ? "Available"
                : "Unavailable"}
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

                <DatePicker
                  selected={startDate}
                  onChange={(date) =>
                    setStartDate(date)
                  }
                  minDate={new Date()}
                  excludeDates={unavailableDates}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select start date"
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  End Date
                </label>

                <DatePicker
                  selected={endDate}
                  onChange={(date) =>
                    setEndDate(date)
                  }
                  minDate={
                    startDate || new Date()
                  }
                  excludeDates={unavailableDates}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select end date"
                  className="w-full rounded-lg border border-gray-300 p-3"
                />
              </div>

              {/* Booking Summary */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-3 text-lg font-semibold">
                  Booking Summary
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Rate</span>
                    <span>
                      ₹{item.dailyRate}/day
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Rental Days</span>
                    <span>{rentalDays}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Rental Cost</span>
                    <span>₹{rentalCost}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>₹{item.deposit}</span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalCost}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={
                  !startDate ||
                  !endDate ||
                  bookingLoading
                }
                onClick={handleBooking}
                className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {bookingLoading
                  ? "Booking..."
                  : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10 rounded-2xl border bg-white p-6 shadow">
        <h2 className="text-2xl font-semibold">
          Reviews
        </h2>

        <p className="mt-2 text-gray-600">
          ⭐ {averageRating.toFixed(1)} (
          {totalReviews} reviews)
        </p>

        {/* Add Review */}
        <div className="mt-6 border-t pt-6">
          <h3 className="mb-4 text-lg font-semibold">
            Write a Review
          </h3>

          <div className="space-y-4">
            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-lg border p-3"
            >
              <option value={5}>
                ★★★★★ (5)
              </option>
              <option value={4}>
                ★★★★☆ (4)
              </option>
              <option value={3}>
                ★★★☆☆ (3)
              </option>
              <option value={2}>
                ★★☆☆☆ (2)
              </option>
              <option value={1}>
                ★☆☆☆☆ (1)
              </option>
            </select>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              className="w-full rounded-lg border p-3"
              placeholder="Write your review..."
            />

            <button
              onClick={handleReviewSubmit}
              disabled={reviewLoading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>
          </div>
        </div>

        {/* Review List */}
        <div className="mt-8 space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {review.user.name}
                  </h4>

                  <span>
                    {"⭐".repeat(review.rating)}
                  </span>
                </div>

                <p className="mt-3 text-gray-600">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}