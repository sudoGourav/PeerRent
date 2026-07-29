import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ListSkeleton from "../components/ListSkeleton";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";

import {
  getMyBookings,
  cancelBooking,
} from "../services/booking.service";

import {
  createOrder,
  verifyPayment,
} from "../services/payment.service";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to load bookings."
      );
    } finally {
      setPageLoading(false);
    }
  };

  const openCancelModal = (id) => {
    setSelectedBookingId(id);
    setIsModalOpen(true);
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;

    setIsModalOpen(false);
    setSelectedBookingId(null);
  };

  const handleCancel = async () => {
    try {
      setCancelLoading(selectedBookingId);

      await cancelBooking(selectedBookingId);

      toast.success("Booking cancelled.");

      closeCancelModal();

      loadBookings();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Cancel failed."
      );
    } finally {
      setCancelLoading(null);
    }
  };

  const handlePayment = async (booking) => {
    try {
      setPaymentLoading(booking.id);

      const response = await createOrder(booking.id);

      const { order, key } = response.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "PeerRent",
        description: booking.item.title,
        order_id: order.id,

        handler: async function (paymentResponse) {
          try {
            await verifyPayment({
              bookingId: booking.id,
              razorpay_order_id:
                paymentResponse.razorpay_order_id,
              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,
              razorpay_signature:
                paymentResponse.razorpay_signature,
            });

            toast.success("Payment successful!");

            loadBookings();
          } catch (err) {
            console.error(err);

            toast.error(
              err.response?.data?.message ||
                "Payment verification failed."
            );
          } finally {
            setPaymentLoading(null);
          }
        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(response.error);

        toast.error(response.error.description);

        setPaymentLoading(null);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Payment failed."
      );

      setPaymentLoading(null);
    }
  };

  if (pageLoading) {
    return <ListSkeleton />;
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon="📅"
        title="No Bookings Yet"
        description="Browse available items and make your first booking."
        buttonText="Browse Items"
        buttonLink="/"
      />
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={handleCancel}
        onCancel={closeCancelModal}
        loading={cancelLoading !== null}
      />

      <div className="px-2 py-4 sm:px-4 md:px-6">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">
          My Bookings
        </h1>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border bg-white p-5 shadow transition duration-200 hover:shadow-lg sm:p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="break-words text-xl font-semibold">
                    {booking.item.title}
                  </h2>

                  <p className="mt-3 text-gray-600">
                    <strong>Dates:</strong>{" "}
                    {new Date(
                      booking.startDate
                    ).toLocaleDateString()}
                    {" - "}
                    {new Date(
                      booking.endDate
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-2 text-gray-600">
                    <strong>Total:</strong> ₹
                    {booking.totalPrice}
                  </p>
                </div>

                {/* STATUS BADGES */}
                <div className="flex flex-col items-end gap-4 self-start">

                  <div className="text-right">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Booking
                    </p>

                    <span
                      className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                        booking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : booking.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Payment
                    </p>

                    <span
                      className={`inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                        booking.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>

                </div>
              </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {booking.status === "PENDING" && (
                  <button
                    onClick={() =>
                      openCancelModal(booking.id)
                    }
                    disabled={
                      cancelLoading === booking.id ||
                      paymentLoading === booking.id
                    }
                    className="flex-1 rounded-lg bg-red-500 py-2 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {cancelLoading === booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

                {booking.paymentStatus === "PENDING" &&
                  booking.status === "PENDING" && (
                    <button
                      onClick={() =>
                        handlePayment(booking)
                      }
                      disabled={
                        paymentLoading === booking.id ||
                        cancelLoading === booking.id
                      }
                      className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {paymentLoading === booking.id
                        ? "Processing..."
                        : "Pay Now"}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}