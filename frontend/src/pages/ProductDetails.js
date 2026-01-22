import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

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
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(res.data);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* BUY NOW - DIRECT ORDER */
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
      <div className="card p-4 shadow-sm">
        <h3>{product.name}</h3>
        <p className="text-muted">
          Category: {product.category?.name}
        </p>

        <h4 className="text-success">₹{product.price}</h4>
        <p>{product.description}</p>

        {/* QTY */}
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>

          <span className="mx-3">{qty}</span>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>

        <button
          className="btn btn-success w-50"
          onClick={buyNowHandler}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
