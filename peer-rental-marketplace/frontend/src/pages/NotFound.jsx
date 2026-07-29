import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-8xl">🚫</div>

      <h1 className="mt-6 text-5xl font-bold text-gray-800">
        404
      </h1>

      <h2 className="mt-3 text-2xl font-semibold text-gray-700">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-gray-500">
        Sorry, the page you're looking for doesn't exist
        or may have been moved.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        ← Back to Home
      </Link>
    </div>
  );
}