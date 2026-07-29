import { useEffect, useState } from "react";

import { useNotifications } from "../context/NotificationContext";

import ListSkeleton from "../components/ListSkeleton";
import EmptyState from "../components/EmptyState";

export default function Notifications() {
  const {
    notifications,
    loadNotifications,
    markNotificationAsRead,
    markEveryNotificationAsRead,
  } = useNotifications();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await loadNotifications();
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <ListSkeleton />;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon="🔔"
        title="No Notifications"
        description="You're all caught up! New booking, payment, and review notifications will appear here."
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        <button
          onClick={markEveryNotificationAsRead}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => {
              if (!notification.isRead) {
                markNotificationAsRead(
                  notification.id
                );
              }
            }}
            className={`cursor-pointer rounded-xl border p-4 shadow-sm transition ${
              notification.isRead
                ? "bg-white"
                : "border-blue-200 bg-blue-50"
            }`}
          >
            <div className="flex items-start justify-between">
              <h2 className="font-semibold">
                {notification.title}
              </h2>

              {!notification.isRead && (
                <span className="h-3 w-3 rounded-full bg-blue-600"></span>
              )}
            </div>

            <p className="mt-2 text-gray-600">
              {notification.message}
            </p>

            <p className="mt-3 text-sm text-gray-400">
              {new Date(
                notification.createdAt
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}