import axios from "axios";

const BASE_URL = " http://localhost:3001";
                      // 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});

let ngrokAwake = false;

api.interceptors.request.use(async config => {
    if (!ngrokAwake) {
        try {
            // Faz a requisição para uma rota existente da API
            await axios.get(`${BASE_URL}/pacientes`);
            console.log("✅ Ngrok acordado com sucesso");
            ngrokAwake = true;
        } catch (error) {
            console.error("❌ Erro ao acordar o Ngrok:", error.message);
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
