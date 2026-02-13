import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: "🚀",
      title: "Fast Delivery",
      text: "Lightning-fast shipping with real-time tracking updates.",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      text: "Encrypted checkout with trusted payment partners.",
    },
    {
      icon: "⭐",
      title: "Trusted Quality",
      text: "Verified sellers and carefully curated products.",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    },
    {
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    },
    {
      name: "Accessories",
      img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      name: "Home & Living",
      img: "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
    },
  ];

  return (
    <div className={styles.homeWrapper}>
      {/* ================= HERO ================= */}
      <section className={styles.hero}>
        <div className="container text-center">
          <h1 className={styles.heroTitle}>
            Welcome to <span>SnapShop</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Discover premium products, unbeatable prices, and a shopping
            experience designed for modern users.
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/buyer/products" className={styles.primaryBtn}>
              🛒 Shop Now
            </Link>

            {user && (
              <Link to="/buyer/orders" className={styles.secondaryBtn}>
                📦 My Orders
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionHeading}>Why Shop With SnapShop?</h2>
          <p className={styles.sectionSub}>
            Everything you need for a seamless and premium shopping experience.
          </p>

          <div className="row g-4 mt-4">
            {features.map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIconWrapper}>
                    <span className={styles.featureIcon}>{item.icon}</span>
                  </div>

                  <h5 className={styles.featureTitle}>{item.title}</h5>

                  <p className={styles.featureText}>{item.text}</p>

                  <span className={styles.featureTag}>Learn More →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= START SHOPPING ================= */}
      <section className={styles.startShopping}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-md-6">
              <h2 className={styles.sectionHeadingLeft}>
                Start Shopping Smarter Today
              </h2>

              <p className={styles.startText}>
                Browse thousands of curated products, compare prices instantly,
                and enjoy a smooth checkout experience. SnapShop helps you save
                time while discovering trending products loved by customers.
              </p>

              <ul className={styles.startList}>
                <li>✔ Smart product discovery</li>
                <li>✔ Secure and quick checkout</li>
                <li>✔ Real-time order tracking</li>
                <li>✔ Trusted brands & sellers</li>
              </ul>

              <Link to="/buyer/products" className={styles.primaryBtn}>
                Start Shopping
              </Link>
            </div>

            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
                alt="shopping"
                className={styles.shoppingImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRENDING CATEGORIES ================= */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <h2 className={styles.sectionHeading}>Trending Categories</h2>
          <p className={styles.sectionSub}>
            Categories customers are exploring the most.
          </p>

          <div className="row g-4 mt-3">
            {categories.map((cat, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className={styles.categoryCard}>
                  <img src={cat.img} alt={cat.name} />
                  <div className={styles.categoryOverlay}>
                    <h6>{cat.name}</h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROMO ================= */}
      <section className={styles.promo}>
        <div className="container text-center mb-0">
          <h2 className={styles.promoHeading}>
            Big Deals Are Waiting For You!
          </h2>
          <p>Grab exclusive discounts before they’re gone.</p>

          <Link to="/buyer/products" className={styles.primaryBtn}>
            Explore Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
