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
    dispatch(addCategory({ data: { name }, token: user.token }));
    setName("");
  };

  return (
    <div className="container mt-4">
      <h3>Admin – Categories</h3>

      <form onSubmit={submitHandler} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-dark">Add Category</button>
      </form>

      <ul className="list-group">
        {categories.map((cat) => (
          <li key={cat._id} className="list-group-item">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCategories;
