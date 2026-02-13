import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.token && user?.role === "buyer") {
      dispatch(fetchCart(user.token));
    }
  }, [dispatch, user]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (user && user.role !== "buyer") return null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-5"
      style={{ height: "68px" }}   // 🔥 Increased height
    >
      
      {/* LEFT SIDE TEXT LOGO */}
      <Link
        to="/"
        className="navbar-brand fw-bold text-white"
        style={{ fontSize: "26px", letterSpacing: "1px" }}
      >
        Snap<span style={{ color: "#ffd700" }}>Shop</span>
      </Link>

      {/* RIGHT SIDE CONTENT */}
      <div className="ms-auto d-flex align-items-center gap-4">

        <Link to="/" className="nav-link text-white fw-semibold">
          Home
        </Link>

        <Link to="/about" className="nav-link text-white fw-semibold">
          About
        </Link>

        {user && (
          <>
            <Link to="/buyer/orders" className="nav-link text-white fw-semibold">
              Orders
            </Link>

            <Link
              to="/buyer/cart"
              className="nav-link text-white fw-semibold position-relative"
            >
              🛒 Cart
              {count > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {count}
                </span>
              )}
            </Link>
          </>
        )}

        {!user ? (
          <Link to="/login" className="btn btn-warning fw-semibold px-4">
            Login
          </Link>
        ) : (
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
                <Link to="/buyer" className="dropdown-item">
                  Dashboard
                </Link>
                <Link to="/buyer/orders" className="dropdown-item">
                  My Orders
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
        )}
      </div>
    </nav>
  );
};

export default Navbar;
