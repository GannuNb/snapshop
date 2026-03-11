
const ProductCardSkeleton = () => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 position-relative">

        <div
          style={{
            height: "200px",
            background: "#e9ecef",
            animation: "pulse 1.5s infinite",
          }}
        />

        <div className="card-body">
          <div
            style={{
              height: "18px",
              width: "80%",
              background: "#e9ecef",
              marginBottom: "10px",
              animation: "pulse 1.5s infinite",
            }}
          />

          <div
            style={{
              height: "18px",
              width: "40%",
              background: "#e9ecef",
              marginBottom: "10px",
              animation: "pulse 1.5s infinite",
            }}
          />

          <div
            style={{
              height: "14px",
              width: "50%",
              background: "#e9ecef",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>

        <div className="card-footer bg-white border-0">
          <div
            style={{
              height: "35px",
              background: "#e9ecef",
              animation: "pulse 1.5s infinite",
            }}
          />
        </div>

      </div>
    </div>
  );
};

export default ProductCardSkeleton;

