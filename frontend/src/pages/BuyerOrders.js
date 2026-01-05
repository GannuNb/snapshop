import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";

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
    "Placed",
    "Packed",
    "Shipped",
    "Delivered",
  ];

  return (
    <div className="container mt-4">
      <h3>My Orders</h3>

      {isLoading && <p>Loading orders...</p>}

      {!isLoading && orders.length === 0 && (
        <p>No orders yet</p>
      )}

      {orders.map((order) => (
        <div
          key={order._id}
          className="card mb-3 p-3 shadow-sm"
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-1">
              <strong>Total:</strong> ₹
              {order.totalAmount}
            </p>

            <span
              className={`badge ${statusBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <small className="text-muted">
            Ordered on{" "}
            {new Date(
              order.createdAt
            ).toLocaleString()}
          </small>

          <hr />

          {order.items?.map((item, index) => (
            <div key={index}>
              <small>
                {item.product?.name} ×{" "}
                {item.quantity}
              </small>
            </div>
          ))}

          {/* ORDER TIMELINE */}
          <div className="d-flex justify-content-between mt-3">
            {timelineSteps.map((step) => (
              <div
                key={step}
                className="text-center w-100"
              >
                <div
                  className={`rounded-circle mx-auto mb-1 ${
                    timelineSteps.indexOf(step) <=
                    timelineSteps.indexOf(
                      order.status
                    )
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                  style={{
                    width: 12,
                    height: 12,
                  }}
                />
                <small>{step}</small>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BuyerOrders;
