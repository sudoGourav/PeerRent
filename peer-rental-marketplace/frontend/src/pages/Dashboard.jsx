import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Loader from "../components/Loader";

import {
  getOwnerDashboard,
  getRevenueSummary,
  getRecentBookings,
} from "../services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [revenue, setRevenue] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const [
          statsRes,
          revenueRes,
          bookingsRes,
        ] = await Promise.all([
          getOwnerDashboard(),
          getRevenueSummary(),
          getRecentBookings(),
        ]);

        if (!mounted) return;

        setStats(statsRes?.data || {});
        setRevenue(revenueRes?.data || {});
        setRecentBookings(
          Array.isArray(bookingsRes?.data)
            ? bookingsRes.data
            : []
        );
      } catch (err) {
        console.error(
          "Dashboard loading failed:",
          err
        );

        if (mounted) {
          toast.error(
            err.response?.data?.message ||
              "Failed to load dashboard."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Loader text="Loading dashboard..." />
    );
  }

  const formatCurrency = (value) =>
    `₹${Number(value ?? 0).toLocaleString(
      "en-IN"
    )}`;

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
      case "ACTIVE":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8 px-2 sm:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Welcome to your PeerRent dashboard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Items"
          value={stats?.totalItems ?? 0}
          icon="📦"
          color="bg-blue-500"
        />

        <DashboardCard
          title="Bookings"
          value={stats?.totalBookings ?? 0}
          icon="📅"
          color="bg-green-500"
        />

        <DashboardCard
          title="Pending"
          value={stats?.pendingBookings ?? 0}
          icon="⏳"
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Revenue"
          value={formatCurrency(
            revenue?.totalRevenue
          )}
          icon="💰"
          color="bg-purple-500"
        />
      </div>

      {/* Revenue */}
      <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
          Revenue Summary
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <RevenueCard
            title="Total Revenue"
            value={formatCurrency(
              revenue?.totalRevenue
            )}
          />

          <RevenueCard
            title="Completed Revenue"
            value={formatCurrency(
              revenue?.completedRevenue
            )}
          />

          <RevenueCard
            title="Paid Bookings"
            value={
              revenue?.totalPaidBookings ?? 0
            }
          />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl bg-white p-5 shadow sm:p-6">
        <h2 className="mb-6 text-xl font-semibold sm:text-2xl">
          Recent Bookings
        </h2>

        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <p className="text-gray-500">
              No recent bookings.
            </p>
          ) : (
            recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="break-words font-semibold">
                    {booking.item?.title ??
                      "Deleted Item"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {booking.renter?.name ??
                      "Unknown User"}
                  </p>

                  <p className="text-sm font-medium text-blue-600">
                    {formatCurrency(
                      booking.totalPrice
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusStyle(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>

                  <p className="text-sm text-gray-500">
                    {booking.startDate
                      ? new Date(
                          booking.startDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg sm:p-6">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-sm text-gray-500">
        {title}
      </h3>

      <p className="mt-2 break-words text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function RevenueCard({ title, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 break-words text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}