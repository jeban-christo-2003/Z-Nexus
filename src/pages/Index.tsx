
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { CheckCircle, Code, Eye, EyeOff, FileCode, Brain } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold font-orbito leading-tight">
                <span className="gradient-text">Master Coding</span> Without Looking
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl">
                BlindCode helps you sharpen your programming skills by challenging you to code without seeing your code until submission. Perfect for interviews and building muscle memory.
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
            <div className="flex-1 relative">
              <div className="editor-container rounded-xl overflow-hidden shadow-xl border border-purple-400 max-w-lg mx-auto">
                <div className="bg-purple-900 text-white px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    <span className="font-medium">blind_mode.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6 bg-[#1E1E3F] text-gray-300 font-mono text-sm">
                  <div className="flex gap-4">
                    <div className="text-gray-500">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <div className="text-purple-300">function <span className="text-yellow-300">reverseString</span>(str) {'{'}</div>
                      <div className="pl-4 text-gray-400">// Type your solution here</div>
                      <div className="pl-4 text-white">return str.split(<span className="text-green-300">''</span>).reverse().join(<span className="text-green-300">''</span>);</div>
                      <div className="text-purple-300">{'}'}</div>
                      <div className="mt-4 text-gray-400">// Test case</div>
                      <div className="text-white">console.log(reverseString(<span className="text-green-300">"hello"</span>)); <span className="text-gray-400">// Should output "olleh"</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-orbito gradient-text">How BlindCode Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <EyeOff className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-orbito">Blind Mode</h3>
              <p className="text-gray-700">
                Code without seeing what you're typing to build muscle memory and syntax recall.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <FileCode className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-orbito">Practice Problems</h3>
              <p className="text-gray-700">
                Choose from a variety of challenges across different difficulty levels and topics.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 font-orbito">Skill Growth</h3>
              <p className="text-gray-700">
                Track your progress, identify patterns in your errors, and watch your skills improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-orbito">Ready to Challenge Yourself?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start coding blindly today and see how quickly your programming skills and confidence improve.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6" asChild>
              <Link to="/playground">
                Try Now
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Code className="h-6 w-6 text-purple-400" />
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

export default Index;
