import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (config) => {
    if (config.url.includes("/login")) {
      return config;
    }
    const token = localStorage.getItem("token");
    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    throw error;
  }
);

axios.interceptors.response.use(
  (config) => {
      console.log(config?.data)
    if (config.status === 206) {
      console.log("in 206");
      localStorage.setItem("token", config?.data?.token);
    

    }
        return config;
  },
  (error) => {
    if (error.response.status === 401) {
         
    }
    return Promise.reject(error);
  }
);

export default axios;
