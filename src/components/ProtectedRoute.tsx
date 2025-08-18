import React from "react";
import { Navigate } from "react-router-dom";

export interface ProtectedRouteProps {
  element: React.ReactElement;
  isAllowed: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, isAllowed, redirectPath = "/login" }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return element;
};

export default ProtectedRoute;
