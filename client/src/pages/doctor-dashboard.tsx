import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/layout/sidebar";
import DocumentTabs from "@/components/dashboard/document-tabs";
import { CloudUpload, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAskMe } from "@/hooks/useAskMe";
import {useEDPoints} from '@/hooks/useEDPoints';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  // Redirect if not authenticated or not doctor
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "doctor")) {
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

  const fileUpload = useFileUpload({
    type: "patient",
    patientId: "patient-123",
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Patient document uploaded successfully",
      });
      setSelectedFile(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description:
          error.message === "File too large"
            ? "Please select a file smaller than 50MB"
            : "Failed to upload document",
        variant: "destructive",
      });
    },
  });

const useEndpoints = useEDPoints({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Fetched data successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
    },
  });


  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-clinical flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }


  function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();

    if (!selectedFile && !query.trim()) {
      toast({
        title: "No file selected",
        description: "Please select a document to upload.",
        variant: "destructive",
      });
      return;
    }
    if (query.trim() && !selectedFile) {
      // Call Ask me api with query
      useEndpoints.mutate({ query });
    } else {
      if (selectedFile) {
        fileUpload.mutate(selectedFile);
      }
    }
  }

  function handleReset(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    event.preventDefault();
    setSelectedFile(null);
    if (fileUpload.uploadProgress !== null) {
      fileUpload.reset?.();
    }
  }

  console.log("----------askMeMutation", fileUpload?.data?.data?.content && JSON.parse(fileUpload?.data?.data?.content));
  let data  = {
    ...useEndpoints?.data?.result,
    ...fileUpload?.data?.data
  }
  return (
    <div className="min-h-screen bg-clinical flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-gray-900"
              data-testid="page-title"
            >
              Patient Document Analysis
            </h1>
            <p className="text-gray-600 mt-1">
              Upload and analyze patient documents with AI assistance
            </p>
          </div>
        </div>
        {/* Chat-like Query Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4 text-center">
            AI Medical Assistant
          </h2>
          <div className="flex flex-col items-center">
            <textarea
              className="w-full  h-32 px-6 py-4 text-lg rounded-2xl border border-primary/30 focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg resize-none mb-4 bg-white"
              placeholder="Type your medical question or case details here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
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
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.doc,.docx,.txt";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    if (file.size > 50 * 1024 * 1024) {
                      toast({
                        title: "File too large",
                        description: "Please select a file smaller than 50MB",
                        variant: "destructive",
                      });
                      return;
                    }
                    setSelectedFile(file);
                  }
                };
                input.click();
              }}
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
                disabled={fileUpload.isPending}
                data-testid="button-choose-files"
              >
                {fileUpload.isPending ? (
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
            {fileUpload.uploadProgress !== null && (
              <div className="mt-6" data-testid="upload-progress">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading patient document...
                  </span>
                  <span className="text-sm text-gray-500">
                    {fileUpload.uploadProgress}%
                  </span>
                </div>
                <Progress value={fileUpload.uploadProgress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
        {/* Rich file preview before upload */}
        {selectedFile && (
          <div className="mt-6 flex items-center justify-start">
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 shadow-sm w-full max-w-md">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                {/* File type icon */}
                {selectedFile.name.endsWith(".pdf") ? (
                  <CloudUpload className="text-red-500 w-7 h-7" />
                ) : selectedFile.name.endsWith(".doc") ||
                  selectedFile.name.endsWith(".docx") ? (
                  <CloudUpload className="text-blue-600 w-7 h-7" />
                ) : (
                  <CloudUpload className="text-gray-500 w-7 h-7" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </div>
                <div className="text-xs text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </div>
              <div className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                Ready
              </div>
            </div>
          </div>
        )}
        {/* submit button */}
        <div className="flex justify-end pb-4 gap-4">
          <Button
            className="bg-primary text-white hover:bg-primary/90"
            onClick={handleSubmit}
            disabled={fileUpload.isPending || !(selectedFile || query)}
          >
            {!!(fileUpload.isPending || useEndpoints.isPending) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
          <Button
            className="bg-gray-100 text-gray-700 border border-gray-300 hover:bg-red-100 hover:text-red-700"
            onClick={handleReset}
            disabled={!selectedFile}
          >
            Reset
          </Button>
        </div>
        {/* Display Ask Me response */}
  
        {/* Document Analysis Tabs */}
        <DocumentTabs data={data} isLoading={useEndpoints.isPending || fileUpload.isPending} />
      </div>
    </div>
  );
}
