import { useState } from "react";
import toast from "react-hot-toast";

import { forgotPassword } from "../services/auth.service";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword(trimmedEmail);

      toast.success(
        res?.data?.message ||
          "Password reset link sent."
      );

      setEmail("");
    } catch (err) {
      console.error(
        "Forgot password failed:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className="mb-4 w-full rounded-lg border p-3"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}