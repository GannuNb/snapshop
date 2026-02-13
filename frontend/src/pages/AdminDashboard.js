import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const actions = [
    {
      title: "Manage Orders",
      desc: "Track, update and control all customer orders.",
      icon: "📦",
      link: "/admin/orders",
      color: "primary",
    },
    {
      title: "Manage Categories",
      desc: "Create and organize product categories.",
      icon: "🗂️",
      link: "/admin/categories",
      color: "success",
    },
  ];

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h2 className="fw-bold text-primary">Admin Dashboard</h2>
        <p className="text-muted">
          Manage your marketplace from one central place.
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
                  style={{ width: 55, height: 55, fontSize: 24 }}
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

export default AdminDashboard;
