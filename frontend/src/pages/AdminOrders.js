import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://127.0.0.1:5000/api/orders",
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, [user.token]);

  const updateStatus = async (orderId, status) => {
    await axios.put(
      `http://127.0.0.1:5000/api/orders/admin/${orderId}`,
      { status },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    fetchOrders();
  };

  const statusBadge = (status) => {
    if (status === "Delivered") return "success";
    if (status === "Cancelled") return "danger";
    return "warning";
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">Admin Orders</h3>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders found.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Order #{order._id.slice(-6)}</h6>
                <span className={`badge bg-${statusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <p className="mb-1">
                <strong>Buyer:</strong> {order.user?.name}
              </p>

              <div className="mt-3">
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => updateStatus(order._id, "Delivered")}
                >
                  Mark Delivered
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => updateStatus(order._id, "Cancelled")}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
