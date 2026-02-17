import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchProducts } from "../redux/slices/productSlice";
import { addItemToCart, clearCartMessage } from "../redux/slices/cartSlice";

import ProductCard from "../components/ProductCard";

const BuyerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, page, totalPages, buyerLoading } =
    useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);
  const { successMessage } = useSelector((state) => state.cart);

  /* LOAD PRODUCTS FIRST TIME */
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ page: 1 }));
    }
  }, [dispatch, products.length]);

  /* CLEAR SUCCESS ALERT */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearCartMessage());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  /* CHANGE PAGE */
  const changePage = (newPage) => {
    dispatch(fetchProducts({ page: newPage }));
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">Products</h3>

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* LOADING */}
      {buyerLoading && <p>Loading products...</p>}

      {/* PRODUCT GRID */}
      <div className="row">
        {(products || []).map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            navigate={navigate}
            dispatch={dispatch}
            addItemToCart={addItemToCart}
            user={user}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
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
