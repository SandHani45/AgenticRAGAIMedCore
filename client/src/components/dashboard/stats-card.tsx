import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10" 
}: StatsCardProps) {
  return (
    <Card className="backdrop-blur-sm bg-white/80 border-blue-100 hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600" data-testid={`stats-title`}>
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1" data-testid={`stats-value`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-secondary mt-1" data-testid={`stats-subtitle`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
