
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import Header from '@/components/Header';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
              <Code className="h-10 w-10 text-purple-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 font-orbito gradient-text">404</h1>
          <p className="text-xl text-gray-600 mb-6">Oops! We couldn't find the page you're looking for.</p>
          
          <div className="editor-container rounded-lg p-4 mb-8">
            <div className="text-left">
              <div className="text-purple-300">function <span className="text-yellow-300">findPage</span>() {'{'}</div>
              <div className="pl-4 text-white">return <span className="text-red-400">new Error</span>(<span className="text-green-300">"404: Page not found"</span>);</div>
              <div className="text-purple-300">{'}'}</div>
            </div>
          </div>
          
          <Button asChild>
            <Link to="/" className="bg-purple-600 hover:bg-purple-700 px-6 py-2">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
