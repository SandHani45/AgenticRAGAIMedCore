import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { apiFetch } from "@/lib/apiFetch";

interface AskMePayload {
  query: string;
  context?: any;
}

export function useAskMe(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: async (payload: AskMePayload) => {
      // Call the backend AI endpoint
      const response = await apiFetch("/api/agent/askMe", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }
      return response.json();
    },
    ...options,
  });
}
