import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect after login
  useEffect(() => {
    if (isSuccess && user) {
      if (user.role === "buyer") navigate("/");
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
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "420px", borderRadius: "12px" }}>
        
        <h3 className="text-center fw-bold mb-3">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">
          Login to continue shopping on SnapShop
        </p>

        {isSuccess && (
          <div className="alert alert-success py-2">{message}</div>
        )}

        {isError && (
          <div className="alert alert-danger py-2">{message}</div>
        )}

        <form onSubmit={onSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={onChange}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={onChange}
            required
          />

          <button
            className="btn btn-primary w-100 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* SIGNUP LINK */}
        <div className="text-center mt-3">
          <small className="text-muted">
            Don’t have an account?{" "}
            <Link to="/register" className="fw-semibold text-primary">
              Sign Up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
