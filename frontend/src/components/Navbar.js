import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart } from "../redux/slices/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  // 🔥 Load cart globally for navbar count
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart(user.token));
    }
  }, [dispatch, user]);

  const count = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link to="/buyer/products" className="navbar-brand">
        Flipkart Clone
      </Link>

      {user && (
        <Link to="/buyer/cart" className="btn btn-warning">
          Cart ({count})
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
