import axios from "axios";

// const API_URL = "http://127.0.0.1:5000/api/products";
const API_URL = `${process.env.REACT_APP_API_URL}/products`;


const getPendingProducts = async (token) => {
  const res = await axios.get(`${API_URL}/pending-products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const approveProduct = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/approve-product/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const rejectProduct = async (id, token) => {
  const res = await axios.put(
    `${API_URL}/reject-product/${id}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default {
  getPendingProducts,
  approveProduct,
  rejectProduct,
};
