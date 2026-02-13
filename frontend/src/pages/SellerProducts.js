import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../redux/slices/productSlice";

const SellerProducts = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchSellerProducts(user.token));
  }, [dispatch, user.token]);

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">
        My Approved Products
      </h3>

      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No approved products yet.</p>
      ) : (
        <div className="row">
          {products.map((p) => (
            <div key={p._id} className="col-md-4 mb-3">
              <div className="card shadow-sm border-0 rounded-4 p-3">
                <h5 className="fw-bold">{p.name}</h5>

                <p className="text-muted">{p.description}</p>

                <p className="mb-1">
                  <strong>Category:</strong> {p.category?.name}
                </p>

                <p className="fw-bold text-success">
                  ₹{p.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
