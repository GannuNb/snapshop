import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { addItemToCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

import {
  FaBox,
  FaBoxOpen,
  FaShippingFast,
  FaCheckCircle,
  FaShoppingBag,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000/api/products";

const BuyerOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector((state) => state.order);

  const [openOrder, setOpenOrder] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchMyOrders(user.token));
    }
  }, [dispatch, user]);

  /* STATUS COLOR */
  const statusBadge = (status) => {
    switch (status) {
      case "Placed":
        return "bg-secondary";
      case "Packed":
        return "bg-warning text-dark";
      case "Shipped":
        return "bg-info text-dark";
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const timelineSteps = ["Placed", "Packed", "Shipped", "Delivered"];

  /* BUY AGAIN FIX */
  const buyAgainHandler = (productId) => {
    dispatch(
      addItemToCart({
        productId,
        token: user.token,
      })
    );
    alert("Added to cart ✅");
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex align-items-center mb-4">
        <FaShoppingBag className="me-2 text-primary" />
        <h3 className="fw-bold mb-0">My Orders</h3>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success"></div>
          <p className="text-muted mt-2">Loading orders...</p>
        </div>
      )}

      {/* EMPTY */}
      {!isLoading && orders.length === 0 && (
        <div className="card shadow-sm border-0 rounded-4 text-center py-5">
          <h5>No orders yet</h5>
          <p className="text-muted">Start shopping to place orders.</p>
        </div>
      )}

      {/* ORDERS */}
      {orders.map((order) => {
        const currentIndex = timelineSteps.indexOf(order.status);
        const isOpen = openOrder === order._id;

        return (
          <div key={order._id} className="card shadow-sm border-0 rounded-4 mb-3">

            {/* HEADER (COLLAPSIBLE) */}
            <div
              className="card-body d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setOpenOrder(isOpen ? null : order._id)
              }
            >
              <div>
                <h6 className="fw-bold mb-1">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h6>
                <small className="text-muted">
                  {new Date(order.createdAt).toLocaleString()}
                </small>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className={`badge ${statusBadge(order.status)}`}>
                  {order.status}
                </span>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {/* COLLAPSIBLE CONTENT */}
            {isOpen && (
              <div className="px-4 pb-4">

                <hr />

                {/* PRODUCTS */}
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                  >
                    <div className="d-flex">

                      <img
                        src={`${API_URL}/image/${item.product?._id}`}
                        alt={item.product?.name}
                        style={{
                          width: 65,
                          height: 65,
                          objectFit: "contain",
                          background: "#f8f9fa",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/buyer/product/${item.product?._id}`)
                        }
                      />

                      <div className="ms-3">
                        <div
                          className="fw-semibold text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/buyer/product/${item.product?._id}`)
                          }
                        >
                          {item.product?.name}
                        </div>

                        <small className="text-muted d-block">
                          Product ID: {item.product?._id}
                        </small>

                        <small className="text-muted">
                          Qty: {item.quantity}
                        </small>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="fw-bold mb-2">
                        ₹{item.price * item.quantity}
                      </div>

                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() =>
                          buyAgainHandler(item.product?._id)
                        }
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                ))}

                {/* TOTAL */}
                <div className="d-flex justify-content-between mt-3">
                  <span>Total</span>
                  <h5 className="text-success fw-bold">
                    ₹{order.totalAmount}
                  </h5>
                </div>

                {/* PROGRESS BAR (ANIMATED STYLE) */}
                {order.status !== "Cancelled" && (
                  <div className="mt-4">
                    <div className="progress" style={{ height: 8 }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${((currentIndex + 1) / 4) * 100}%`,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      {timelineSteps.map((step) => (
                        <small
                          key={step}
                          className={
                            timelineSteps.indexOf(step) <= currentIndex
                              ? "fw-bold text-success"
                              : "text-muted"
                          }
                        >
                          {step}
                        </small>
                      ))}
                    </div>
                  </div>
                )}

                {/* DETAILS BUTTON */}
                <button
                  className="btn btn-sm btn-outline-primary mt-3"
                  onClick={() => setModalOrder(order)}
                >
                  View Full Details
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* ORDER MODAL */}
      {modalOrder && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 999 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: 420 }}>
            <h5 className="fw-bold mb-3">
              Order #{modalOrder._id.slice(-6)}
            </h5>

            <p className="mb-1">
              <strong>Status:</strong> {modalOrder.status}
            </p>
            <p className="mb-1">
              <strong>Total:</strong> ₹{modalOrder.totalAmount}
            </p>

            <button
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => setModalOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
