import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
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
        history: "History of hypertension",
      },
      keyFindings: [
        "Elevated troponin levels",
        "ECG shows ST elevation",
        "Blood pressure: 150/90",
      ],
      aiRecommendations:
        "Consider immediate cardiac catheterization. Review with cardiology team urgently.",
      riskAssessment: "High Risk",
      similarCases: [
        "Case #A4521: Similar presentation, successful PCI outcome",
        "Case #B7832: Comparable troponin levels, medical management",
      ],
      treatmentSuggestions: [
        "Aspirin 325mg immediately",
        "Clopidogrel loading dose",
        "Heparin per protocol",
        "Urgent cardiology consultation",
      ],
    },
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

interface DocumentTabsProps {
  isLoading: boolean;
  data: any;
}

export default function DocumentTabs({ isLoading, data }: DocumentTabsProps) {
  const [activeTab, setActiveTab] = useState("doc1");
  const { toast } = useToast();
  let EDPoint = data?.EDPoint;

  let DocResult = data?.documentData;
  console.log("------------DocResult", DocResult);
  // In a real app, this would fetch actual document data
  const documents = mockDocuments;

  const currentDoc = documents.find((doc) => doc.id === activeTab);

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

  // Recursive component for rendering nested objects
  function RecursiveList({ data }: { data: any }) {
    if (typeof data !== "object" || data === null) {
      return <span className="font-mono">{String(data)}</span>;
    }
    return (
      <ul className="list-disc ml-6">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="mb-1 text-green-900">
            <span className="font-semibold">{key}:</span>{" "}
            {typeof value === "object" && value !== null ? (
              <RecursiveList data={value} />
            ) : (
              <span className="font-mono">{String(value)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Document Analysis
        </CardTitle>
        {/* <span className="text-sm text-gray-500" data-testid="document-count">
          {documents.length} documents processed
        </span> */}
      </CardHeader>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 flex items-center justify-center mb-4">
            <Brain className="h-8 w-8 text-blue-500 mx-auto" />
          </div>
          <span className="text-blue-600 font-medium text-lg">
            AI is analyzing your documents...
          </span>
          <span className="text-gray-400 text-sm mt-2">
            This may take a few moments
          </span>
        </div>
      )}
      {Object.keys(data).length > 0 && !isLoading && (
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
                      {EDPoint && EDPoint && (
                        <div className="p-4 bg-blue-50 rounded-xl mb-2">
                          <div className="flex items-center justify-between mb-2 ">
                            <span className="font-semibold text-primary">
                              ED Point
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {EDPoint.point}
                            </span>
                          </div>
                          <div className="mt-2 space-y-2">
                            <div>
                              <span className="font-medium text-gray-700">
                                Level:
                              </span>
                              <span className="ml-2 text-blue-700 font-semibold">
                                {EDPoint.Level}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Criteria:
                              </span>
                              <span className="ml-2 text-blue-700 font-semibold">
                                {EDPoint.criteria}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Source:
                              </span>
                              <ul className="mt-1">
                                {Object.entries(EDPoint.source).map(
                                  ([key, value]) => (
                                    <li
                                      key={key}
                                      className="flex items-center gap-2 py-1 px-2 rounded-lg bg-green-100 text-green-700 font-semibold"
                                    >
                                      <span className="flex-1">{key}</span>
                                      <span className="px-2 py-1 bg-green-200 rounded-full">
                                        {String(value)}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                          {data.diagnosis && (
                            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <span className="font-medium text-yellow-900">
                                Input :
                              </span>
                              <span className="ml-2 text-yellow-800">
                                {data.diagnosis.content}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {Object.keys(DocResult).length > 0 && (
                      <div className="space-y-4">
                        {/* <p className="font-medium">{DocResult?.answer}</p> */}
                        {/* <p className="space-y-1 mt-6">
                              <span className="font-medium text-green-900 mb-2 bold">
                                Key Findings :
                              </span>
                            </p> */}
                        {/* Render structured medical response data */}

                        {/* Recursive rendering for nested medical data */}
                        {DocResult &&
                          Object.keys(DocResult).map((title) => {
                            const valueData = DocResult[title];
                            return (
                              <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="space-y-1 text-sm text-blue-800 mt-3">
                                  <div key={title}>
                                    <h6 className="font-bold text-blue-900 mb-2 font-medium">
                                      {title}
                                    </h6>
                                    <RecursiveList data={valueData} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        {/* <div className="p-4 bg-green-50 rounded-xl">
                          <h5 className="font-medium text-green-900 mb-2">
                            Key Findings
                          </h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            {doc.analysis.keyFindings.map((finding, index) => (
                              <li key={index} data-testid={`finding-${index}`}>
                                • {finding}
                              </li>
                            ))}
                          </ul>
                        </div> */}

                        {/* <div className="p-4 bg-yellow-50 rounded-xl">
                          <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
                            <Brain className="h-4 w-4 mr-1" />
                            AI Recommendations
                          </h5>
                          <p
                            className="text-sm text-yellow-800"
                            data-testid="ai-recommendations"
                          >
                            {doc.analysis.aiRecommendations}
                          </p>
                        </div> */}
                      </div>
                    )}
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
                          <Badge
                            className={getRiskColor(
                              doc.analysis.riskAssessment
                            )}
                            data-testid="risk-assessment"
                          >
                            {doc.analysis.riskAssessment}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-xl">
                        <h5 className="font-medium text-gray-900 mb-3">
                          Similar Cases
                        </h5>
                        <div className="space-y-2">
                          {doc.analysis.similarCases.map((case_, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg"
                              data-testid={`similar-case-${index}`}
                            >
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
                          {doc.analysis.treatmentSuggestions.map(
                            (suggestion, index) => (
                              <li
                                key={index}
                                data-testid={`treatment-${index}`}
                              >
                                • {suggestion}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
