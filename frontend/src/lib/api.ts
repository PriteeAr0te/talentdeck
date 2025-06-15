import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    // baseURL: process.env.BASE_URL || "https://talentdeck-kappa.vercel.app/api",
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
