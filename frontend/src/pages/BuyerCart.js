import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const BuyerCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { items, isLoading } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingPayment, setLoadingPayment] = useState(false);

  /* ================= ADDRESS STATES ================= */
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [address, setAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart(user.token));
    }
  }, [dispatch, user]);

  /* ================= LOAD ADDRESSES ================= */
  const loadAddresses = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/auth/addresses`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSavedAddresses(res.data);

      if (res.data.length > 0) {
        const defaultIndex = res.data.findIndex((a) => a.isDefault);
        const index = defaultIndex !== -1 ? defaultIndex : 0;
        setSelectedAddressIndex(index);
        setAddress(res.data[index]);
      } else {
        setSelectedAddressIndex(null);
        setAddress(null);
      }
    } catch {
      console.log("Address load failed");
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) loadAddresses();
  }, [user, loadAddresses]);

  /* ================= ADDRESS HANDLERS ================= */
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const addNewAddressHandler = () => {
    setAddress(emptyAddress);
    setShowForm(true);
  };

  const saveAddressHandler = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/addresses`,
        address,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setShowForm(false);
      loadAddresses();
    } catch {
      alert("Address save failed");
    }
  };

  /* ================= TOTAL ================= */
  const totalAmount = items.reduce(
    (sum, item) =>
      sum + Number(item.product?.price || 0) * Number(item.quantity || 0),
    0
  );

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    try {
      if (!address) {
        alert("Please add/select delivery address");
        return;
      }

      setLoadingPayment(true);

      /* COD */
      if (paymentMethod === "COD") {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/orders`,
          { shippingAddress: address },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        alert("COD Order placed successfully!");
        dispatch(fetchCart(user.token));
        navigate("/buyer/orders");
        return;
      }

      /* ONLINE */
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/create-cart-payment-order`,
        { shippingAddress: address },
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
          await axios.post(
            `${process.env.REACT_APP_API_URL}/orders/verify-cart-payment`,
            {
              ...response,
              shippingAddress: address,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );

          alert("Payment successful!");
          dispatch(fetchCart(user.token));
          navigate("/buyer/orders");
        },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Checkout failed");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h3 className="fw-bold mb-4">Your Cart</h3>

      {isLoading && <p>Loading cart...</p>}

      {!isLoading && items.length === 0 && (
        <p className="text-muted">Your cart is empty</p>
      )}

      {/* ================= CART ITEMS ================= */}
      {items.map((item) => (
        <div
          key={item.product._id}
          className="card mb-3 shadow-sm rounded-4 overflow-hidden"
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
              <h6 className="fw-bold">{item.product?.name}</h6>
              <p className="text-success fw-semibold">
                ₹{item.product?.price}
              </p>
            </div>

            <div className="col-md-3 d-flex justify-content-center align-items-center">
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

      {/* ================= ADDRESS SECTION ================= */}
      {items.length > 0 && (
        <>
          <hr />
          <h5>Delivery Address</h5>

          {savedAddresses.length === 0 && (
            <p className="text-danger">
              No address found. Please add address.
            </p>
          )}

          {savedAddresses.map((addr, index) => (
            <div key={addr._id} className="border p-2 rounded mb-2">
              <input
                type="radio"
                checked={selectedAddressIndex === index}
                onChange={() => {
                  setSelectedAddressIndex(index);
                  setAddress(addr);
                }}
              />
              <span className="ms-2">
                {addr.fullName}, {addr.addressLine}, {addr.city}
              </span>
            </div>
          ))}

          <button
            className="btn btn-sm btn-outline-primary mt-2"
            onClick={addNewAddressHandler}
          >
            + Add Address
          </button>

          {/* ================= TOTAL + PAYMENT ================= */}
          <hr />
          <h5>Total Amount: ₹{totalAmount}</h5>

          <div className="mt-3 w-50">
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          <button
            className="btn btn-success mt-3"
            disabled={!address || loadingPayment}
            onClick={handleCheckout}
          >
            {loadingPayment ? "Processing..." : "Place Order"}
          </button>
        </>
      )}

      {/* ================= ADDRESS MODAL ================= */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 999 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: 400 }}>
            <h5>Add Address</h5>

            {["fullName","phone","addressLine","city","state","pincode"].map(field => (
              <input
                key={field}
                className="form-control mb-2"
                name={field}
                placeholder={field}
                value={address?.[field] || ""}
                onChange={handleAddressChange}
              />
            ))}

            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={saveAddressHandler}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerCart;