import axios from "axios";

// const API_URL = "http://127.0.0.1:5000/api/orders";
const API_URL = `${process.env.REACT_APP_API_URL}/orders`;


const placeOrder = async (token) => {
  const res = await axios.post(
    API_URL,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

const getMyOrders = async (token) => {
  const res = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default {
  placeOrder,
  getMyOrders,
};
