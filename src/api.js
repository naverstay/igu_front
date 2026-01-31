import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, headers: {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_TOKEN || ""}`
  }
});
