import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { addProduct, resetProductState } from "../redux/slices/productSlice";

const SellerAddProduct = () => {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();

    // ✅ Frontend validation
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

  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(resetProductState());
    }
  }, [isError, message, dispatch]);

  return (
    <div className="container mt-4">
      <h3>Seller – Add Product</h3>

      <form onSubmit={submitHandler}>
        <input
          className="form-control mb-2"
          placeholder="Product name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Product description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <select
          className="form-select mb-2"
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

        <button className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default SellerAddProduct;
