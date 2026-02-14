import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/products";

/* BUYER — PAGINATED PRODUCTS */
const getProducts = async (page = 1) => {
  const res = await axios.get(
    `${API_URL}?page=${page}&limit=8`
  );
  return res.data;
};

/* SELLER — ADD PRODUCT */
const createProduct = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // ⭐ IMPORTANT
    },
  });

  return res.data;
};


const getSellerProducts = async (token) => {
  const res = await axios.get(
    `${API_URL}/seller/my-products`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


export default {
  getProducts,
  createProduct,
  getSellerProducts,
};
