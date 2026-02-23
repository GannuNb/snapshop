import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay scroll until after render
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto", // IMPORTANT: do not use smooth
      });
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;