import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const actions = [
    {
      title: "Add Product",
      desc: "List new products and grow your store.",
      icon: "➕",
      link: "/seller/add-product",
      color: "primary",
    },
    {
      title: "Manage Orders",
      desc: "Track and update customer orders.",
      icon: "📦",
      link: "/seller/orders",
      color: "success",
    },
  ];

  return (
    <div className="container py-5">

      <div className="mb-5">
        <h2 className="fw-bold text-primary">Seller Dashboard</h2>
        <p className="text-muted">
          Manage your products and orders efficiently.
        </p>
      </div>

      <div className="row g-4">
        {actions.map((item, index) => (
          <div className="col-md-6" key={index}>
            <div
              className="card border-0 shadow-sm rounded-4 p-4 h-100"
              style={{ transition: "0.3s" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-6px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="d-flex align-items-center mb-3">
                <div
                  className={`bg-${item.color} text-white rounded-circle d-flex align-items-center justify-content-center`}
                  style={{ width: 55, height: 55, fontSize: 22 }}
                >
                  {item.icon}
                </div>
                <h5 className="fw-bold ms-3 mb-0">{item.title}</h5>
              </div>

              <p className="text-muted">{item.desc}</p>

              <Link to={item.link} className={`btn btn-${item.color}`}>
                Open
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SellerDashboard;
