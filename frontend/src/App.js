import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCategories from "./pages/AdminCategories";
import SellerAddProduct from "./pages/SellerAddProduct";
import BuyerProducts from "./pages/BuyerProducts";
import BuyerCart from "./pages/BuyerCart";
import BuyerOrders from "./pages/BuyerOrders";
import Navbar from "./components/Navbar";
import SellerOrders from "./pages/SellerOrders";
import AdminOrders from "./pages/AdminOrders";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Buyer */}
        <Route
          path="/buyer"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/buyer/product/:id"
  element={
    <ProtectedRoute roles={["buyer"]}>
      <ProductDetails />
    </ProtectedRoute>
  }
/>


        {/* Seller */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute roles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/seller/orders" element={<SellerOrders />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/seller/add-product" element={<SellerAddProduct />} />
        <Route path="/buyer/products" element={<BuyerProducts />} />
        <Route
          path="/buyer/cart"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <BuyerCart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute roles={["buyer"]}>
              <BuyerOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
