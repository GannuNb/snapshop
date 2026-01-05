import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import AdminCategories from "./pages/AdminCategories";
import SellerAddProduct from "./pages/SellerAddProduct";
import BuyerProducts from "./pages/BuyerProducts";
import BuyerCart from "./pages/BuyerCart";
import BuyerOrders from "./pages/BuyerOrders";
import SellerOrders from "./pages/SellerOrders";
import AdminOrders from "./pages/AdminOrders";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Buyer Routes */}
        <Route path="/buyer" element={<ProtectedRoute roles={["buyer"]}><BuyerDashboard /></ProtectedRoute>} />
        <Route path="/buyer/products" element={<ProtectedRoute roles={["buyer"]}><BuyerProducts /></ProtectedRoute>} />
        <Route path="/buyer/product/:id" element={<ProtectedRoute roles={["buyer"]}><ProductDetails /></ProtectedRoute>} />
        <Route path="/buyer/cart" element={<ProtectedRoute roles={["buyer"]}><BuyerCart /></ProtectedRoute>} />
        <Route path="/buyer/orders" element={<ProtectedRoute roles={["buyer"]}><BuyerOrders /></ProtectedRoute>} />

        {/* Seller Routes */}
        <Route path="/seller" element={<ProtectedRoute roles={["seller"]}><SellerDashboard /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute roles={["seller"]}><SellerOrders /></ProtectedRoute>} />
        <Route path="/seller/add-product" element={<ProtectedRoute roles={["seller"]}><SellerAddProduct /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><AdminCategories /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
