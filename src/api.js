import axios from "axios";
export const DEV_MODE = import.meta.env.DEV;
export const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL + "/api", headers: {
    Authorization: `Bearer ${import.meta.env.VITE_STRAPI_TOKEN || ""}`
  }
});
