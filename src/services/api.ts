import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        if (!config.headers) {
            config.headers = {};
        }
        if ("set" in config.headers && typeof config.headers.set === "function") {
            config.headers.set("Authorization", `Bearer ${token}`);
        } else {
            (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
        }
    }
    return config;
});
