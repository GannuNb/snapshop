import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../redux/slices/cartSlice";
import { placeOrder, resetOrderState } from "../redux/slices/orderSlice";

const API_URL = "http://127.0.0.1:5000/api/products";

const BuyerCart = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, isLoading } = useSelector((state) => state.cart);
  const { success } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  /* LOAD CART */
  useEffect(() => {
    dispatch(fetchCart(user.token));
  }, [dispatch, user.token]);

  /* AFTER ORDER */
  useEffect(() => {
    if (success) {
      alert(`Order placed successfully via ${paymentMethod}`);
      dispatch(resetOrderState());
      dispatch(fetchCart(user.token));
    }
  }, [success, dispatch, user.token, paymentMethod]);

  /* TOTAL */
  const totalAmount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Your Cart</h3>

      {isLoading && <p>Loading cart...</p>}

      {!isLoading && items.length === 0 && (
        <p>Cart is empty</p>
      )}

      {items.map((item) => (
        <div
          key={item.product._id}
          className="card mb-3 shadow-sm border-0 rounded-4 overflow-hidden"
        >
          <div className="row g-0 align-items-center">

            {/* ⭐ LEFT SIDE IMAGE */}
            <div className="col-md-2">
              <img
                src={`${API_URL}/image/${item.product._id}`}
                alt={item.product?.name}
                className="w-100"
                style={{
                  height: "120px",
                  objectFit: "cover",
                  background: "#f5f5f5",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            {/* PRODUCT INFO */}
            <div className="col-md-4 p-3">
              <h6 className="fw-bold mb-1">
                {item.product?.name}
              </h6>
              <p className="mb-0 text-success fw-semibold">
                ₹{item.product?.price}
              </p>
            </div>

            {/* QUANTITY */}
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

              <span className="mx-3 fw-bold">
                {item.quantity}
              </span>

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

            {/* REMOVE */}
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

      {/* ORDER SECTION */}
      {items.length > 0 && (
        <div className="mt-4">
          <h5>Total Amount: ₹{totalAmount}</h5>

          <div className="mt-3 w-50">
            <label className="form-label">
              Payment Method
            </label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }
            >
              <option value="COD">
                Cash on Delivery
              </option>
              <option value="UPI">
                UPI (Mock)
              </option>
            </select>
          </div>

          <button
            className="btn btn-success mt-3"
            onClick={() =>
              dispatch(placeOrder(user.token))
            }
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerCart;
