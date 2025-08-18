import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      // Remove token from cookies
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
  });
}
