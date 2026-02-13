import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, addCategory } from "../redux/slices/categorySlice";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { user } = useSelector((state) => state.auth);

  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    dispatch(addCategory({ data: { name }, token: user.token }));
    setName("");
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">Manage Categories</h3>

      {/* ADD CATEGORY CARD */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h5 className="fw-semibold mb-3">Add New Category</h5>

        <form onSubmit={submitHandler} className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="btn btn-dark px-4">Add</button>
        </form>
      </div>

      {/* CATEGORY LIST */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">All Categories</h5>

          {categories.length === 0 ? (
            <p className="text-muted mb-0">No categories yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {cat.name}
                  <span className="badge bg-primary">Active</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
