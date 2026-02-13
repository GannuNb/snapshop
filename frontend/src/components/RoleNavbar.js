import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const RoleNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

    useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);


  // Hide navbar if no user
  if (!user) return null;

  // 🔥 Links based on role
  const roleLinks = {
    buyer: [
      { name: "Home", path: "/" },
      { name: "Products", path: "/buyer/products" },
      { name: "Orders", path: "/buyer/orders" },
      { name: "Cart", path: "/buyer/cart" },
    ],
    seller: [
      { name: "Dashboard", path: "/seller" },
      { name: "Add Product", path: "/seller/add-product" },
      { name: "My-Products", path: "/seller/products" },
      { name: "Orders", path: "/seller/orders" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Categories", path: "/admin/categories" },
      { name: "Orders", path: "/admin/orders" },
      { name: "Approve Products", path: "/admin/pending-products" },
    ],
  };

  const links = roleLinks[user.role] || [];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-5"
      style={{ height: "68px" }}
    >
      {/* LOGO */}
      <Link
        to={user.role === "buyer" ? "/" : `/${user.role}`}
        className="navbar-brand fw-bold text-white"
        style={{ fontSize: "26px", letterSpacing: "1px" }}
      >
        Snap<span style={{ color: "#ffd700" }}>Shop</span>
      </Link>

      {/* NAV LINKS */}
      <div className="ms-auto d-flex align-items-center gap-4">
        {links.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`nav-link fw-semibold ${
              location.pathname === link.path
                ? "text-warning"
                : "text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* USER DROPDOWN */}
        <div className="position-relative">
          <button
            className="btn btn-light fw-semibold px-3"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            👤 {user.name}
          </button>

          {showDropdown && (
            <div
              className="position-absolute end-0 mt-2 bg-white rounded shadow p-2"
              style={{ minWidth: "170px", zIndex: 1000 }}
            >
              <Link
                to={`/${user.role}`}
                className="dropdown-item"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="dropdown-item text-danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default RoleNavbar;
