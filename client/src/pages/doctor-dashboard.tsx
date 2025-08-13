import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Sidebar from "@/components/layout/sidebar";
import DocumentTabs from "@/components/dashboard/document-tabs";
import { CloudUpload, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not doctor
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'doctor')) {
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

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "patient");
      formData.append("patientId", "patient-123"); // In real app, this would be selected
      
      const response = await apiRequest("POST", "/api/documents/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Patient document uploaded successfully",
      });
      setUploadProgress(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
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
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
      setUploadProgress(null);
    },
  });

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit for patient files
          toast({
            title: "File too large",
            description: "Please select a file smaller than 50MB",
            variant: "destructive",
          });
          return;
        }
        
        // Simulate upload progress
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev === null) return null;
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 300);

        uploadMutation.mutate(file);
      }
    };
    input.click();
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
              Patient Document Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Upload and analyze patient documents with AI assistance
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="backdrop-blur-sm bg-white/80 border-blue-100 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Patient Document
            </h3>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
              onClick={handleFileSelect}
              data-testid="file-drop-zone"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CloudUpload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX up to 50MB
              </p>
              <Button 
                className="bg-primary text-white hover:bg-primary/90"
                disabled={uploadMutation.isPending}
                data-testid="button-choose-files"
              >
                {uploadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Choose Files"
                )}
              </Button>
            </div>

            {/* Upload Progress */}
            {uploadProgress !== null && (
              <div className="mt-6" data-testid="upload-progress">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading patient document...
                  </span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Analysis Tabs */}
        <DocumentTabs />
      </div>
    </div>
  );
}
