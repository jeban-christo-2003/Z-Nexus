
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ChevronRight, Star } from "lucide-react";
import Header from '@/components/Header';

const problems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Find two numbers in an array that add up to a target value",
    completed: false,
    stars: 4.5,
    solvedBy: 1245
  },
  {
    id: 2,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Reverse a string without using built-in reverse methods",
    completed: true,
    stars: 4.2,
    solvedBy: 987
  },
  {
    id: 3,
    title: "Merge Sorted Arrays",
    difficulty: "Medium",
    category: "Arrays",
    description: "Merge two sorted arrays into one sorted array",
    completed: false,
    stars: 4.7,
    solvedBy: 843
  },
  {
    id: 4,
    title: "Binary Search Tree Validator",
    difficulty: "Hard",
    category: "Trees",
    description: "Validate if a given binary tree is a valid binary search tree",
    completed: false,
    stars: 4.9,
    solvedBy: 562
  },
  {
    id: 5,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Arrays",
    description: "Find two lines that together with the x-axis form a container that holds the most water",
    completed: false,
    stars: 4.6,
    solvedBy: 756
  },
];

const Problems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProblems = problems.filter(problem => {
    // Search filter
    if (searchQuery && !problem.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Difficulty filter
    if (difficultyFilter !== "all" && problem.difficulty.toLowerCase() !== difficultyFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== "all" && problem.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      
      <div className="max-w-7xl mx-auto py-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 font-orbito gradient-text">Coding Challenges</h1>
        <p className="text-gray-600 mb-8">Choose a problem to solve in blind coding mode</p>
        
        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="arrays">Arrays</SelectItem>
                <SelectItem value="strings">Strings</SelectItem>
                <SelectItem value="trees">Trees</SelectItem>
                <SelectItem value="linked lists">Linked Lists</SelectItem>
                <SelectItem value="dynamic programming">Dynamic Programming</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Problems List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-purple-50 py-3 px-6 border-b border-purple-100">
            <div className="col-span-6 font-medium text-purple-900">Title</div>
            <div className="col-span-2 font-medium text-purple-900 hidden md:block">Difficulty</div>
            <div className="col-span-2 font-medium text-purple-900 hidden md:block">Category</div>
            <div className="col-span-2 font-medium text-purple-900 text-right">Action</div>
          </div>
          
          {filteredProblems.length > 0 ? (
            filteredProblems.map(problem => (
              <div 
                key={problem.id} 
                className={`grid grid-cols-12 py-4 px-6 border-b border-gray-100 hover:bg-purple-50 transition-colors ${problem.completed ? 'bg-green-50/30' : ''}`}
              >
                <div className="col-span-6">
                  <div className="flex items-center gap-3">
                    {problem.completed && (
                      <Badge className="bg-green-100 text-green-800 border-0">
                        Completed
                      </Badge>
                    )}
                    <div>
                      <h3 className="font-medium">{problem.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 hidden md:block">{problem.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {problem.stars}
                        </div>
                        <div>{problem.solvedBy} solved</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 hidden md:flex items-center">
                  <Badge className={`${getDifficultyColor(problem.difficulty)} border-0`}>
                    {problem.difficulty}
                  </Badge>
                </div>
                <div className="col-span-2 hidden md:flex items-center">
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    {problem.category}
                  </Badge>
                </div>
                <div className="col-span-6 md:col-span-2 flex items-center justify-end">
                  <Button variant="outline" className="text-purple-700 border-purple-300 hover:bg-purple-50" asChild>
                    <Link to={`/playground/${problem.id}`}>
                      <span className="flex items-center gap-1">
                        Solve <ChevronRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500">
              <p>No problems match your filters. Try adjusting your search.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="font-orbito text-xl font-semibold">BlindCode</span>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BlindCode. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Problems;
