import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { fetchProducts } from "../redux/slices/productSlice";
import { addItemToCart, clearCartMessage } from "../redux/slices/cartSlice";
import ProductCard from "../components/ProductCard";

const categoriesList = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Accessories",
  "Toys",
  "snacks",
  "Hair care",
  "Beauty",
  "sports",
];

const BuyerProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, totalPages, buyerLoading } = useSelector(
    (state) => state.product,
  );

  const { user } = useSelector((state) => state.auth);
  const { successMessage } = useSelector((state) => state.cart);

  /* FILTER STATES */
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* HANDLE CATEGORY & SEARCH FROM NAVIGATION */
  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategories([location.state.category]);
    }

    if (location.state?.search) {
      setSearchQuery(location.state.search);
    }
  }, [location.state]);

  /* RESET PAGE WHEN FILTERS CHANGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategories, minPrice, maxPrice]);

  /* FETCH PRODUCTS FROM BACKEND */
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: currentPage,
        search: searchQuery,
        category: selectedCategories.join(","),
        minPrice,
        maxPrice,
      }),
    );
  }, [
    dispatch,
    currentPage,
    searchQuery,
    selectedCategories,
    minPrice,
    maxPrice,
  ]);

  /* CLEAR SUCCESS MESSAGE */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearCartMessage());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch]);

  /* CATEGORY TOGGLE */
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <div className="row">
        {/* ================= LEFT FILTER ================= */}
        <div className="col-lg-2 col-md-3 mb-4 mt-5">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Filters</h6>
                <button
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                  onClick={() => {
                    setSelectedCategories([]);
                    setMinPrice("");
                    setMaxPrice("");
                    setSearchQuery("");
                  }}
                >
                  Clear
                </button>
              </div>

              <hr />

              <p className="small fw-semibold text-uppercase text-muted">
                Category
              </p>

              {categoriesList.map((cat) => (
                <div className="form-check mb-2" key={cat}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                    id={cat}
                  />
                  <label className="form-check-label ms-2" htmlFor={cat}>
                    {cat}
                  </label>
                </div>
              ))}

              <hr />

              <p className="small fw-semibold text-uppercase text-muted">
                Price Range
              </p>

              <input
                type="number"
                placeholder="Min"
                className="form-control mb-2"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />

              <input
                type="number"
                placeholder="Max"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT PRODUCTS ================= */}
        <div className="col-md-9">
          <h3 className="fw-bold mb-4 text-center">Our Products</h3>

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {buyerLoading && <p>Loading products...</p>}

          {!buyerLoading && products.length === 0 && (
            <div className="text-center text-muted mt-5">
              <h5>No products found</h5>
            </div>
          )}

          <div className="row">
            {products.map((p) => (
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

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <button
                className="btn btn-outline-secondary me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>

              <span className="align-self-center">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-outline-secondary ms-2"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerProducts;
