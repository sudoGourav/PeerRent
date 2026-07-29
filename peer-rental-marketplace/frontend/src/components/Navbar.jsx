import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          PeerRent
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/create-item"
                className="hover:text-blue-600"
              >
                List Item
              </Link>

              <Link
                to="/wishlist"
                className="hover:text-blue-600"
              >
                ❤️ Wishlist
              </Link>

              <Link
                to="/bookings"
                className="hover:text-blue-600"
              >
                My Bookings
              </Link>

              <Link
                to="/my-items"
                className="hover:text-blue-600"
              >
                My Items
              </Link>

              <Link
                to="/dashboard"
                className="hover:text-blue-600"
              >
                Dashboard
              </Link>

              {/* Notification Bell */}
              <div
                className="relative"
                ref={notificationRef}
              >
                <button
                  onClick={() =>
                    setShowNotifications(
                      !showNotifications
                    )
                  }
                  className="relative hover:text-blue-600"
                >
                  <Bell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationDropdown
                    onClose={() =>
                      setShowNotifications(false)
                    }
                  />
                )}
              </div>

              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}