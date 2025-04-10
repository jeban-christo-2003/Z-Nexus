
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, EyeOff, Play, Check, Timer, Book, AlertCircle, 
  RefreshCw, Copy, Save, ChevronRight, ChevronLeft 
} from "lucide-react";
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { problems } from '@/data/problems';

const Playground = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const problemId = id ? parseInt(id) : undefined;
  
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    if (problemId && problems) {
      const problem = problems.find(p => p.id === problemId);
      if (problem) {
        setSelectedProblem(problem);
        setCode(problem.starterCode || "// Start coding here");
      }
    } else {
      // Default code for playground mode
      setCode('// Start coding here in blind mode\n\nfunction example(input) {\n  // Your solution\n  return input;\n}\n\n// Test your code\nconsole.log(example("test"));');
    }
  }, [problemId]);
  
  // Timer effect
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isTimerRunning) {
      intervalId = window.setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTimerRunning) {
      setIsTimerRunning(true);
    }
    setCode(e.target.value);
  };
  
  const runCode = () => {
    setIsRunning(true);
    setShowResults(true);
    
    try {
      // In a real app, this would send code to a backend for execution
      // For our demo, we'll simulate execution with a timeout
      setTimeout(() => {
        if (selectedProblem) {
          const testOutput = `Running tests for "${selectedProblem.title}"...\n\n`;
          
          // Simulate test results
          const passedTests = Math.random() > 0.5; // Random pass/fail for demo
          
          if (passedTests) {
            setOutput(`${testOutput}✅ All tests passed!\n\nYour solution successfully solved the problem.`);
            toast({
              title: "Success!",
              description: "Your code passed all test cases!",
              variant: "default",
            });
          } else {
            setOutput(`${testOutput}❌ Some tests failed\n\nExpected: [1, 2, 3]\nActual: [1, 2, 4]`);
            toast({
              title: "Tests Failed",
              description: "Some test cases did not pass. Check the output for details.",
              variant: "destructive",
            });
          }
        } else {
          // Playground mode - just show the code execution would happen
          setOutput(`Console Output:\n\nProgram started\n> example("test") returned "test"\n\nProgram completed in 0.05s`);
          toast({
            title: "Code Executed",
            description: "Check the output panel for results",
          });
        }
        
        setIsRunning(false);
        setIsTimerRunning(false);
      }, 1500);
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsRunning(false);
    }
  };
  
  const resetEditor = () => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode || "// Start coding here");
    } else {
      setCode('// Start coding here in blind mode\n\nfunction example(input) {\n  // Your solution\n  return input;\n}\n\n// Test your code\nconsole.log(example("test"));');
    }
    setOutput("");
    setElapsedTime(0);
    setIsTimerRunning(false);
    setShowResults(false);
    
    toast({
      title: "Editor Reset",
      description: "Your code has been reset to the starter template.",
    });
  };
  
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto py-6 px-6 flex flex-col">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-orbito gradient-text">
              {selectedProblem ? selectedProblem.title : "Code Playground"}
            </h1>
            {selectedProblem && (
              <p className="text-gray-600">{selectedProblem.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="blind-mode" 
                checked={isBlindMode} 
                onCheckedChange={setIsBlindMode}
              />
              <Label htmlFor="blind-mode" className="flex items-center gap-1">
                {isBlindMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Blind Mode
              </Label>
            </div>
            
            <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              <Timer className="h-4 w-4" />
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
          {/* Left panel - problem description */}
          {selectedProblem && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold font-orbito text-purple-800">Problem Details</h2>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Previous Problem">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="Next Problem">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h3>{selectedProblem.title}</h3>
                  <p>{selectedProblem.description}</p>
                  
                  <h4>Example:</h4>
                  <pre className="bg-gray-100 p-3 rounded text-sm">
                    {selectedProblem.example || "Input: [1, 2, 3]\nOutput: [3, 2, 1]"}
                  </pre>
                  
                  <h4>Constraints:</h4>
                  <ul>
                    {selectedProblem.constraints ? (
                      selectedProblem.constraints.map((constraint: string, i: number) => (
                        <li key={i}>{constraint}</li>
                      ))
                    ) : (
                      <>
                        <li>1 ≤ arr.length ≤ 1000</li>
                        <li>Time Complexity: O(n)</li>
                        <li>Space Complexity: O(1)</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Right panel - code editor & output */}
          <div className={`${selectedProblem ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
            <Tabs defaultValue="editor" className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="editor" className="flex items-center gap-1">
                    <Book className="h-4 w-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger value="output" className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    Output
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={resetEditor}
                    className="flex items-center gap-1 text-purple-700 border-purple-300 hover:bg-purple-50"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={copyCode}
                    className="flex items-center gap-1 text-purple-700 border-purple-300 hover:bg-purple-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button 
                    className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700"
                    onClick={runCode}
                    disabled={isRunning}
                    size="sm"
                  >
                    {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Run Code
                  </Button>
                </div>
              </div>
              
              <TabsContent value="editor" className="flex-1 mt-0">
                <div className="editor-container h-[calc(100vh-300px)] overflow-hidden flex flex-col">
                  <div className="p-2 bg-[#2D2B55] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">main.js</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isBlindMode ? (
                        <div className="bg-yellow-500 text-yellow-950 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Blind Mode
                        </div>
                      ) : (
                        <div className="bg-green-500 text-green-950 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Visual Mode
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Textarea
                    value={code}
                    onChange={handleCodeChange}
                    className={`font-mono text-sm border-0 h-full p-4 focus-visible:ring-0 ${isBlindMode ? 'text-[#1E1E3F] bg-[#1E1E3F]' : 'text-gray-200 bg-[#1E1E3F]'}`}
                    placeholder="Start coding here..."
                    spellCheck={false}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="output" className="mt-0 flex-1">
                <div className="bg-gray-900 text-gray-200 p-4 font-mono text-sm rounded-lg h-[calc(100vh-300px)] overflow-auto">
                  {output ? (
                    <pre>{output}</pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <AlertCircle className="h-12 w-12 mb-4 text-gray-500" />
                      <p>Run your code to see output here</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 px-6 bg-gray-900 text-white mt-8">
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

export default Playground;
