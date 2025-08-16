const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  // Attach Authorization header if accessToken exists
  let headers: HeadersInit = options.headers || {};
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))?.split('=')[1];
  if (token) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  return res;
}
