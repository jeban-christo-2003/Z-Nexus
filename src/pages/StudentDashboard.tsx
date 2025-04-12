
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Trophy, User, Code, Calendar, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!user) {
    return null; // Protected route will handle this
  }

  // Get user's score
  const userScore = user.score || 0;
  const problemsSolved = user.problemsSolved || 0;
  const lastSubmission = user.lastSubmission 
    ? format(parseISO(user.lastSubmission), "MMM d, yyyy 'at' h:mm a") 
    : "No submissions yet";
  
  // Get top performers (for the leaderboard)
  const users = getAllUsers()
    .filter(u => u.role === "student" && u.score !== undefined)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

  // Get user's submission history
  const submissions = user.submissions || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">{userScore}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Problems Solved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">{problemsSolved}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Last Submission</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-md">{lastSubmission}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Info Card */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-purple-700">Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="mt-4 text-center">
                    <p className="text-gray-600">Your current score</p>
                    <p className="text-3xl font-bold text-purple-700">{userScore}</p>
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button 
                    variant="default" 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate("/problems")}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Practice More
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Leaderboard Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-purple-700">Leaderboard</CardTitle>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardDescription>Top performers in the Nexus Symposium</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((u, index) => (
                      <div 
                        key={u.id} 
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          u.id === user.id 
                            ? "bg-purple-100 border border-purple-200" 
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            index === 0 
                              ? "bg-yellow-100 text-yellow-700" 
                              : index === 1 
                                ? "bg-gray-200 text-gray-700" 
                                : index === 2 
                                  ? "bg-amber-100 text-amber-700" 
                                  : "bg-purple-100 text-purple-700"
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-sm text-gray-500">{u.problemsSolved || 0} problems solved</p>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-purple-700">{u.score}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-center">
                  <Button 
                    variant="outline" 
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => setActiveTab("leaderboard")}
                  >
                    View Full Leaderboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-700">Your Submissions</CardTitle>
                <CardDescription>History of all your problem submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No submissions yet</p>
                    <p className="text-sm mt-2">Start solving problems to build your submission history</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate("/problems")}
                    >
                      View Problems
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Problem ID</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission, index) => (
                        <TableRow key={index}>
                          <TableCell>{submission.problemId}</TableCell>
                          <TableCell>
                            {format(parseISO(submission.timestamp), "MMM d, yyyy 'at' h:mm a")}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              submission.passed 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {submission.passed ? "Passed" : "Failed"}
                            </span>
                          </TableCell>
                          <TableCell>+{submission.score}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-purple-700">Full Leaderboard</CardTitle>
                <CardDescription>Ranking of all participants</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Problems Solved</TableHead>
                      <TableHead>Last Submission</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getAllUsers()
                      .filter(u => u.role === "student")
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((u, index) => (
                        <TableRow key={u.id} className={u.id === user.id ? "bg-purple-50" : ""}>
                          <TableCell>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                              index === 0 
                                ? "bg-yellow-100 text-yellow-700" 
                                : index === 1 
                                  ? "bg-gray-200 text-gray-700" 
                                  : index === 2 
                                    ? "bg-amber-100 text-amber-700" 
                                    : "bg-purple-100 text-purple-700"
                            }`}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{u.name}</TableCell>
                          <TableCell>{u.problemsSolved || 0}</TableCell>
                          <TableCell>
                            {u.lastSubmission 
                              ? format(parseISO(u.lastSubmission), "MMM d, yyyy")
                              : "Never"}
                          </TableCell>
                          <TableCell className="font-bold">{u.score || 0}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;
