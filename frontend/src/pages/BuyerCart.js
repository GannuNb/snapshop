import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const BuyerCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, isLoading } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingPayment, setLoadingPayment] = useState(false);

  /* LOAD CART */
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart(user.token));
    }
  }, [dispatch, user]);

  /* TOTAL */
  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0
  );

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    try {
      setLoadingPayment(true);

      /* ================= COD FLOW ================= */
      if (paymentMethod === "COD") {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/orders`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        alert("COD Order placed successfully!");
        dispatch(fetchCart(user.token));
        navigate("/buyer/orders");
        return;
      }

      /* ================= ONLINE FLOW ================= */

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/create-cart-payment-order`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Rubber Scrap Mart",
        description: "Cart Checkout",
        order_id: data.order.id,

        handler: async function (response) {
          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/orders/verify-cart-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${user.token}` } }
            );

            alert("Payment successful! Order placed.");
            dispatch(fetchCart(user.token));
            navigate("/buyer/orders");

          } catch (err) {
            alert("Payment verification failed");
            console.error(err);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Checkout failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Your Cart</h3>

      {isLoading && <p>Loading cart...</p>}

      {!isLoading && items.length === 0 && <p>Cart is empty</p>}

      {items.map((item) => (
        <div
          key={item.product._id}
          className="card mb-3 shadow-sm border-0 rounded-4 overflow-hidden"
        >
          <div className="row g-0 align-items-center">
            <div className="col-md-2">
              <img
                src={`${API_URL}/image/${item.product._id}`}
                alt={item.product?.name}
                className="w-100"
                style={{ height: "120px", objectFit: "cover" }}
              />
            </div>

            <div className="col-md-4 p-3">
              <h6 className="fw-bold mb-1">{item.product?.name}</h6>
              <p className="mb-0 text-success fw-semibold">
                ₹{item.product?.price}
              </p>
            </div>

            <div className="col-md-3 d-flex align-items-center justify-content-center">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={item.quantity <= 1}
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      productId: item.product._id,
                      quantity: item.quantity - 1,
                      token: user.token,
                    })
                  )
                }
              >
                −
              </button>

              <span className="mx-3 fw-bold">{item.quantity}</span>

              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() =>
                  dispatch(
                    updateCartQuantity({
                      productId: item.product._id,
                      quantity: item.quantity + 1,
                      token: user.token,
                    })
                  )
                }
              >
                +
              </button>
            </div>

            <div className="col-md-3 text-end p-3">
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  dispatch(
                    removeItemFromCart({
                      productId: item.product._id,
                      token: user.token,
                    })
                  )
                }
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-4">
          <h5>Total Amount: ₹{totalAmount}</h5>

          <div className="mt-3 w-50">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online (Razorpay)</option>
            </select>
          </div>

          <button
            className="btn btn-success mt-3"
            disabled={items.length === 0 || loadingPayment}
            onClick={handleCheckout}
          >
            {loadingPayment ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerCart;
