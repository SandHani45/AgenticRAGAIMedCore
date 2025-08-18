import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../lib/apiFetch";

interface AskMePayload {
  query: string;
  context?: any;
}

export function useEDPoints(options?: {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}) {
  return useMutation({
    mutationFn: async (payload: AskMePayload) => {
      // Call the backend AI endpoint
      const response = await apiFetch("/api/agent/edPoints", {
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
