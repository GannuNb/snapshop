import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../redux/slices/productSlice";

// const API_URL = "http://127.0.0.1:5000/api/products";
const API_URL = `${process.env.REACT_APP_API_URL}/products`;


const SellerProducts = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    approvedProducts,
    pendingProducts,
    sellerLoading,
  } = useSelector((state) => state.product);

  /* ⭐ LOAD ONLY ONCE */
  useEffect(() => {
    if (
      user?.token &&
      approvedProducts.length === 0 &&
      pendingProducts.length === 0
    ) {
      dispatch(fetchSellerProducts(user.token));
    }
  }, [
    dispatch,
    user?.token,
    approvedProducts.length,
    pendingProducts.length,
  ]);

  const renderCard = (p, isPending = false) => (
    <div key={p._id} className="col-md-4 mb-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">

        <img
          src={`${API_URL}/image/${p._id}`}
          alt={p.name}
          className="w-100"
          style={{
            height: "220px",
            objectFit: "contain",
            background: "#f5f5f5",
          }}
        />

        <div className="p-3">
          <h5 className="fw-bold">{p.name}</h5>
          <p className="text-muted small">{p.description}</p>

          <p className="mb-1">
            <strong>Category:</strong> {p.category?.name}
          </p>

          <p className="fw-bold text-success">₹{p.price}</p>

          {isPending && (
            <span className="badge bg-warning text-dark">
              Pending Approval
            </span>
          )}
        </div>

      </div>
    </div>
  );

  return (
    <div className="container py-4">

      {sellerLoading ? (
        <p>Loading seller products...</p>
      ) : (
        <>
          <h3 className="fw-bold text-primary mb-3">
            My Approved Products
          </h3>

          {approvedProducts.length === 0 ? (
            <p>No approved products yet.</p>
          ) : (
            <div className="row">
              {approvedProducts.map((p) => renderCard(p))}
            </div>
          )}

          <h3 className="fw-bold text-warning mt-5 mb-3">
            Pending Products
          </h3>

          {pendingProducts.length === 0 ? (
            <p>No pending products.</p>
          ) : (
            <div className="row">
              {pendingProducts.map((p) => renderCard(p, true))}
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default SellerProducts;
