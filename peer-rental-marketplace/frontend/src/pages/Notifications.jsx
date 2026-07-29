import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [markAllLoading, setMarkAllLoading] = useState(false);
  const [markingId, setMarkingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        await loadNotifications();
      } catch (err) {
        console.error(
          "Failed to load notifications:",
          err
        );

        if (isMounted) {
          toast.error(
            err.response?.data?.message ||
              "Failed to load notifications."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [loadNotifications]);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead || markingId) return;

    try {
      setMarkingId(id);
      await markNotificationAsRead(id);
    } catch (err) {
      console.error(
        "Failed to mark notification as read:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to update notification."
      );
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAll = async () => {
    if (markAllLoading) return;

    try {
      setMarkAllLoading(true);

      await markEveryNotificationAsRead();

      toast.success(
        "All notifications marked as read."
      );
    } catch (err) {
      console.error(
        "Failed to mark all notifications:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Failed to mark all notifications."
      );
    } finally {
      setMarkAllLoading(false);
    }
  };

  if (loading) {
    return <ListSkeleton />;
  }

  if (
    !Array.isArray(notifications) ||
    notifications.length === 0
  ) {
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
          onClick={handleMarkAll}
          disabled={markAllLoading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {markAllLoading
            ? "Marking..."
            : "Mark All as Read"}
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            role="button"
            tabIndex={0}
            onClick={() =>
              handleMarkAsRead(
                notification.id,
                notification.isRead
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" ||
                e.key === " "
              ) {
                handleMarkAsRead(
                  notification.id,
                  notification.isRead
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
                {notification.title ||
                  "Notification"}
              </h2>

              {!notification.isRead && (
                <span className="h-3 w-3 rounded-full bg-blue-600"></span>
              )}
            </div>

            <p className="mt-2 text-gray-600">
              {notification.message ||
                "No message available."}
            </p>

            <p className="mt-3 text-sm text-gray-400">
              {notification.createdAt
                ? new Date(
                    notification.createdAt
                  ).toLocaleString()
                : "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}