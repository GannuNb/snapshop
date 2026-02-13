import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addProduct, resetProductState } from "../redux/slices/productSlice";

const SellerAddProduct = () => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);

  // ⚠️ IMPORTANT → success (not isSuccess)
  const { isLoading, isError, success, message } = useSelector(
    (state) => state.product
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  /* FETCH CATEGORIES */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  /* SUBMIT FORM */
  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.price || !form.category) {
      alert("All fields are required");
      return;
    }

    dispatch(
      addProduct({
        data: {
          ...form,
          price: Number(form.price),
        },
        token: user.token,
      })
    );
  };

  /* HANDLE SUCCESS + ERROR */
  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(resetProductState());
    }

    if (success) {
      alert("✅ Product added successfully!");

      // CLEAR FORM
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
      });

      dispatch(resetProductState());
    }
  }, [isError, success, message, dispatch]);

  return (
    <div className="container py-4">

      <h3 className="fw-bold text-primary mb-4">Add New Product</h3>

      <div className="card shadow-sm border-0 rounded-4 p-4">
        <form onSubmit={submitHandler}>

          {/* PRODUCT NAME */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Product Name</label>
            <input
              className="form-control"
              placeholder="Enter product name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Product description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* PRICE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTON */}
          <button className="btn btn-primary px-4" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Product"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default SellerAddProduct;
