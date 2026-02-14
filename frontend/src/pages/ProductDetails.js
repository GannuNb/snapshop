import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = "http://localhost:5000/api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  /* BUY NOW */
  const buyNowHandler = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders/buy-now",
        {
          productId: product._id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate("/buyer/orders");
    } catch {
      alert("Buy Now failed");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">{error}</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="row g-0">

          {/* ⭐ PRODUCT IMAGE */}
          <div className="col-md-5">
            <img
              src={`${API_URL}/image/${product._id}`}
              alt={product.name}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                minHeight: "350px",
                background: "#f5f5f5",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* PRODUCT DETAILS */}
          <div className="col-md-7 p-4">
            <h3 className="fw-bold">{product.name}</h3>

            <p className="text-muted mb-2">
              Category: {product.category?.name}
            </p>

            <h4 className="text-success mb-3">
              ₹{product.price}
            </h4>

            <p>{product.description}</p>

            {/* QTY */}
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setQty((q) => Math.max(1, q - 1))
                }
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

            <button
              className="btn btn-success px-4"
              onClick={buyNowHandler}
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
