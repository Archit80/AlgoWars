import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Shared axios instance: attaches the current Supabase access token to every request.
// The backend derives the acting user from this token, never from request bodies.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error("Error getting auth session:", error);
  }
  return config;
});

export default api;
