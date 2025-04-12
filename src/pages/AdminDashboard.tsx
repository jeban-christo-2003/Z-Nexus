
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, addParticipant, removeParticipant, getUsersByRound, getAllProblems, deleteProblem } from "@/services/auth";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { 
  ChevronLeft, 
  Users, 
  UserCheck, 
  UserX, 
  Trophy, 
  Search, 
  Plus, 
  ArrowDownAZ, 
  ArrowUpZA,
  ChevronRight,
  Trash2,
  Edit,
  Save,
  Clock,
  CheckCircle,
  FileCode
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { problems as defaultProblems } from "@/data/problems";
import ProblemEditor from "@/components/ProblemEditor";

// Form schema for adding participants
const addParticipantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type AddParticipantFormValues = z.infer<typeof addParticipantSchema>;

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allUsers = getAllUsers();
  const customProblems = getAllProblems();
  const allProblems = [...defaultProblems, ...customProblems];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "score">("score");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedRound, setSelectedRound] = useState("1");
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [confirmDeleteProblemId, setConfirmDeleteProblemId] = useState<number | null>(null);
  const [editingProblemId, setEditingProblemId] = useState<number | null>(null);
  const [isProblemEditorOpen, setIsProblemEditorOpen] = useState(false);
  
  // Form for adding new participants
  const addParticipantForm = useForm<AddParticipantFormValues>({
    resolver: zodResolver(addParticipantSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
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

  // Handle add participant
  const onAddParticipantSubmit = (data: AddParticipantFormValues) => {
    const result = addParticipant(data.name, data.email);
    if (result) {
      addParticipantForm.reset();
    }
  };

  // Handle delete participant
  const handleDeleteParticipant = (userId: string) => {
    if (removeParticipant(userId)) {
      setConfirmDeleteUserId(null);
    }
  };
  
  // Handle delete problem
  const handleDeleteProblem = (problemId: number) => {
    if (deleteProblem(problemId)) {
      setConfirmDeleteProblemId(null);
    } else {
      toast.error("Cannot delete default problems");
      setConfirmDeleteProblemId(null);
    }
  };
  
  // Handle open problem editor for creating or editing
  const openProblemEditor = (problemId?: number) => {
    if (problemId) {
      setEditingProblemId(problemId);
    } else {
      setEditingProblemId(null);
    }
    setIsProblemEditorOpen(true);
  };

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
              <FileCode className="h-4 w-4" />
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
                <div className="flex justify-between items-center mb-4">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search users..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Participant
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Participant</DialogTitle>
                        <DialogDescription>
                          Add a new student to the system. They will be assigned a default password.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...addParticipantForm}>
                        <form onSubmit={addParticipantForm.handleSubmit(onAddParticipantSubmit)} className="space-y-4">
                          <FormField
                            control={addParticipantForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={addParticipantForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="email@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <DialogFooter>
                            <Button type="submit">Add Participant</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="rounded-lg border shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Problems Solved</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Last Submission</TableHead>
                        <TableHead>Actions</TableHead>
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
                          <TableCell>{user.problemsSolved || 0}</TableCell>
                          <TableCell>{user.score !== undefined ? user.score : "N/A"}</TableCell>
                          <TableCell>
                            {user.lastSubmission 
                              ? format(parseISO(user.lastSubmission), "MMM d, yyyy")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {user.role !== "admin" && (
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setConfirmDeleteUserId(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Delete User Confirmation Dialog */}
            <Dialog open={!!confirmDeleteUserId} onOpenChange={(open) => !open && setConfirmDeleteUserId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove this participant? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDeleteUserId(null)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => confirmDeleteUserId && handleDeleteParticipant(confirmDeleteUserId)}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                <div className="rounded-lg border shadow-sm overflow-hidden">
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
                      {sortedStudents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No students match your search criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedStudents.map((student, index) => (
                          <TableRow key={student.id}>
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
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.problemsSolved || 0}</TableCell>
                            <TableCell>
                              {student.lastSubmission 
                                ? format(parseISO(student.lastSubmission), "MMM d, yyyy")
                                : "Never"}
                            </TableCell>
                            <TableCell className="font-bold text-purple-700">
                              {selectedRound !== "all" && student.rounds 
                                ? student.rounds[selectedRound] || 0
                                : student.score || 0}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                  <Tabs defaultValue="round1">
                    <TabsList className="grid grid-cols-3 w-[400px] mb-6">
                      <TabsTrigger value="round1">Round 1</TabsTrigger>
                      <TabsTrigger value="round2">Round 2</TabsTrigger>
                      <TabsTrigger value="round3">Round 3</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="round1" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Round 1 Problems</h3>
                        <Button variant="outline" size="sm" onClick={() => openProblemEditor()}>
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
                                <TableHead>Test Cases</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allProblems
                                .filter(p => p.difficulty === "Easy")
                                .map(problem => (
                                  <TableRow key={problem.id}>
                                    <TableCell>{problem.id}</TableCell>
                                    <TableCell className="font-medium">{problem.title}</TableCell>
                                    <TableCell>{problem.category}</TableCell>
                                    <TableCell>
                                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs inline-block">
                                        {problem.passkey || "easy"}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {problem.testCases ? problem.testCases.length : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => openProblemEditor(problem.id)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => setConfirmDeleteProblemId(problem.id)}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
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
                                <TableHead>Test Cases</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allProblems
                                .filter(p => p.difficulty === "Medium")
                                .map(problem => (
                                  <TableRow key={problem.id}>
                                    <TableCell>{problem.id}</TableCell>
                                    <TableCell className="font-medium">{problem.title}</TableCell>
                                    <TableCell>{problem.category}</TableCell>
                                    <TableCell>
                                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs inline-block">
                                        {problem.passkey || "medium"}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {problem.testCases ? problem.testCases.length : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => openProblemEditor(problem.id)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => setConfirmDeleteProblemId(problem.id)}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
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
                                <TableHead>Test Cases</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allProblems
                                .filter(p => p.difficulty === "Hard")
                                .map(problem => (
                                  <TableRow key={problem.id}>
                                    <TableCell>{problem.id}</TableCell>
                                    <TableCell className="font-medium">{problem.title}</TableCell>
                                    <TableCell>{problem.category}</TableCell>
                                    <TableCell>
                                      <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs inline-block">
                                        {problem.passkey || "hard"}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      {problem.testCases ? problem.testCases.length : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => openProblemEditor(problem.id)}>
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"
                                          onClick={() => setConfirmDeleteProblemId(problem.id)}>
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                      </Tabs>
                    </TabsContent>
                    
                    <TabsContent value="round2" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Round 2 Problems</h3>
                        <Button variant="outline" size="sm" onClick={() => openProblemEditor()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Problem
                        </Button>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800">
                        Round 2 problems can be configured once Round 1 is complete. You can prepare problems in advance.
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="round3" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Round 3 Problems</h3>
                        <Button variant="outline" size="sm" onClick={() => openProblemEditor()}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Problem
                        </Button>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800">
                        Round 3 problems can be configured once Round 2 is complete. You can prepare problems in advance.
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
            
            {/* Delete Problem Confirmation Dialog */}
            <Dialog open={!!confirmDeleteProblemId} onOpenChange={(open) => !open && setConfirmDeleteProblemId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Problem Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this problem? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setConfirmDeleteProblemId(null)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => confirmDeleteProblemId && handleDeleteProblem(confirmDeleteProblemId)}
                  >
                    Delete Problem
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Problem Editor Dialog */}
            <ProblemEditor 
              open={isProblemEditorOpen} 
              onClose={() => setIsProblemEditorOpen(false)}
              problemId={editingProblemId || undefined}
              round={selectedRound}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
