import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../redux/slices/cartSlice"; // make sure you import this

const BuyerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { orders } = useSelector((state) => state.order);

  // ✅ Fetch cart on page load
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart(user.token));
      // optionally fetch orders if needed
      // dispatch(fetchOrders(user.token));
    }
  }, [dispatch, user]);

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h2>Welcome, {user?.name || "Buyer"}!</h2>
        <p>Manage your profile, browse products, and track your orders.</p>
      </div>

      <div className="row">
        {/* Profile Card */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
            <h5 className="fw-bold mb-3">Your Profile</h5>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <button
              className="btn btn-outline-primary w-100 mt-2"
              onClick={() => navigate("/buyer/cart")}
            >
              Go to Cart ({cartItems?.length || 0})
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => navigate("/buyer/products")}
            >
              Browse Products
            </button>
            <button
              className="btn btn-success w-100 mb-2"
              onClick={() => navigate("/buyer/orders")}
            >
              Your Orders ({orders?.length || 0})
            </button>
            <button
              className="btn btn-warning w-100"
              onClick={() => navigate("/buyer/cart")}
            >
              View Cart ({cartItems?.length || 0})
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
            <h5 className="fw-bold mb-3">Recent Orders</h5>
            {orders?.length > 0 ? (
              <ul className="list-group list-group-flush">
                {orders.slice(0, 5).map((order) => (
                  <li
                    key={order._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>#{order._id.slice(-5)}</span>
                    <span className="badge bg-success rounded-pill">
                      ₹{order.totalPrice}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;