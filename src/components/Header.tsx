
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Code, Home, FileText, Trophy } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full py-4 px-6 border-b border-purple-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-purple-600" />
          <Link to="/" className="font-orbito text-xl font-semibold gradient-text">
            BlindCode
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
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="text-purple-700 border-purple-300 hover:bg-purple-50">
            Login
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
