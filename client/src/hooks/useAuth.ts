
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiFetch } from "@/lib/apiFetch";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}


export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = getCookie("accessToken");
      const res = await apiFetch(`/api/auth/user`, {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 401) {
        // Unauthorized, do not retry
        throw Object.assign(new Error("Unauthorized"), { code: 401 });
      }
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json().then(data => data.user);
    },
    retry: false,
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
  };
}
