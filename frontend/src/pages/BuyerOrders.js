import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";

import {
  FaBox,
  FaBoxOpen,
  FaShippingFast,
  FaCheckCircle,
} from "react-icons/fa";

const BuyerOrders = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchMyOrders(user.token));
  }, [dispatch, user.token]);

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

  const timelineSteps = [
    { label: "Placed", icon: <FaBox /> },
    { label: "Packed", icon: <FaBoxOpen /> },
    { label: "Shipped", icon: <FaShippingFast /> },
    { label: "Delivered", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Orders</h3>

      {isLoading && <p>Loading orders...</p>}

      {!isLoading && orders.length === 0 && (
        <div className="alert alert-info rounded-3">
          No orders yet.
        </div>
      )}

      {orders.map((order) => {
        const currentIndex = timelineSteps.findIndex(
          (s) => s.label === order.status
        );

        return (
          <div
            key={order._id}
            className="card border-0 shadow-sm rounded-4 mb-4"
          >
            <div className="card-body">

              {/* HEADER */}
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div>
                  <h6 className="mb-1 fw-bold">
                    Order #{order._id.slice(-6)}
                  </h6>
                  <small className="text-muted">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </small>
                </div>

                <span
                  className={`badge px-3 py-2 ${statusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <hr />

              {/* PRODUCTS */}
              <div className="mb-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="d-flex justify-content-between border-bottom py-2"
                  >
                    <div>
                      <strong>{item.product?.name}</strong>
                      <small className="text-muted d-block">
                        Qty: {item.quantity}
                      </small>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="fw-bold mb-4">
                Total: ₹{order.totalAmount}
              </div>

              {/* TIMELINE */}
              {order.status !== "Cancelled" && (
                <div className="position-relative">
                  {/* Line */}
                  <div
                    className="position-absolute top-50 start-0 w-100"
                    style={{
                      height: "3px",
                      background: "#e9ecef",
                      zIndex: 0,
                    }}
                  />

                  <div className="d-flex justify-content-between position-relative">
                    {timelineSteps.map((step, index) => (
                      <div
                        key={step.label}
                        className="text-center"
                        style={{ width: "25%" }}
                      >
                        <div
                          className={`mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle ${
                            index <= currentIndex
                              ? "bg-success text-white"
                              : "bg-secondary text-white"
                          }`}
                          style={{
                            width: 36,
                            height: 36,
                            zIndex: 2,
                            position: "relative",
                          }}
                        >
                          {step.icon}
                        </div>

                        <small className="fw-semibold">
                          {step.label}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.status === "Cancelled" && (
                <div className="alert alert-danger mt-3 mb-0">
                  This order was cancelled.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BuyerOrders;
