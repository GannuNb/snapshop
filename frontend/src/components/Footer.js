import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-white mt-1 pt-5 pb-3">
      <div className="container">
        <div className="row g-4">

          {/* Brand */}
          <div className="col-md-4">
            <h4 className="fw-bold mb-3">
              SnapShop
            </h4>
            <p className="text-light">
              Shop smarter with trusted products, fast delivery, and secure
              checkout. Your favorite marketplace made simple.
            </p>
          </div>

          {/* Buyer Links */}
          <div className="col-md-4">
            <h5 className="fw-semibold mb-3">Buyer Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/buyer/products" className="text-light text-decoration-none">
                  🛒 Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/buyer/cart" className="text-light text-decoration-none">
                  🧺 Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/buyer/orders" className="text-light text-decoration-none">
                  📦 My Orders
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/buyer" className="text-light text-decoration-none">
                  👤 Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Info */}
          <div className="col-md-4">
            <h5 className="fw-semibold mb-3">Support</h5>
            <ul className="list-unstyled text-light">
              <li className="mb-2">📧 support@snapshop.com</li>
              <li className="mb-2">📞 +91 98765 43210</li>
              <li className="mb-2">🕒 24/7 Customer Support</li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary mt-4" />

        <div className="text-center text-secondary small">
          © {new Date().getFullYear()} SnapShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
