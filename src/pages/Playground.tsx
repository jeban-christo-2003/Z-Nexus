
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Eye, EyeOff, Check, Timer, Book, AlertCircle, 
  RefreshCw, Copy, Save, ChevronRight, ChevronLeft 
} from "lucide-react";
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from "sonner";
import { problems } from '@/data/problems';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserScore, validateCode } from '@/services/auth';
import FullscreenManager from '@/components/FullscreenManager';

const Playground = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const problemId = id ? parseInt(id) : undefined;
  
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isBlindMode, setIsBlindMode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [exitWarningCount, setExitWarningCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  
  // Start timer automatically when problem is loaded
  useEffect(() => {
    if (selectedProblem && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  }, [selectedProblem]);
  
  // Check if we reached the time limit
  useEffect(() => {
    if (timeLeft <= 0 && isTimerRunning) {
      // Time's up, auto-submit
      submitCode();
    }
  }, [timeLeft]);
  
  // Timer for the 25-minute countdown
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (isTimerRunning) {
      intervalId = window.setInterval(() => {
        setTimeLeft(prevTime => Math.max(0, prevTime - 1));
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTimerRunning]);
  
  // Get language placeholder or starter code
  const getLanguageStarter = (language: string) => {
    if (selectedProblem && selectedProblem.starterCode) {
      return selectedProblem.starterCode;
    }
    
    switch (language) {
      case "javascript":
        return "// Write your JavaScript solution here\n\nfunction solution(input) {\n  // Your code here\n}\n";
      case "python":
        return "# Write your Python solution here\n\ndef solution(input):\n    # Your code here\n    pass\n";
      case "java":
        return "// Write your Java solution here\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}\n";
      case "c":
        return "// Write your C solution here\n\n#include <stdio.h>\n\nint main() {\n    // Your code here\n    return 0;\n}\n";
      case "cpp":
        return "// Write your C++ solution here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}\n";
      default:
        return "// Write your solution here";
    }
  };
  
  useEffect(() => {
    // Extract passkey from URL query params
    const queryParams = new URLSearchParams(location.search);
    const passkey = queryParams.get('passkey');
    
    // Set problems based on passkey
    if (passkey && problems) {
      let filteredProblems;
      let difficulty;
      
      switch (passkey) {
        case "easy":
          filteredProblems = problems.filter(p => p.difficulty === "Easy");
          difficulty = "Easy";
          break;
        case "medium":
          filteredProblems = problems.filter(p => p.difficulty === "Medium");
          difficulty = "Medium";
          break;
        case "hard":
          filteredProblems = problems.filter(p => p.difficulty === "Hard");
          difficulty = "Hard";
          break;
        default:
          filteredProblems = problems;
          difficulty = "Mixed";
      }
      
      // If we have a specific problem ID, get that problem
      if (problemId && filteredProblems) {
        const problem = filteredProblems.find(p => p.id === problemId);
        if (problem) {
          setSelectedProblem(problem);
          setCode(getLanguageStarter(selectedLanguage));
          // Start timer automatically
          setIsTimerRunning(true);
        } else {
          // If problem not found, redirect to first problem in filtered list
          if (filteredProblems.length > 0) {
            navigate(`/playground/${filteredProblems[0].id}?passkey=${passkey}`);
          }
        }
      } else if (filteredProblems && filteredProblems.length > 0) {
        // If no specific problem, redirect to first problem in filtered list
        navigate(`/playground/${filteredProblems[0].id}?passkey=${passkey}`);
      }
    } else if (problemId && problems) {
      const problem = problems.find(p => p.id === problemId);
      if (problem) {
        setSelectedProblem(problem);
        setCode(getLanguageStarter(selectedLanguage));
        // Start timer automatically
        setIsTimerRunning(true);
      }
    } else {
      // No passkey and no problem ID, show empty editor
      setCode(getLanguageStarter(selectedLanguage));
      setSelectedProblem(null);
    }
  }, [problemId, location.search]);
  
  // Update code when language changes
  useEffect(() => {
    if (selectedProblem) {
      setCode(getLanguageStarter(selectedLanguage));
    } else {
      setCode(getLanguageStarter(selectedLanguage));
    }
  }, [selectedLanguage]);
  
  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const handleFullscreenExit = () => {
    const newCount = exitWarningCount + 1;
    setExitWarningCount(newCount);
    
    if (newCount >= 3) {
      // Auto-submit after 3 warnings
      submitCode();
      navigate('/dashboard');
    } else {
      toast({
        title: `Warning (${newCount}/3)`,
        description: "Exiting fullscreen mode may result in automatic submission.",
        variant: "destructive",
      });
    }
  };
  
  const submitCode = () => {
    setIsSubmitting(true);
    setIsTimerRunning(false);
    
    try {
      setTimeout(() => {
        if (selectedProblem) {
          const testOutput = `Evaluating submission for "${selectedProblem.title}"...\n\n`;
          
          // Simulate test results with validation
          let passedTests = false;
          let testResults;
          
          if (selectedProblem.testCases && selectedProblem.testCases.length > 0) {
            // Use the validation function from auth.ts
            const validation = validateCode(code, selectedProblem.id);
            passedTests = validation.passed;
            
            // Build test results output
            let resultsOutput = "";
            validation.results.forEach((result, index) => {
              if (!selectedProblem.testCases[index].isHidden) {
                resultsOutput += `Test ${index + 1}:\n`;
                resultsOutput += `Input: ${result.input}\n`;
                resultsOutput += `Expected: ${result.expected}\n`;
                resultsOutput += `Actual: ${result.actual}\n`;
                resultsOutput += `${result.passed ? "✅ Passed" : "❌ Failed"}\n\n`;
              } else if (!result.passed) {
                resultsOutput += `Hidden Test ${index + 1}: ❌ Failed\n\n`;
              }
            });
            
            testResults = resultsOutput;
          } else {
            // Fallback for problems without test cases
            passedTests = Math.random() > 0.3; // 70% pass chance for demo
            testResults = passedTests 
              ? "All tests passed!" 
              : "Some tests failed. Expected: [1, 2, 3]\nActual: [1, 2, 4]";
          }
          
          if (passedTests) {
            setOutput(`${testOutput}✅ All tests passed!\n\n${testResults}\n\nYour solution successfully solved the problem.`);
            toast({
              title: "Success!",
              description: "Your code passed all test cases!",
              variant: "default",
            });
            
            // Update user score if logged in
            if (user) {
              let difficultyMultiplier = 1;
              if (selectedProblem.difficulty === "Medium") difficultyMultiplier = 2;
              if (selectedProblem.difficulty === "Hard") difficultyMultiplier = 3;
              
              const timeBonus = Math.max(0, (25 * 60 - elapsedTime)) / 60; // Time bonus based on time left
              const scoreGain = Math.round(10 * difficultyMultiplier + timeBonus);
              
              // Pass the problem ID to update submission records
              updateUserScore(user.id, (user.score || 0) + scoreGain, "1", selectedProblem.id);
              sonnerToast.success(`You earned ${scoreGain} points!`);
            }
          } else {
            setOutput(`${testOutput}❌ Some tests failed\n\n${testResults}`);
            toast({
              title: "Tests Failed",
              description: "Some test cases did not pass. Check the output for details.",
              variant: "destructive",
            });
          }
        } else {
          // No problem selected scenario
          setOutput(`Evaluation Result:\n\nNo problem was selected for evaluation.`);
        }
        
        setIsSubmitting(false);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }, 1500);
    } catch (error) {
      setOutput(`Error: ${error}`);
      setIsSubmitting(false);
    }
  };
  
  const resetEditor = () => {
    setCode(getLanguageStarter(selectedLanguage));
    setOutput("");
    setIsTimerRunning(true); // Restart timer on reset
    setTimeLeft(25 * 60); // Reset time to 25 minutes
    setElapsedTime(0);
    setShowResults(false);
    
    toast({
      title: "Editor Reset",
      description: "Your code has been reset to the starter template.",
    });
  };

  return (
    <FullscreenManager onExit={handleFullscreenExit} onSubmit={submitCode}>
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
                <span className="font-medium">Time Left: {formatTime(timeLeft)}</span>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Previous Problem"
                        onClick={() => {
                          // Find previous problem in same difficulty
                          const queryParams = new URLSearchParams(location.search);
                          const passkey = queryParams.get('passkey');
                          
                          if (passkey && selectedProblem) {
                            let filteredProblems = problems.filter(p => 
                              (passkey === "easy" && p.difficulty === "Easy") ||
                              (passkey === "medium" && p.difficulty === "Medium") ||
                              (passkey === "hard" && p.difficulty === "Hard")
                            );
                            
                            const currentIndex = filteredProblems.findIndex(p => p.id === selectedProblem.id);
                            if (currentIndex > 0) {
                              navigate(`/playground/${filteredProblems[currentIndex - 1].id}?passkey=${passkey}`);
                            }
                          }
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" title="Next Problem"
                        onClick={() => {
                          // Find next problem in same difficulty
                          const queryParams = new URLSearchParams(location.search);
                          const passkey = queryParams.get('passkey');
                          
                          if (passkey && selectedProblem) {
                            let filteredProblems = problems.filter(p => 
                              (passkey === "easy" && p.difficulty === "Easy") ||
                              (passkey === "medium" && p.difficulty === "Medium") ||
                              (passkey === "hard" && p.difficulty === "Hard")
                            );
                            
                            const currentIndex = filteredProblems.findIndex(p => p.id === selectedProblem.id);
                            if (currentIndex < filteredProblems.length - 1) {
                              navigate(`/playground/${filteredProblems[currentIndex + 1].id}?passkey=${passkey}`);
                            }
                          }
                        }}
                      >
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
                      <AlertCircle className="h-4 w-4" />
                      Output
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedLanguage}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                      </SelectContent>
                    </Select>
                    
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
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                      onClick={submitCode}
                      disabled={isSubmitting}
                      size="sm"
                    >
                      <Check className="h-4 w-4" />
                      Submit
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="editor" className="flex-1 mt-0">
                  <div className="editor-container h-[calc(100vh-300px)] overflow-hidden flex flex-col">
                    <div className="p-2 bg-[#2D2B55] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-white">
                          {selectedLanguage === "javascript" ? "main.js" : 
                           selectedLanguage === "python" ? "main.py" :
                           selectedLanguage === "java" ? "Solution.java" :
                           selectedLanguage === "c" ? "main.c" : "main.cpp"}
                        </span>
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
                      onCopy={(e) => e.preventDefault()} // Disable copy
                      onPaste={(e) => e.preventDefault()} // Disable paste
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
                        <p>Submit your code to see output here</p>
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
    </FullscreenManager>
  );
};

export default Playground;
