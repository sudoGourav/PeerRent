import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login as loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email,
        password,
      });

      if (!res?.data?.token) {
        throw new Error("Token not received.");
      }

      login(res.data.token);

      toast.success("Login successful!");

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Login failed:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <br />

        <div
          style={{
            marginTop: "10px",
            marginBottom: "20px",
          }}
        >
          <Link
            to="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            minWidth: "120px",
            padding: "10px 20px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "⏳ Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}