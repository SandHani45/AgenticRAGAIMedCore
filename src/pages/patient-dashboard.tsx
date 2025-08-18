import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/layout/sidebar";
import { Calendar, TestTubeDiagonal, Pill, FileText, CalendarCheck, Pill as PillIcon } from "lucide-react";

interface HealthSummary {
  nextAppointment: {
    doctor: string;
    date: string;
    time: string;
    specialty: string;
  };
  labResults: {
    test: string;
    status: string;
    date: string;
  };
  medications: {
    active: number;
    refillsNeeded: number;
  };
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  icon: any;
  iconColor: string;
  iconBgColor: string;
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not patient
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'patient')) {
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

  // Mock data - in real app, this would come from API
  const healthSummary: HealthSummary = {
    nextAppointment: {
      doctor: "Dr. Sarah Johnson",
      date: "Dec 15, 2024",
      time: "10:30 AM",
      specialty: "Cardiology"
    },
    labResults: {
      test: "Blood Panel",
      status: "Normal",
      date: "Dec 5, 2024"
    },
    medications: {
      active: 3,
      refillsNeeded: 1
    }
  };

  const activities: Activity[] = [
    {
      id: "1",
      type: "lab_results",
      title: "Lab results uploaded",
      description: "Blood panel results are now available",
      date: "Dec 5",
      icon: FileText,
      iconColor: "text-secondary",
      iconBgColor: "bg-secondary/10"
    },
    {
      id: "2",
      type: "appointment",
      title: "Appointment scheduled",
      description: "Follow-up with Dr. Johnson confirmed",
      date: "Dec 3",
      icon: CalendarCheck,
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10"
    },
    {
      id: "3",
      type: "prescription",
      title: "Prescription refilled",
      description: "Metformin prescription renewed for 90 days",
      date: "Nov 30",
      icon: PillIcon,
      iconColor: "text-orange-500",
      iconBgColor: "bg-orange-100"
    }
  ];

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "Patient";
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
              Welcome back, {getDisplayName()}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your health overview
            </p>
          </div>
        </div>

        {/* Health Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="backdrop-blur-sm bg-white/80 border-blue-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Next Appointment</h3>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-gray-600 mb-2" data-testid="appointment-doctor">
                {healthSummary.nextAppointment.doctor}
              </p>
              <p className="text-lg font-bold text-gray-900" data-testid="appointment-date">
                {healthSummary.nextAppointment.date}
              </p>
              <p className="text-sm text-gray-500" data-testid="appointment-details">
                {healthSummary.nextAppointment.time} - {healthSummary.nextAppointment.specialty}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-blue-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Lab Results</h3>
                <TestTubeDiagonal className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-sm text-gray-600 mb-2" data-testid="lab-test">
                {healthSummary.labResults.test}
              </p>
              <p className="text-lg font-bold text-secondary" data-testid="lab-status">
                {healthSummary.labResults.status}
              </p>
              <p className="text-sm text-gray-500" data-testid="lab-date">
                Completed {healthSummary.labResults.date}
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 border-blue-100 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Medications</h3>
                <Pill className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Active Prescriptions</p>
              <p className="text-lg font-bold text-gray-900" data-testid="medications-active">
                {healthSummary.medications.active}
              </p>
              <p className="text-sm text-gray-500" data-testid="medications-refill">
                {healthSummary.medications.refillsNeeded} refill needed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className={`w-10 h-10 ${activity.iconBgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900" data-testid={`activity-title-${activity.id}`}>
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500" data-testid={`activity-description-${activity.id}`}>
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400" data-testid={`activity-date-${activity.id}`}>
                      {activity.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
