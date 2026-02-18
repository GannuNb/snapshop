import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SellerOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/orders/seller`,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, [user.token]);

  const updateStatus = async (orderId, status) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/orders/seller/${orderId}`,
      { status },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    fetchOrders();
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">Seller Orders</h3>

      {orders.length === 0 ? (
        <div className="alert alert-info">No orders available.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">
                  Order #{order._id.slice(-6)}
                </h6>
                <span className="badge bg-primary">{order.status}</span>
              </div>

              <p className="mb-1"><strong>Buyer:</strong> {order.user?.name}</p>
              <p className="mb-3"><strong>Total:</strong> ₹{order.totalAmount}</p>

              <select
                className="form-select w-50"
                value={order.status}
                disabled={order.status === "Shipped" || order.status === "Delivered"}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
              >
                <option value="Placed">Placed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
              </select>

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
