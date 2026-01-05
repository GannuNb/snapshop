import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIX: extract user
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  useEffect(() => {
    if (isSuccess && user) {
      if (user.role === "buyer") navigate("/buyer");
      else if (user.role === "seller") navigate("/seller");

      dispatch(reset());
    }
  }, [isSuccess, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="container col-md-4 mt-5">
      <h3 className="text-center mb-4">Register</h3>

      {isSuccess && <div className="alert alert-success">{message}</div>}
      {isError && <div className="alert alert-danger">{message}</div>}

      <form onSubmit={onSubmit}>
        <input
          className="form-control mb-3"
          name="name"
          placeholder="Name"
          onChange={onChange}
        />

        <input
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          onChange={onChange}
        />

        <input
          type="password"
          className="form-control mb-3"
          name="password"
          placeholder="Password"
          onChange={onChange}
        />

        <select
          className="form-select mb-3"
          name="role"
          onChange={onChange}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button className="btn btn-success w-100">
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
