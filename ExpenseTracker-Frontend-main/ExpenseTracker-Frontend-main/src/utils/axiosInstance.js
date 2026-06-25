import axios from 'axios';

// 🚀 Pointing straight to your live Render backend
export const BASE_URL = "https://expense-tracker-8ho5.onrender.com"; 

const axiosInstance = axios.create({
    baseURL: "https://expense-tracker-8ho5.onrender.com/", // 👈 Add the trailing slash here
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);     

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = '/login'; 
            } else if (error.response.status === 500) {
                console.error("Internal Server Error. Try again later."); 
            }
            return Promise.reject(error);
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again later.");
        }
        return Promise.reject(error);
    }
);

// 🔐 Dual export to completely stop the "default is not exported" Vite crash!
export { axiosInstance };
export default axiosInstance;