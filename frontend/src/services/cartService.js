import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/cart";

const getCart = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const addToCart = async (productId, token) => {
  const res = await axios.post(
    API_URL,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

const removeFromCart = async (productId, token) => {
  const res = await axios.delete(`${API_URL}/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const updateQuantity = async (productId, quantity, token) => {
  const res = await axios.put(
    API_URL,
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
};
