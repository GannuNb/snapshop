import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { addItemToCart, clearCartMessage } from "../redux/slices/cartSlice";

const API_URL = "http://127.0.0.1:5000/api/products";

const BuyerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, page, totalPages, buyerLoading } =
    useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);
  const { successMessage } = useSelector((state) => state.cart);

  /* LOAD ONLY FIRST TIME */
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, [dispatch, products.length]);

  /* CLEAR ALERT */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearCartMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  const changePage = (newPage) => {
    dispatch(fetchProducts({ page: newPage }));
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Products</h3>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {buyerLoading && <p>Loading products...</p>}

      <div className="row">
        {(products || []).map((p) => (
          <div key={p._id} className="col-md-3 mb-4">
            <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">

              <img
                src={`${API_URL}/image/${p._id}`}
                alt={p.name}
                className="w-100"
                style={{
                  height: "200px",
                  objectFit: "contain",
                  background: "#f5f5f5",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/buyer/product/${p._id}`)}
              />

              <div
                className="card-body"
                onClick={() => navigate(`/buyer/product/${p._id}`)}
                style={{ cursor: "pointer" }}
              >
                <h6 className="fw-bold">{p.name}</h6>
                <p className="text-success fw-semibold mb-1">
                  ₹{p.price}
                </p>
                <small>{p.category?.name}</small>
              </div>

              <div className="card-footer bg-white border-0">
                <button
                  className="btn btn-warning w-100 btn-sm"
                  onClick={() =>
                    dispatch(
                      addItemToCart({
                        productId: p._id,
                        token: user.token,
                      })
                    )
                  }
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-secondary me-2"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="btn btn-outline-secondary ms-2"
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyerProducts;
