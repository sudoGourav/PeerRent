import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ItemDetails from "./pages/ItemDetails";
import MyBookings from "./pages/MyBookings";
import CreateItem from "./pages/CreateItem";
import MyItems from "./pages/MyItems";

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
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

      {/* Protected Routes */}
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
  path="/my-items"
  element={
    <PrivateRoute>
      <MainLayout>
        <MyItems />
      </MainLayout>
    </PrivateRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;