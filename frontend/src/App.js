import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.js"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


//seller
import SellerDashboard from "./pages/SellerDashboard";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerOrders from "./pages/SellerOrders";
import SellerProducts from "./pages/SellerProducts";

//un
import Unauthorized from "./pages/Unauthorized";

//buyer
import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerProducts from "./pages/BuyerProducts";
import BuyerCart from "./pages/BuyerCart";
import BuyerOrders from "./pages/BuyerOrders";
import ProductDetails from "./pages/ProductDetails";


//admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminCategories from "./pages/AdminCategories";
import AdminOrders from "./pages/AdminOrders";
import AdminPendingProducts from "./pages/AdminPendingProducts";


//components
import RoleNavbar from "./components/RoleNavbar.js";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
    <BrowserRouter>

     <div className="d-flex flex-column min-vh-100">
       <RoleNavbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>}/>
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
        <Route path="/seller/products" element={  <ProtectedRoute roles={["seller"]}>  <SellerProducts />  </ProtectedRoute>  } />


        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={["admin"]}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute roles={["admin"]}><AdminCategories /></ProtectedRoute>} />
        <Route path="/admin/pending-products" element={<ProtectedRoute roles={["admin"]}> <AdminPendingProducts /></ProtectedRoute>
  }
/>

      </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
