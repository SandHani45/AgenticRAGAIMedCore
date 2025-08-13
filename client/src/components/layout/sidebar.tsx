import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, BarChart3, FileText, Users, Settings, Home, FileCheck, Calendar, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = {
  admin: [
    { id: "dashboard", name: "Dashboard", icon: BarChart3 },
    { id: "documents", name: "Documents", icon: FileText },
    { id: "users", name: "Users", icon: Users },
    { id: "settings", name: "Settings", icon: Settings },
  ],
  doctor: [
    { id: "overview", name: "Overview", icon: Home },
    { id: "cases", name: "Patient Cases", icon: FileCheck },
    { id: "insights", name: "AI Insights", icon: FileText },
    { id: "schedule", name: "Schedule", icon: Calendar },
  ],
  patient: [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "records", name: "My Records", icon: FileText },
    { id: "appointments", name: "Appointments", icon: Calendar },
    { id: "profile", name: "Profile", icon: User },
  ],
};

const roleColors = {
  admin: "bg-red-500",
  doctor: "bg-blue-500", 
  patient: "bg-gray-500",
};

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  const userNavigation = navigation[user.role as keyof typeof navigation] || navigation.patient;
  const roleColor = roleColors[user.role as keyof typeof roleColors] || roleColors.patient;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrator";
      case "doctor": return user.specialization || "Doctor";
      case "patient": return "Patient";
      default: return "User";
    }
  };

  return (
    <div className="w-64 bg-white shadow-xl border-r border-gray-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">MedCore</h2>
            <p className="text-xs font-medium" style={{ color: roleColor.replace('bg-', '') }}>
              {user.role === 'admin' ? 'Administrator' : user.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {userNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors text-left",
                    isActive
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-primary hover:bg-blue-50"
                  )}
                  data-testid={`nav-${item.id}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="backdrop-blur-sm bg-blue-50/50 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm", roleColor)}>
              <span data-testid="user-initials">
{getInitials(user.firstName || undefined, user.lastName || undefined)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" data-testid="user-name">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500" data-testid="user-role">
                {getRoleDisplayName(user.role)}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={() => window.location.href = '/api/logout'}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
