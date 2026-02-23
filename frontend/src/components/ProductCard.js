import React from "react";

const API_URL = `${process.env.REACT_APP_API_URL}/products`;

const ProductCard = React.memo(
  ({ product, navigate, dispatch, addItemToCart, user }) => {
    return (
      <div className="col-md-3 mb-4">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
          <img
            src={`${API_URL}/image/${product._id}`}
            alt={product.name}
            loading="lazy"
            className="w-100"
            style={{
              height: "200px",
              objectFit: "contain",
              background: "#f5f5f5",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/buyer/product/${product._id}`)}
          />

          <div
            className="card-body"
            onClick={() => navigate(`/buyer/product/${product._id}`)}
            style={{ cursor: "pointer" }}
          >
            <h6 className="fw-bold">{product.name}</h6>
            <p className="text-success fw-semibold mb-1">₹{product.price}</p>
            <small>{product.category?.name}</small>
          </div>

<div className="card-footer bg-white border-0">
  <div className="d-flex w-100 gap-2">
    {/* Add to Cart */}
    <button
      className="btn btn-light flex-fill btn-sm border"
      onClick={() =>
        dispatch(
          addItemToCart({
            productId: product._id,
            token: user.token,
          })
        )
      }
    >
      Add to Cart
    </button>

    {/* Buy */}
    <button
      className="btn btn-primary flex-fill btn-sm text-white fw-semibold"
      onClick={() => navigate(`/buyer/product/${product._id}`)}
    >
      Buy
    </button>
  </div>
</div>
        </div>
      </div>
    );
  },
);

export default ProductCard;
