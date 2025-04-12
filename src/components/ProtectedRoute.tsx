
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "student";
  adminRestricted?: boolean; // New prop to restrict admin from certain pages
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  adminRestricted
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  // If page is admin-restricted and user is admin, redirect to admin dashboard
  if (adminRestricted && user.role === "admin") {
    toast.error("This page is only available for students");
    return <Navigate to="/admin" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Only admins can access admin pages, but admins can also access student pages
    if (requiredRole === "admin" && user.role !== "admin") {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    } 
    // Students can't access admin pages
    else if (requiredRole === "student" && user.role !== "student" && user.role !== "admin") {
      toast.error("You don't have permission to access this page");
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
