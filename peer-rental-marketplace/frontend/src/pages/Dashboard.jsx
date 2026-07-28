import { useEffect, useState } from "react";

import {
  getOwnerDashboard,
  getRevenueSummary,
  getRecentBookings,
} from "../services/dashboard.service";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const statsRes = await getOwnerDashboard();
      const revenueRes = await getRevenueSummary();
      const bookingsRes = await getRecentBookings();

      setStats(statsRes.data);
      setRevenue(revenueRes.data);
      setRecentBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats || !revenue) {
    return (
      <div className="py-20 text-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to your PeerRent dashboard.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Items"
          value={stats.totalItems}
          icon="📦"
          color="bg-blue-500"
        />

        <DashboardCard
          title="Bookings"
          value={stats.totalBookings}
          icon="📅"
          color="bg-green-500"
        />

        <DashboardCard
          title="Pending"
          value={stats.pendingBookings}
          icon="⏳"
          color="bg-yellow-500"
        />

        <DashboardCard
          title="Revenue"
          value={`₹${revenue.totalRevenue}`}
          icon="💰"
          color="bg-purple-500"
        />
      </div>

      {/* Revenue Section */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-semibold">
          Revenue Summary
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <RevenueCard
            title="Total Revenue"
            value={`₹${revenue.totalRevenue}`}
          />

          <RevenueCard
            title="Completed Revenue"
            value={`₹${revenue.completedRevenue}`}
          />

          <RevenueCard
            title="Paid Bookings"
            value={revenue.totalPaidBookings}
          />
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="mb-6 text-2xl font-semibold">
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
                className="flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <h3 className="font-semibold">
                    {booking.item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {booking.renter.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{booking.totalPrice}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
                      booking.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>

                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(
                      booking.startDate
                    ).toLocaleDateString()}
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
    <div className="rounded-2xl bg-white p-6 shadow">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white ${color}`}
      >
        {icon}
      </div>

      <h3 className="text-gray-500">
        {title}
      </h3>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function RevenueCard({ title, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}