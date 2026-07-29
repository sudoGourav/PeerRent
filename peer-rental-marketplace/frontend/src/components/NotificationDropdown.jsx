import { Link } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";

function NotificationDropdown({ onClose }) {
  const {
    notifications,
    markNotificationAsRead,
  } = useNotifications();

  const latestNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute right-0 mt-2 w-96 rounded-lg border bg-white shadow-lg z-50">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">
          Notifications
        </h2>
      </div>

      {latestNotifications.length === 0 ? (
        <p className="p-4 text-center text-gray-500">
          No notifications
        </p>
      ) : (
        <>
          {latestNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                if (!notification.isRead) {
                  markNotificationAsRead(notification.id);
                }
              }}
              className={`cursor-pointer border-b p-4 transition hover:bg-gray-50 ${
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50"
              }`}
            >
              <h3 className="font-semibold">
                {notification.title}
              </h3>

              <p className="text-sm text-gray-600">
                {notification.message}
              </p>
            </div>
          ))}

          <Link
            to="/notifications"
            onClick={onClose}
            className="block p-4 text-center font-medium text-blue-600 hover:bg-gray-50"
          >
            View All Notifications →
          </Link>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;