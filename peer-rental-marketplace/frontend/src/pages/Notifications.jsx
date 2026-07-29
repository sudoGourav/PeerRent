import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";

import Loader from "../components/Loader";

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
    return (
      <Loader text="Loading notifications..." />
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Notifications
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={markEveryNotificationAsRead}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
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
              className={`cursor-pointer rounded-lg border p-4 transition ${
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50"
              }`}
            >
              <h2 className="font-semibold">
                {notification.title}
              </h2>

              <p className="mt-1 text-gray-600">
                {notification.message}
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {new Date(
                  notification.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}