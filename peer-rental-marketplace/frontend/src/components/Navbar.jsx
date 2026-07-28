import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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