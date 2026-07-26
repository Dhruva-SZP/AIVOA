import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const analyzeText = (raw_text, source_type = "text") =>
  api.post("/api/ai/analyze/text", { raw_text, source_type }).then((r) => r.data);

export const analyzeUpload = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api
    .post("/api/ai/analyze/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((r) => r.data);
};

export const createComplaint = (payload) =>
  api.post("/api/complaints", payload).then((r) => r.data);

export const listComplaints = () => api.get("/api/complaints").then((r) => r.data);

export const getComplaint = (id) => api.get(`/api/complaints/${id}`).then((r) => r.data);

export default api;
