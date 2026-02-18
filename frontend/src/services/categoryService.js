import axios from "axios";

// const API_URL = "http://127.0.0.1:5000/api/categories";
const API_URL = `${process.env.REACT_APP_API_URL}/categories`;


const createCategory = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

const getCategories = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export default {
  createCategory,
  getCategories,
};
