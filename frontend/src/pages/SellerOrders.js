import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const SellerOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://127.0.0.1:5000/api/orders/seller",
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, [user.token]);

  const updateStatus = async (orderId, status) => {
    await axios.put(
      `http://127.0.0.1:5000/api/orders/seller/${orderId}`,
      { status },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
    fetchOrders();
  };

  return (
    <div className="container mt-4">
      <h3>Seller Orders</h3>

      {orders.map((order) => (
        <div key={order._id} className="card mb-3 p-3">
          <p><strong>Buyer:</strong> {order.user?.name}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>

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
      ))}
    </div>
  );
};

export default SellerOrders;
