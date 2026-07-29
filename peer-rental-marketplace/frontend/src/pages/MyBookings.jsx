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

  const [pageLoading, setPageLoading] =
    useState(true);

  const [cancelLoading, setCancelLoading] =
    useState(null);

  const [paymentLoading, setPaymentLoading] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedBookingId, setSelectedBookingId] =
    useState(null);

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

      const response =
        await createOrder(booking.id);

      const { order, key } =
        response.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "PeerRent",
        description: booking.item.title,
        order_id: order.id,

        handler: async function (
          paymentResponse
        ) {
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

            toast.success(
              "Payment successful!"
            );

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

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(response.error);

          toast.error(
            response.error.description
          );

          setPaymentLoading(null);
        }
      );

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

      <div className="p-8">
        <h1 className="mb-8 text-3xl font-bold">
          My Bookings
        </h1>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-6 shadow"
            >
              <h2 className="text-xl font-semibold">
                {booking.item.title}
              </h2>

              <p className="mt-3">
                <strong>Dates:</strong>{" "}
                {new Date(
                  booking.startDate
                ).toLocaleDateString()}
                {" - "}
                {new Date(
                  booking.endDate
                ).toLocaleDateString()}
              </p>

              <p className="mt-2">
                <strong>Total:</strong> ₹
                {booking.totalPrice}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                {booking.status}
              </p>

              <p className="mt-2">
                <strong>Payment:</strong>{" "}
                {booking.paymentStatus}
              </p>

              <div className="mt-5 flex gap-3">
                {booking.status ===
                  "PENDING" && (
                  <button
                    onClick={() =>
                      openCancelModal(
                        booking.id
                      )
                    }
                    disabled={
                      cancelLoading ===
                        booking.id ||
                      paymentLoading ===
                        booking.id
                    }
                    className="rounded-lg bg-red-500 px-5 py-2 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {cancelLoading ===
                    booking.id
                      ? "Cancelling..."
                      : "Cancel Booking"}
                  </button>
                )}

                {booking.paymentStatus ===
                  "PENDING" &&
                  booking.status ===
                    "PENDING" && (
                    <button
                      onClick={() =>
                        handlePayment(
                          booking
                        )
                      }
                      disabled={
                        paymentLoading ===
                          booking.id ||
                        cancelLoading ===
                          booking.id
                      }
                      className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {paymentLoading ===
                      booking.id
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