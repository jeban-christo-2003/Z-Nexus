
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Code, Home, FileText, Trophy, UserCircle, LogOut } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full py-4 px-6 border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-purple-600" />
          <Link to="/" className="font-orbito text-xl font-semibold">
            <span className="gradient-text">Nexus</span>
            <span className="text-sm ml-2 text-gray-500">Business meets Intelligence</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 ${isActive('/') ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-600 transition-colors'}`}
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link 
            to="/problems" 
            className={`flex items-center gap-2 ${isActive('/problems') ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-600 transition-colors'}`}
          >
            <FileText className="h-4 w-4" />
            Problems
          </Link>
          
          <Link 
            to="/playground" 
            className={`flex items-center gap-2 ${isActive('/playground') ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-600 transition-colors'}`}
          >
            <Code className="h-4 w-4" />
            Playground
          </Link>
          
          {user && (
            <Link 
              to={user.role === "admin" ? "/admin" : "/dashboard"} 
              className={`flex items-center gap-2 ${
                isActive('/admin') || isActive('/dashboard') 
                  ? 'text-purple-700 font-medium' 
                  : 'text-gray-600 hover:text-purple-600 transition-colors'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="mr-2 hidden md:block">
                <span className="text-sm text-gray-600">Welcome, </span>
                <span className="text-sm font-medium text-purple-700">{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-purple-700 border-purple-300 hover:bg-purple-50"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="text-purple-700 border-purple-300 hover:bg-purple-50"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate("/login?tab=register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
