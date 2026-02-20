import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const { products, page, totalPages, buyerLoading } =
    useSelector((state) => state.product);

  const { user } = useSelector((state) => state.auth);
  const { successMessage } = useSelector((state) => state.cart);

  /* FILTER STATES */
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

  /* CATEGORY TOGGLE */
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((c) => c !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  /* FILTERED PRODUCTS (FRONTEND ONLY) */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category?.name);

      const priceMatch =
        (!minPrice || p.price >= Number(minPrice)) &&
        (!maxPrice || p.price <= Number(maxPrice));

      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, minPrice, maxPrice]);

  return (
    <div className="container-fluid mt-4 mb-4">
      <div className="row">

        {/* LEFT FILTER SIDEBAR */}
<div className="col-lg-2 col-md-3 mb-4 mt-5">
  <div className="card border-0 shadow-sm rounded-3">
    <div className="card-body p-3">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">Filters</h6>

        <button
          className="btn btn-sm btn-outline-primary rounded-pill px-3"
          onClick={() => {
            setSelectedCategories([]);
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear
        </button>
      </div>

      <hr className="my-2" />

      {/* CATEGORY */}
      <div className="mb-4">
        <p className="small fw-semibold text-uppercase text-muted mb-2">
          Category
        </p>

        {categoriesList.map((cat) => (
          <div className="form-check form-check-lg mb-2" key={cat}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => handleCategoryChange(cat)}
              id={cat}
            />
            <label
              className="form-check-label small fw-medium ms-2"
              htmlFor={cat}
              style={{ cursor: "pointer" }}
            >
              {cat}
            </label>
          </div>
        ))}
      </div>

      {/* PRICE RANGE */}
      <div>
        <p className="small fw-semibold text-uppercase text-muted mb-2">
          Price Range
        </p>

        <div className="input-group input-group-sm mb-2">
          <span className="input-group-text bg-light">₹</span>
          <input
            type="number"
            placeholder="Min"
            className="form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="input-group input-group-sm">
          <span className="input-group-text bg-light">₹</span>
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
  </div>
</div>





        {/* RIGHT PRODUCT SECTION */}
        <div className="col-md-9">
          <h3 className="fw-bold mb-4 text-center">Our Products</h3>

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {/* LOADING */}
          {buyerLoading && <p>Loading products...</p>}

          {/* PRODUCT GRID */}
          <div className="row">
            {(filteredProducts || []).map((p) => (
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
      </div>
    </div>
  );
};

export default BuyerProducts;
