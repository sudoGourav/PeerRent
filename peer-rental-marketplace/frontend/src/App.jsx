import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ItemDetails from "./pages/ItemDetails";
import MyBookings from "./pages/MyBookings";
import CreateItem from "./pages/CreateItem";
import MyItems from "./pages/MyItems";
import EditItem from "./pages/EditItem";
import Wishlist from "./pages/Wishlist";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}

        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <MainLayout>
              <Login />
            </MainLayout>
          }
        />

        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />

        <Route
          path="/items/:id"
          element={
            <MainLayout>
              <ItemDetails />
            </MainLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Protected Routes */}

        <Route
          path="/create-item"
          element={
            <PrivateRoute>
              <MainLayout>
                <CreateItem />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EditItem />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <MainLayout>
                <Notifications />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyBookings />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <MainLayout>
                <Wishlist />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-items"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyItems />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;