import { useEffect, useState } from "react";
import Loader from "../components/Loader";

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

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setCancelLoading(id);

      await cancelBooking(id);

      alert("Booking cancelled");

      loadBookings();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cancel failed"
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

            alert("Payment Successful!");

            loadBookings();
          } catch (err) {
            console.error(err);

            alert(
              err.response?.data?.message ||
                "Payment verification failed"
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

          alert(
            response.error.description
          );

          setPaymentLoading(null);
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Payment failed"
      );

      setPaymentLoading(null);
    }
  };

  if (pageLoading) {
    return (
      <Loader text="Loading bookings..." />
    );
  }  return (
    <div style={{ padding: "30px" }}>
      <h1>My Bookings</h1>

      {bookings.length === 0 && (
        <p>No bookings found.</p>
      )}

      {bookings.map((booking) => (
        <div
          key={booking.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <h2>{booking.item.title}</h2>

          <p>
            <strong>Dates:</strong>{" "}
            {new Date(
              booking.startDate
            ).toLocaleDateString()}
            {" - "}
            {new Date(
              booking.endDate
            ).toLocaleDateString()}
          </p>

          <p>
            <strong>Total:</strong> ₹
            {booking.totalPrice}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {booking.status}
          </p>

          <p>
            <strong>Payment:</strong>{" "}
            {booking.paymentStatus}
          </p>

          {booking.status === "PENDING" && (
            <button
              onClick={() =>
                handleCancel(booking.id)
              }
              disabled={
                cancelLoading === booking.id ||
                paymentLoading === booking.id
              }
            >
              {cancelLoading === booking.id
                ? "Cancelling..."
                : "Cancel Booking"}
            </button>
          )}

          {booking.paymentStatus ===
            "PENDING" &&
            booking.status ===
              "PENDING" && (
              <button
                style={{
                  marginLeft: "10px",
                }}
                onClick={() =>
                  handlePayment(booking)
                }
                disabled={
                  paymentLoading ===
                    booking.id ||
                  cancelLoading ===
                    booking.id
                }
              >
                {paymentLoading ===
                booking.id
                  ? "Processing..."
                  : "Pay Now"}
              </button>
            )}
        </div>
      ))}
    </div>
  );
}