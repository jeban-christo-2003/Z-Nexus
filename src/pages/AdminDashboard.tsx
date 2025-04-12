import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, UserCheck, UserX, Trophy, Search, Plus, ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { problems } from "@/data/problems";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allUsers = getAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "score">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRound, setSelectedRound] = useState("1");
  
  if (!user) {
    return null; // Protected route will handle this
  }
  
  // Only keep non-admin users for the leaderboard
  const students = allUsers.filter(u => u.role === "student");
  
  // Apply search filter
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort users
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA;
    }
  });
  
  // Count of students and admins
  const studentCount = allUsers.filter(u => u.role === "student").length;
  const adminCount = allUsers.filter(u => u.role === "admin").length;

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
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Problem Sets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="text-2xl font-bold">{allUsers.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-2xl font-bold">{studentCount}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UserX className="h-5 w-5 text-purple-800 mr-2" />
                    <span className="text-2xl font-bold">{adminCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold gradient-text">User Management</CardTitle>
                    <CardDescription>View and manage all users and scores</CardDescription>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "admin" 
                                ? "bg-purple-100 text-purple-800" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>{user.score !== undefined ? user.score : "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl font-bold gradient-text">
                      Student Rankings
                    </CardTitle>
                    <CardDescription>
                      Performance leaderboard for all coding challenges
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Round" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Round 1</SelectItem>
                        <SelectItem value="2">Round 2</SelectItem>
                        <SelectItem value="3">Round 3</SelectItem>
                        <SelectItem value="all">All Rounds</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                      }}
                      className="h-10 w-10"
                    >
                      {sortDirection === "asc" ? (
                        <ArrowUpZA className="h-4 w-4" />
                      ) : (
                        <ArrowDownAZ className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {sortedStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No students match your search criteria
                    </div>
                  ) : (
                    sortedStudents.map((student, index) => (
                      <div 
                        key={student.id} 
                        className={`flex items-center justify-between p-4 rounded-lg 
                          ${index === 0 ? "bg-yellow-50 border border-yellow-100" : 
                            index === 1 ? "bg-gray-50 border border-gray-100" : 
                              index === 2 ? "bg-amber-50 border border-amber-100" : 
                                "bg-white border border-gray-100"}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                            ${index === 0 ? "bg-yellow-200 text-yellow-800" : 
                              index === 1 ? "bg-gray-200 text-gray-800" : 
                                index === 2 ? "bg-amber-200 text-amber-800" : 
                                  "bg-purple-100 text-purple-800"}`}>
                            {index + 1}
                          </div>
                          
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Score</div>
                            <div className="text-xl font-bold text-purple-700">{student.score || 0}</div>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-xs font-medium
                            ${index === 0 ? "bg-yellow-100 text-yellow-800" : 
                              index === 1 ? "bg-gray-100 text-gray-800" : 
                                index === 2 ? "bg-amber-100 text-amber-800" : 
                                  "bg-blue-100 text-blue-800"}`}>
                            {index === 0 ? "Gold" : 
                              index === 1 ? "Silver" : 
                                index === 2 ? "Bronze" : 
                                  `Rank #${index + 1}`}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="text-sm text-gray-500">
                    Showing {sortedStudents.length} of {students.length} students
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Export Results
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="problems" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold gradient-text">
                  Problem Management
                </CardTitle>
                <CardDescription>
                  Configure problem sets for each round and difficulty level
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Available Problems</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Problem
                    </Button>
                  </div>
                  
                  <Tabs defaultValue="easy">
                    <TabsList className="grid grid-cols-3 w-[400px]">
                      <TabsTrigger value="easy">Easy</TabsTrigger>
                      <TabsTrigger value="medium">Medium</TabsTrigger>
                      <TabsTrigger value="hard">Hard</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="easy" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Passkey</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {problems
                            .filter(p => p.difficulty === "Easy")
                            .map(problem => (
                              <TableRow key={problem.id}>
                                <TableCell>{problem.id}</TableCell>
                                <TableCell className="font-medium">{problem.title}</TableCell>
                                <TableCell>{problem.category}</TableCell>
                                <TableCell>
                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs inline-block">
                                    easy
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="medium" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Passkey</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {problems
                            .filter(p => p.difficulty === "Medium")
                            .map(problem => (
                              <TableRow key={problem.id}>
                                <TableCell>{problem.id}</TableCell>
                                <TableCell className="font-medium">{problem.title}</TableCell>
                                <TableCell>{problem.category}</TableCell>
                                <TableCell>
                                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs inline-block">
                                    medium
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                    
                    <TabsContent value="hard" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Passkey</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {problems
                            .filter(p => p.difficulty === "Hard")
                            .map(problem => (
                              <TableRow key={problem.id}>
                                <TableCell>{problem.id}</TableCell>
                                <TableCell className="font-medium">{problem.title}</TableCell>
                                <TableCell>{problem.category}</TableCell>
                                <TableCell>
                                  <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs inline-block">
                                    hard
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
