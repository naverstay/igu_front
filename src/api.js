import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api", headers: {
    Authorization: `Bearer ${import.meta.env.REACT_APP_STRAPI_TOKEN || ""}`
  }
});
