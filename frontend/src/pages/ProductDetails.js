import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1); // ⭐ QTY RESTORED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [address, setAddress] = useState(emptyAddress);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  /* FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setProduct(res.data);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* LOAD ADDRESSES */
  const loadAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/addresses", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setSavedAddresses(res.data);

      const defaultIndex = res.data.findIndex((a) => a.isDefault);

      if (res.data.length > 0) {
        const index = defaultIndex !== -1 ? defaultIndex : 0;
        setSelectedAddressIndex(index);
        setAddress(res.data[index]);
      }
    } catch {
      console.log("Address load failed");
    }
  };

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  /* INPUT CHANGE */
  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  /* ADD NEW ADDRESS */
  const addNewAddressHandler = () => {
    setAddress(emptyAddress);
    setEditingId(null);
    setShowForm(true);
  };

  /* EDIT ADDRESS */
  const editAddressHandler = (addr) => {
    setAddress(addr);
    setEditingId(addr._id);
    setShowForm(true);
  };

  /* SAVE ADDRESS */
  const saveAddressHandler = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/auth/addresses/${editingId}`,
          address,
          { headers: { Authorization: `Bearer ${user.token}` } },
        );
      } else {
        await axios.post("http://localhost:5000/api/auth/addresses", address, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      }

      setShowForm(false);
      setEditingId(null);
      loadAddresses();
    } catch {
      alert("Address save failed");
    }
  };

  /* DELETE ADDRESS */
  const deleteAddressHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/addresses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      loadAddresses();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  /* SELECT DEFAULT ADDRESS */
  const selectAddressHandler = async (addr, index) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/addresses/default/${addr._id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } },
      );

      setSelectedAddressIndex(index);
      setAddress(addr);
      loadAddresses();
    } catch {
      alert("Failed to set default");
    }
  };

  /* BUY NOW */
  const buyNowHandler = async () => {
    try {
      /* ===============================
       1️⃣ COD FLOW
    =============================== */
      if (paymentMethod === "COD") {
        await axios.post(
          "http://localhost:5000/api/orders/cod-order",
          {
            productId: product._id,
            quantity: qty,
            shippingAddress: address,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        alert("COD order placed successfully!");
        navigate("/buyer/orders");
        return;
      }

      /* ===============================
       2️⃣ ONLINE PAYMENT FLOW
    =============================== */

      // Create Razorpay order
      const { data } = await axios.post(
        "http://localhost:5000/api/orders/create-payment-order",
        {
          productId: product._id,
          quantity: qty,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      const options = {
        key: "rzp_test_dKgP8VQJaHwf20", // only key_id
        amount: data.order.amount,
        currency: "INR",
        name: "Rubber Scrap Mart",
        description: product.name,
        order_id: data.order.id,

        handler: async function (response) {
          try {
            // Verify payment & create order
            await axios.post(
              "http://localhost:5000/api/orders/verify-payment",
              {
                productId: product._id,
                quantity: qty,
                shippingAddress: address,

                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${user.token}` },
              },
            );

            alert("Payment successful! Order placed.");
            navigate("/buyer/orders");
          } catch (err) {
            alert("Payment verification failed");
            console.error(err);
          }
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: address?.phone,
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Buy Now failed");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm rounded-4 overflow-hidden">
        <div className="row g-0">
          {/* PRODUCT IMAGE */}
          <div className="col-md-5">
            <img
              src={`${API_URL}/image/${product._id}`}
              alt={product.name}
              className="w-100 h-100"
              style={{ objectFit: "cover", minHeight: "350px" }}
            />
          </div>

          {/* PRODUCT DETAILS */}
          <div className="col-md-7 p-4">
            <h3>{product.name}</h3>
            <h4 className="text-success">₹{product.price}</h4>

            {/* ⭐ QTY SECTION */}
            <div className="d-flex align-items-center my-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>

              <span className="mx-3 fw-bold">{qty}</span>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setQty((q) => q + 1)}
              >
                +
              </button>
            </div>

            <hr />

            {/* ADDRESSES */}
            <div className="d-flex justify-content-between mb-2">
              <h5>Saved Addresses</h5>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={addNewAddressHandler}
              >
                + Add New
              </button>
            </div>

            {savedAddresses.map((addr, index) => (
              <div key={addr._id} className="border rounded p-2 mb-2">
                <input
                  type="radio"
                  checked={selectedAddressIndex === index}
                  onChange={() => selectAddressHandler(addr, index)}
                />

                <span className="ms-2">
                  {addr.fullName}, {addr.addressLine}, {addr.city}
                </span>

                <button
                  className="btn btn-sm btn-link float-end"
                  onClick={() => editAddressHandler(addr)}
                >
                  ✏️
                </button>

                <button
                  className="btn btn-sm btn-link text-danger float-end"
                  onClick={() => deleteAddressHandler(addr._id)}
                >
                  🗑
                </button>
              </div>
            ))}

            <div className="my-3">
              <h6>Payment Method</h6>

              <div>
                <input
                  type="radio"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                />
                <span className="ms-2">Online Payment</span>
              </div>

              <div>
                <input
                  type="radio"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="ms-2">Cash on Delivery</span>
              </div>
            </div>

            <button
              className="btn btn-success mt-3"
              onClick={buyNowHandler}
              disabled={!address?.fullName}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FORM */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 999 }}
        >
          <div
            className="bg-white p-4 rounded shadow"
            style={{ width: "400px" }}
          >
            <h5>{editingId ? "Edit Address" : "Add Address"}</h5>

            {[
              "fullName",
              "phone",
              "addressLine",
              "city",
              "state",
              "pincode",
            ].map((field) => (
              <input
                key={field}
                className="form-control mb-2"
                name={field}
                placeholder={field}
                value={address[field]}
                onChange={handleAddressChange}
              />
            ))}

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary btn-sm"
                onClick={saveAddressHandler}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
