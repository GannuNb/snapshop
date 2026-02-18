import axios from "axios";

// const API_URL = "http://127.0.0.1:5000/api/auth";
const API_URL = `${process.env.REACT_APP_API_URL}/auth`;


const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

const authService = {
  register,
  login,
};

export default authService;
