import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Brain, AlertTriangle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface DocumentAnalysis {
  id: string;
  name: string;
  type: string;
  analysis: {
    patientInfo: {
      age: string;
      gender: string;
      condition: string;
      history: string;
    };
    keyFindings: string[];
    aiRecommendations: string;
    riskAssessment: string;
    similarCases: string[];
    treatmentSuggestions: string[];
  };
}

const mockDocuments = [
  {
    id: "doc1",
    name: "Patient Report #001",
    analysis: {
      patientInfo: {
        age: "45",
        gender: "Male",
        condition: "Chest pain and shortness of breath",
        history: "History of hypertension"
      },
      keyFindings: [
        "Elevated troponin levels",
        "ECG shows ST elevation",
        "Blood pressure: 150/90"
      ],
      aiRecommendations: "Consider immediate cardiac catheterization. Review with cardiology team urgently.",
      riskAssessment: "High Risk",
      similarCases: [
        "Case #A4521: Similar presentation, successful PCI outcome",
        "Case #B7832: Comparable troponin levels, medical management"
      ],
      treatmentSuggestions: [
        "Aspirin 325mg immediately",
        "Clopidogrel loading dose", 
        "Heparin per protocol",
        "Urgent cardiology consultation"
      ]
    }
  },
  // {
  //   id: "doc2",
  //   name: "Lab Results #002",
  //   analysis: {
  //     patientInfo: {
  //       age: "32",
  //       gender: "Female",
  //       condition: "Routine blood work follow-up",
  //       history: "Type 2 diabetes mellitus"
  //     },
  //     keyFindings: [
  //       "HbA1c: 8.2% (elevated)",
  //       "Fasting glucose: 165 mg/dL",
  //       "Normal kidney function"
  //     ],
  //     aiRecommendations: "Diabetes management requires adjustment. Consider medication titration.",
  //     riskAssessment: "Moderate Risk",
  //     similarCases: [
  //       "Case #C1234: Similar HbA1c, responded well to metformin increase",
  //       "Case #D5678: Required insulin initiation"
  //     ],
  //     treatmentSuggestions: [
  //       "Increase metformin to 1000mg BID",
  //       "Add SGLT2 inhibitor",
  //       "Diabetes education referral",
  //       "Follow-up in 3 months"
  //     ]
  //   }
  // },
  // {
  //   id: "doc3", 
  //   name: "Imaging Study #003",
  //   analysis: {
  //     patientInfo: {
  //       age: "67",
  //       gender: "Male",
  //       condition: "Persistent cough and weight loss",
  //       history: "30 pack-year smoking history"
  //     },
  //     keyFindings: [
  //       "3cm nodule in right upper lobe",
  //       "No mediastinal lymphadenopathy",
  //       "Pleural effusion absent"
  //     ],
  //     aiRecommendations: "Suspicious lung nodule requires tissue diagnosis. Recommend pulmonology consultation.",
  //     riskAssessment: "High Risk",
  //     similarCases: [
  //       "Case #E9012: Similar nodule, benign on biopsy",
  //       "Case #F3456: Required surgical resection"
  //     ],
  //     treatmentSuggestions: [
  //       "CT-guided biopsy",
  //       "PET scan for staging",
  //       "Pulmonology referral",
  //       "Smoking cessation counseling"
  //     ]
  //   }
  // }
];

export default function DocumentTabs() {
  const [activeTab, setActiveTab] = useState("doc1");
  const { toast } = useToast();

  // In a real app, this would fetch actual document data
  const documents = mockDocuments;
  
  const currentDoc = documents.find(doc => doc.id === activeTab);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high risk":
        return "bg-red-100 text-red-700";
      case "moderate risk":
        return "bg-yellow-100 text-yellow-700";
      case "low risk":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Document Analysis
        </CardTitle>
        <span className="text-sm text-gray-500" data-testid="document-count">
          {documents.length} documents processed
        </span>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6 bg-gray-50">
            {documents.map((doc) => (
              <TabsTrigger 
                key={doc.id}
                value={doc.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
                data-testid={`tab-${doc.id}`}
              >
                {doc.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {documents.map((doc) => (
            <TabsContent key={doc.id} value={doc.id} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Document Summary */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Document Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h5 className="font-medium text-blue-900 mb-2">Patient Information</h5>
                      <div className="space-y-1 text-sm text-blue-800">
                        <p><span className="font-medium">Age:</span> {doc.analysis.patientInfo.age}</p>
                        <p><span className="font-medium">Gender:</span> {doc.analysis.patientInfo.gender}</p>
                        <p><span className="font-medium">Condition:</span> {doc.analysis.patientInfo.condition}</p>
                        <p><span className="font-medium">History:</span> {doc.analysis.patientInfo.history}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h5 className="font-medium text-green-900 mb-2">Key Findings</h5>
                      <ul className="text-sm text-green-800 space-y-1">
                        {doc.analysis.keyFindings.map((finding, index) => (
                          <li key={index} data-testid={`finding-${index}`}>• {finding}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-1" />
                        AI Recommendations
                      </h5>
                      <p className="text-sm text-yellow-800" data-testid="ai-recommendations">
                        {doc.analysis.aiRecommendations}
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-secondary" />
                    AI-Generated Insights
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Risk Assessment
                        </h5>
                        <Badge className={getRiskColor(doc.analysis.riskAssessment)} data-testid="risk-assessment">
                          {doc.analysis.riskAssessment}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h5 className="font-medium text-gray-900 mb-3">Similar Cases</h5>
                      <div className="space-y-2">
                        {doc.analysis.similarCases.map((case_, index) => (
                          <div key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg" data-testid={`similar-case-${index}`}>
                            {case_}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        Treatment Suggestions
                      </h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {doc.analysis.treatmentSuggestions.map((suggestion, index) => (
                          <li key={index} data-testid={`treatment-${index}`}>• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
