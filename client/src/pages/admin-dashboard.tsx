import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/sidebar";
import StatsCard from "@/components/dashboard/stats-card";
import OnlineUsers from "@/components/dashboard/online-users";
import DocumentUpload from "@/components/dashboard/document-upload";
import { Users, FileUp, Brain, UserCheck, RefreshCw } from "lucide-react";

interface DashboardStats {
  onlineUsers: number;
  totalDocuments: number;
  processingDocuments: number;
  activeDoctors: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, isLoading, toast]);

  const { data: stats, isLoading: statsLoading, error, refetch } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    retry: false,
    enabled: !!user && user.role === 'admin',
  });

  // Handle unauthorized error
  if (error && isUnauthorizedError(error as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Dashboard data has been updated",
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-clinical flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clinical flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="page-title">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor system activity and manage users
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Online Users"
            value={stats?.onlineUsers || 0}
            subtitle="+12% from yesterday"
            icon={Users}
            iconColor="text-secondary"
            iconBgColor="bg-secondary/10"
          />
          <StatsCard
            title="Documents Uploaded"
            value={stats?.totalDocuments || 0}
            subtitle="8 today"
            icon={FileUp}
            iconColor="text-primary"
            iconBgColor="bg-primary/10"
          />
          <StatsCard
            title="RAG Processes"
            value={stats?.processingDocuments || 0}
            subtitle={`${stats?.processingDocuments || 0} indexing`}
            icon={Brain}
            iconColor="text-orange-500"
            iconBgColor="bg-orange-100"
          />
          <StatsCard
            title="Active Doctors"
            value={stats?.activeDoctors || 0}
            subtitle="All verified"
            icon={UserCheck}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OnlineUsers />
          <DocumentUpload />
        </div>
      </div>
    </div>
  );
}
