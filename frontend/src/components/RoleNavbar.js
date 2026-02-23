import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Collapse } from "bootstrap";
import axios from "axios";
import { logout } from "../redux/slices/authSlice";

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const RoleNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const collapseRef = useRef(null);
  const collapseInstance = useRef(null);

  const { user } = useSelector((state) => state.auth);

  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    closeNavbar();
    navigate("/login");
  };

  const toggleNavbar = () => {
    if (!collapseInstance.current) return;

    if (collapseRef.current.classList.contains("show")) {
      collapseInstance.current.hide();
    } else {
      collapseInstance.current.show();
    }
  };
  /* ================= CLOSE NAVBAR ================= */
  const closeNavbar = () => {
    if (collapseRef.current) {
      const bsCollapse =
        Collapse.getInstance(collapseRef.current) ||
        new Collapse(collapseRef.current, { toggle: false });
      bsCollapse.hide();
    }
    setShowDropdown(false);
  };

  /* ================= LIVE SEARCH (DEBOUNCED) ================= */
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const res = await axios.get(
            `${API_URL}/search?keyword=${searchTerm}`,
          );
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (collapseRef.current) {
      collapseInstance.current = new Collapse(collapseRef.current, {
        toggle: false,
      });
    }
  }, []);
  /* ================= ROLE LINKS ================= */
  const roleLinks = {
    buyer: [
      { name: "Home", path: "/" },
      { name: "About Us", path: "/about" },
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

  const links = roleLinks[user?.role] || [];

  /* ================= NOT LOGGED IN ================= */
  if (!user) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-lg-5 px-3">
        <div className="container-fluid">
          <Link
            to="/"
            className="navbar-brand fw-bold text-white"
            onClick={closeNavbar}
          >
            Snap<span style={{ color: "#ffd700" }}>Shop</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-lg-5 px-3">
      <div className="container-fluid">
        <Link
          to="/"
          className="navbar-brand fw-bold text-white"
          onClick={closeNavbar}
        >
          Snap<span style={{ color: "#ffd700" }}>Shop</span>
        </Link>

        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={collapseRef}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-4 mt-3 mt-lg-0">
            {/* ================= SEARCH FOR BUYER ================= */}
            {user.role === "buyer" && (
              <div className="position-relative me-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchTerm.trim()) {
                      navigate("/buyer/products", {
                        state: { search: searchTerm },
                      });
                      setShowSuggestions(false);
                      setSearchTerm("");
                      closeNavbar();
                    }
                  }}
                >
                  <input
                    type="search"
                    className="form-control rounded-pill px-3"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ minWidth: "250px" }}
                  />
                </form>

                {showSuggestions && searchTerm && (
                  <div
                    className="position-absolute bg-white shadow rounded-3 mt-1 w-100"
                    style={{ zIndex: 999 }}
                  >
                    {suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <div
                          key={item._id}
                          className="px-3 py-2 border-bottom"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate(`/buyer/product/${item._id}`);
                            setSearchTerm("");
                            setShowSuggestions(false);
                            closeNavbar();
                          }}
                        >
                          <strong>{item.name}</strong>
                          <br />
                          <small className="text-muted">
                            {item.category?.name}
                          </small>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-muted">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ================= NAV LINKS ================= */}
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

            {/* ================= USER DROPDOWN ================= */}
            <li className="nav-item dropdown position-relative">
              <button
                className="btn btn-light fw-semibold px-3"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤 {user.name}
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu show mt-2"
                  style={{ right: 0, left: "auto" }}
                >
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
