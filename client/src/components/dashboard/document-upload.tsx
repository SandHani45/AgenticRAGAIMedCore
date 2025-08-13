import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "indexed" | "error";
  progress: number;
  createdAt: string;
}

export default function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery<Document[]>({
    queryKey: ["/api/documents/reference"],
    retry: false,
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

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "reference");
      
      const response = await apiRequest("POST", "/api/documents/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/reference"] });
      setUploading(false);
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
      setUploading(false);
    },
  });

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 200 * 1024 * 1024) { // 200MB limit
          toast({
            title: "File too large",
            description: "Please select a file smaller than 200MB",
            variant: "destructive",
          });
          return;
        }
        setUploading(true);
        uploadMutation.mutate(file);
      }
    };
    input.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusIcon = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return "bg-secondary/10 text-secondary";
      case "processing":
        return "bg-orange-100 text-orange-600";
      case "error":
        return "bg-red-100 text-red-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Reference Documents
        </CardTitle>
        <Button
          onClick={handleFileSelect}
          disabled={uploading}
          className="bg-primary text-white hover:bg-primary/90"
          data-testid="button-upload-document"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading documents...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            Failed to load documents
          </div>
        ) : !documents || documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reference documents uploaded yet
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border border-gray-200 rounded-xl p-4"
                data-testid={`document-${doc.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900" data-testid="document-name">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500" data-testid="document-size">
                        {formatFileSize(doc.size)}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    className={getStatusColor(doc.status)}
                    data-testid="document-status"
                  >
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(doc.status)}
                      <span className="capitalize">{doc.status}</span>
                    </span>
                  </Badge>
                </div>
                {doc.status !== "indexed" && doc.status !== "error" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Processing...</span>
                      <span>{doc.progress}%</span>
                    </div>
                    <Progress value={doc.progress} className="h-2" data-testid="document-progress" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
