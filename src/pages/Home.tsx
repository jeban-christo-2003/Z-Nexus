import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Code, FileCode, Brain, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-6 flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold font-orbito leading-tight">
                <span className="gradient-text">Welcome to Nexus</span>
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                Your coding journey starts here. Choose your path and begin solving problems to improve your skills.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6" asChild>
                  <Link to="/playground">
                    Try Playground
                  </Link>
                </Button>
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 text-lg px-8 py-6" asChild>
                  <Link to="/problems">
                    Browse Challenges
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                  <Code className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Practice Problems</h3>
                  <p className="text-gray-600">Solve coding challenges to improve your skills</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                  <Brain className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                  <p className="text-gray-600">Monitor your improvement over time</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                  <Trophy className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Compete</h3>
                  <p className="text-gray-600">Join competitions and climb the leaderboard</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-purple-100">
                  <FileCode className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Learn</h3>
                  <p className="text-gray-600">Access educational resources and tutorials</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 