import axios from "axios";

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://talentdeck-kappa.vercel.app/api",
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" && localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
