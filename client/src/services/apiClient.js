import axios from "axios";

const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzkxODI4MTgwLCJleHAiOjE3OTI0MzI5ODB9.W9wPf8LBIQ8yJ1iixK46o3zU1x8eioYYIeem6fS3amk";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001",
  headers: {
    Authorization: `Bearer ${DEMO_TOKEN}`,
  },
});

export default apiClient;
