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

  return (
    <div className="container mt-4">
      <h3>Admin Orders</h3>

      {orders.map((order) => (
        <div key={order._id} className="card mb-3 p-3">
          <p><strong>Buyer:</strong> {order.user?.name}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <button
            className="btn btn-success me-2"
            onClick={() => updateStatus(order._id, "Delivered")}
          >
            Mark Delivered
          </button>

          <button
            className="btn btn-danger"
            onClick={() => updateStatus(order._id, "Cancelled")}
          >
            Cancel Order
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
