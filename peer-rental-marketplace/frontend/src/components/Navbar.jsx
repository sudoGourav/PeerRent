import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import {
  useState,
  useRef,
  useEffect,
} from "react";

export default function Navbar() {
  const { token, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 transition-all duration-200 ${
      isActive
        ? "bg-blue-100 font-semibold text-blue-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-blue-600"
        >
          PeerRent
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/"
            end
            className={navLinkClass}
          >
            Home
          </NavLink>

          {token ? (
            <>
              <NavLink
                to="/create-item"
                className={navLinkClass}
              >
                List Item
              </NavLink>

              <NavLink
                to="/wishlist"
                className={navLinkClass}
              >
                ❤️ Wishlist
              </NavLink>

              <NavLink
                to="/bookings"
                className={navLinkClass}
              >
                My Bookings
              </NavLink>

              <NavLink
                to="/my-items"
                className={navLinkClass}
              >
                My Items
              </NavLink>

              <NavLink
                to="/dashboard"
                className={navLinkClass}
              >
                Dashboard
              </NavLink>

              {/* Notifications */}
              <div
                className="relative ml-2"
                ref={notificationRef}
              >
                <button
                  onClick={() =>
                    setShowNotifications(
                      !showNotifications
                    )
                  }
                  className="relative rounded-full p-2 transition hover:bg-gray-100 hover:text-blue-600"
                >
                  <Bell size={22} />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
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
                className="ml-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="rounded-lg p-2 transition hover:bg-gray-100 md:hidden"
        >
          {mobileMenuOpen ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
      </div>      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-white shadow-md md:hidden">
          <div className="flex flex-col gap-2 px-6 py-4">
            <NavLink
              to="/"
              end
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Home
            </NavLink>

            {token ? (
              <>
                <NavLink
                  to="/create-item"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  List Item
                </NavLink>

                <NavLink
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  ❤️ Wishlist
                </NavLink>

                <NavLink
                  to="/bookings"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  My Bookings
                </NavLink>

                <NavLink
                  to="/my-items"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  My Items
                </NavLink>

                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/notifications"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? "bg-blue-100 font-semibold text-blue-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  <span>Notifications</span>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className={navLinkClass}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}