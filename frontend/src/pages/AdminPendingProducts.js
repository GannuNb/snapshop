import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingProducts,
  approveProduct,
  rejectProduct,
} from "../redux/slices/adminProductSlice";

const AdminPendingProducts = () => {
  const dispatch = useDispatch();

  const { pendingProducts, isLoading } = useSelector(
    (state) => state.adminProduct
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPendingProducts(user.token));
  }, [dispatch, user.token]);

  const handleApprove = (id) => {
    dispatch(approveProduct({ id, token: user.token }))
      .then(() => dispatch(fetchPendingProducts(user.token)));
  };

  const handleReject = (id) => {
    dispatch(rejectProduct({ id, token: user.token }))
      .then(() => dispatch(fetchPendingProducts(user.token)));
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold text-primary mb-4">
        Pending Product Approvals
      </h3>

      {isLoading ? (
        <p>Loading...</p>
      ) : pendingProducts.length === 0 ? (
        <p>No pending products</p>
      ) : (
        <div className="row">
          {pendingProducts.map((p) => (
            <div key={p._id} className="col-md-6 mb-3">
              <div className="card shadow-sm border-0 rounded-4 p-3">

                <h5 className="fw-bold">{p.name}</h5>
                <p className="text-muted">{p.description}</p>

                <p className="mb-1">
                  <strong>Seller:</strong> {p.seller?.name}
                </p>

                <p className="mb-3">
                  <strong>Price:</strong> ₹{p.price}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApprove(p._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleReject(p._id)}
                  >
                    Reject
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingProducts;
