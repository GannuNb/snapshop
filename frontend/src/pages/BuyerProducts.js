import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";

const BuyerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, page, totalPages, isLoading } =
    useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);

  /* Load first page */
  useEffect(() => {
    dispatch(fetchProducts({ page: 1 }));
  }, [dispatch]);

  const changePage = (newPage) => {
    dispatch(fetchProducts({ page: newPage }));
  };

  return (
    <div className="container mt-4">
      <h3>Products</h3>

      {isLoading && <p>Loading products...</p>}

      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-3">
            <div className="card mb-3 shadow-sm">

              {/* CLICKABLE PRODUCT CARD */}
              <div
                className="card-body"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/buyer/product/${p._id}`)
                }
              >
                <h6>{p.name}</h6>
                <p className="mb-1">₹{p.price}</p>
                <small className="text-muted">
                  {p.category?.name}
                </small>
              </div>

              {/* ADD TO CART BUTTON */}
              <div className="card-footer bg-white border-0">
                <button
                  className="btn btn-sm btn-warning w-100"
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn btn-outline-secondary me-2"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

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
