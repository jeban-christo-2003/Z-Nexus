
import React from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, Trophy, User, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return null; // Protected route will handle this
  }

  // Get user's score
  const userScore = user.score || 0;
  
  // Get top performers (for the leaderboard)
  const users = getAllUsers()
    .filter(u => u.role === "student" && u.score !== undefined)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 5);

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
                onClick={() => navigate("/playground")}
              >
                <Code className="h-4 w-4 mr-2" />
                Practice Now
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
                        <p className="text-sm text-gray-500">{u.email}</p>
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
                onClick={() => navigate("/problems")}
              >
                View All Problems
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
