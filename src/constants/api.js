import axios from "axios";
import link from "./link.json"; // 👈 caminho relativo ao api.js

const api = axios.create({
  baseURL: link.url,
  timeout: 10000
});

export default api;
