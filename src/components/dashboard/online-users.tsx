import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface OnlineUser {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role: string;
  };
  location?: string;
  lastSeen: string;
}

const roleColors = {
  admin: "bg-red-500",
  doctor: "bg-blue-500",
  patient: "bg-gray-500",
};

export default function OnlineUsers() {
  const { toast } = useToast();

  const { data: sessions, isLoading, error } = useQuery<OnlineUser[]>({
    queryKey: ["/api/sessions/active"],
    refetchInterval: 30000, // Refresh every 30 seconds
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

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = (user: OnlineUser['user']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return "Unknown User";
  };

  const getRoleColor = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || roleColors.patient;
  };

  const formatLastSeen = (lastSeen: string) => {
    const now = new Date();
    const seen = new Date(lastSeen);
    const diffInMinutes = Math.floor((now.getTime() - seen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-blue-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Online Users
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
          <span className="text-sm text-gray-500">Live</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-gray-500">
            Failed to load online users
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users currently online
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                data-testid={`online-user-${session.userId}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${getRoleColor(session.user.role)} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-medium" data-testid="user-initials">
                      {getInitials(session.user.firstName, session.user.lastName, session.user.email)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900" data-testid="user-name">
                      {getDisplayName(session.user)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize" data-testid="user-role">
                      {session.user.role}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {session.location && (
                    <p className="text-xs text-gray-500" data-testid="user-location">
                      {session.location}
                    </p>
                  )}
                  <p className="text-xs text-secondary" data-testid="user-last-seen">
                    {formatLastSeen(session.lastSeen)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
