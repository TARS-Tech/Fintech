import axios from "axios";

const BACKEND_URL = "https://fintech-ow83.onrender.com/api";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000,
});

export default api;
