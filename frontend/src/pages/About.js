import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const headingStyle = {
    fontFamily: "'Playfair Display', serif",
  };

  const bodyStyle = {
    fontFamily: "'Inter', sans-serif",
  };

  const hoverCardStyle = {
    transition: "all 0.4s ease",
    cursor: "pointer",
  };

  return (
    <div style={bodyStyle}>

      {/* ================= HERO SECTION ================= */}
      <section
        className="text-white d-flex align-items-center"
        style={{
          minHeight: "45vh",   // reduced height
          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
        }}
      >
        <div className="container text-center">
          <h1
            className="fw-bold"
            style={{
              ...headingStyle,
              fontSize: "2.8rem",  // reduced size
            }}
          >
            About SnapShop
          </h1>

          <p className="mt-3 col-md-8 mx-auto fs-5">
            A premium ecommerce platform crafted for speed, security,
            and an elevated shopping experience.
          </p>
        </div>
      </section>

      {/* ================= WHO WE ARE ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">

            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="about"
                className="img-fluid rounded-4 shadow-lg"
              />
            </div>

            <div className="col-md-6">
              <h2 style={headingStyle} className="fw-bold mb-4">
                Who We Are
              </h2>

              <p className="text-muted fs-5">
                SnapShop connects buyers and sellers through intelligent
                technology, trusted systems, and a seamless user experience.
              </p>

              <p className="text-muted fs-5">
                From electronics to fashion and lifestyle essentials,
                we make online shopping simple and enjoyable.
              </p>

              <button
                className="btn btn-primary btn-lg mt-3 px-4 shadow-sm"
                onClick={() => navigate("/buyer/products")}
              >
                Start Shopping
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="py-5">
        <div className="container text-center mb-5">
          <h2 style={headingStyle} className="fw-bold">
            Our Purpose
          </h2>
          <p className="text-muted mt-2">
            Innovation driven by trust and customer satisfaction
          </p>
        </div>

        <div className="container">
          <div className="row g-4">

            <div className="col-md-6">
              <div
                className="card border-0 shadow rounded-4 p-4 h-100"
                style={hoverCardStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-10px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h4
                  className="fw-bold mb-3 text-primary"
                  style={headingStyle}
                >
                  🎯 Our Mission
                </h4>
                <p className="text-muted fs-5">
                  To simplify digital commerce by delivering verified
                  products, transparent pricing, and fast delivery.
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div
                className="card border-0 shadow rounded-4 p-4 h-100"
                style={hoverCardStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-10px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <h4
                  className="fw-bold mb-3 text-success"
                  style={headingStyle}
                >
                  🚀 Our Vision
                </h4>
                <p className="text-muted fs-5">
                  To become the most customer-centric ecommerce
                  marketplace empowering small sellers globally.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section
        className="py-5 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #6610f2, #0d6efd)",
        }}
      >
        <div className="container">
          <div className="row g-4">

            {[
              { number: "10K+", text: "Happy Customers" },
              { number: "5K+", text: "Products Listed" },
              { number: "500+", text: "Verified Sellers" },
              { number: "24/7", text: "Customer Support" },
            ].map((item, index) => (
              <div key={index} className="col-md-3">
                <div
                  className="p-4 rounded-4"
                  style={{
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.08)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <h2
                    className="fw-bold display-6"
                    style={headingStyle}
                  >
                    {item.number}
                  </h2>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 style={headingStyle} className="fw-bold mb-4">
            Ready to Experience Smart Shopping?
          </h2>

          <button
            className="btn btn-lg btn-primary px-5 py-3 shadow"
            onClick={() => navigate("/buyer/products")}
          >
            Explore Products
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;