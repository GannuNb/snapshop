import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Collapse } from "bootstrap";
import { logout } from "../redux/slices/authSlice";

const RoleNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const collapseRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const closeNavbar = () => {
    if (collapseRef.current) {
      const bsCollapse =
        Collapse.getInstance(collapseRef.current) ||
        new Collapse(collapseRef.current, { toggle: false });
      bsCollapse.hide();
    }
    setShowDropdown(false);
  };

  // 🔓 If NOT Logged In → Simple Navbar
  if (!user) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-lg-5 px-3">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand fw-bold text-white">
            Snap<span style={{ color: "#ffd700" }}>Shop</span>
          </Link>

          <div className="ms-auto">
            <Link
              to="/login"
              className={`btn btn-light me-2 ${
                location.pathname === "/login" ? "fw-bold" : ""
              }`}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={`btn btn-warning ${
                location.pathname === "/register" ? "fw-bold" : ""
              }`}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  // 🔐 If Logged In → Role-Based Links
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
      { name: "My Products", path: "/seller/products" },
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-lg-5 px-3">
      <div className="container-fluid">

        <Link
          to={user.role === "buyer" ? "/" : `/${user.role}`}
          className="navbar-brand fw-bold text-white"
          onClick={closeNavbar}
        >
          Snap<span style={{ color: "#ffd700" }}>Shop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={collapseRef}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4 mt-3 mt-lg-0">

            {links.map((link, i) => (
              <li className="nav-item" key={i}>
                <Link
                  to={link.path}
                  onClick={closeNavbar}
                  className={`nav-link fw-semibold ${
                    location.pathname === link.path
                      ? "text-warning"
                      : "text-white"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li className="nav-item dropdown position-relative">
              <button
                className="btn btn-light fw-semibold px-3 mt-2 mt-lg-0"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤 {user.name}
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu show mt-2"
                  style={{ right: 0, left: "auto" }}
                >
                  <Link
                    to={`/${user.role}`}
                    className="dropdown-item"
                    onClick={closeNavbar}
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
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default RoleNavbar;
