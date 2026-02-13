import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

const Sellernavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Show only seller navbar
  if (!user || user.role !== "seller") return null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-5"
      style={{ height: "68px" }}
    >
      {/* LEFT LOGO */}
      <Link
        to="/seller"
        className="navbar-brand fw-bold text-white"
        style={{ fontSize: "26px", letterSpacing: "1px" }}
      >
        Snap<span style={{ color: "#ffd700" }}>Shop</span>
      </Link>

      {/* RIGHT LINKS */}
      <div className="ms-auto d-flex align-items-center gap-4">

        <Link to="/seller" className="nav-link text-white fw-semibold">
          Dashboard
        </Link>

        <Link to="/seller/orders" className="nav-link text-white fw-semibold">
          Orders
        </Link>

        <Link to="/seller/add-product" className="nav-link text-white fw-semibold">
          Add Product
        </Link>

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
              <Link to="/seller" className="dropdown-item">
                Dashboard
              </Link>

              <Link to="/seller/orders" className="dropdown-item">
                Orders
              </Link>

              <Link to="/seller/add-product" className="dropdown-item">
                Add Product
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

export default Sellernavbar;
