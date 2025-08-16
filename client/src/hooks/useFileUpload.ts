import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";

interface UseFileUploadOptions {
  type?: string;
  patientId?: string;
  query?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const mutation = useMutation({
    mutationFn: async (file: File,) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "patientId");
      if (options.query !== undefined) {
        formData.append("query", options.query);
      }
      if (options.patientId) formData.append("patientId", options.patientId);
      const response = await apiFetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      setUploadProgress(null);
      options.onSuccess?.();
    },
    onError: (error) => {
      setUploadProgress(null);
      options.onError?.(error as Error);
    },
  });

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          options.onError?.(new Error("File too large"));
          return;
        }
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev === null) return null;
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 300);
        mutation.mutate(file);
      }
    };
    input.click();
  };

  return {
    uploadProgress,
    handleFileSelect,
    ...mutation,
  };
}
