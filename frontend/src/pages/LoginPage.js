import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ FIX: extract user
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isSuccess && user) {
      if (user.role === "buyer") navigate("/buyer");
      else if (user.role === "seller") navigate("/seller");
      else if (user.role === "admin") navigate("/admin");

      dispatch(reset());
    }
  }, [isSuccess, user, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="container col-md-4 mt-5">
      <h3 className="text-center mb-4">Login</h3>

      {isSuccess && <div className="alert alert-success">{message}</div>}
      {isError && <div className="alert alert-danger">{message}</div>}

      <form onSubmit={onSubmit}>
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

        <button className="btn btn-primary w-100">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
