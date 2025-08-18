import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import AdminDashboard from "@/pages/admin-dashboard";
import DoctorDashboard from "@/pages/doctor-dashboard";
import PatientDashboard from "@/pages/patient-dashboard";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
// Update the path below to the correct relative path if needed
import ProtectedRoute from "./components/ProtectedRoute";

function Router() {
  const { isLoading, isAuthenticated, user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-clinical flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <LoginPage />          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              isAllowed={isAuthenticated && user?.role === "admin"}
              redirectPath="/login"
            />
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute
              element={<DoctorDashboard />}
              isAllowed={isAuthenticated && user?.role === "doctor"}
              redirectPath="/login"
            />
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRoute
              element={<PatientDashboard />}
              isAllowed={isAuthenticated && user?.role === "patient"}
              redirectPath="/login"
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
