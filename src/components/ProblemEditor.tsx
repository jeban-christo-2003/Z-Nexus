import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { X, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { addProblem, updateProblem, getProblemById } from "@/services/auth";
import { Problem, TestCase } from "@/data/problems";

// Form schema for the problem
const problemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  category: z.string().min(2, "Category must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  example: z.string().min(5, "Example must be at least 5 characters"),
  constraints: z.array(z.string()).min(1, "At least one constraint is required"),
  starterCode: z.string().min(10, "Starter code must be at least 10 characters"),
  passkey: z.string().min(1, "Passkey is required")
});

// Schema for test case
const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
  isHidden: z.boolean().default(false)
});

type ProblemFormValues = z.infer<typeof problemSchema> & {
  testCases: TestCase[];
};

interface ProblemEditorProps {
  open: boolean;
  onClose: () => void;
  problemId?: number; // For editing existing problems
  round?: string; // For associating with a specific round
}

const ProblemEditor: React.FC<ProblemEditorProps> = ({
  open,
  onClose,
  problemId,
  round = "1"
}) => {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", expectedOutput: "", isHidden: false }
  ]);
  const [constraints, setConstraints] = useState<string[]>(["1 ≤ arr.length ≤ 1000"]);
  const [newConstraint, setNewConstraint] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      difficulty: "Easy",
      category: "Arrays",
      description: "",
      example: "",
      constraints: ["1 ≤ arr.length ≤ 1000"],
      starterCode: "function solution(input) {\n  // Your code here\n}\n",
      passkey: "",
      testCases: [{ input: "", expectedOutput: "", isHidden: false }]
    }
  });

  // Load problem data if editing
  useEffect(() => {
    if (problemId && open) {
      setIsLoading(true);
      const problem = getProblemById(problemId);
      
      if (problem) {
        console.log("Loading problem for editing:", problem);
        
        // Reset form with problem data
        form.reset({
          title: problem.title,
          difficulty: problem.difficulty,
          category: problem.category,
          description: problem.description,
          example: problem.example,
          constraints: problem.constraints,
          starterCode: problem.starterCode,
          passkey: problem.passkey || "",
          testCases: problem.testCases || []
        });
        
        // Set state variables
        setConstraints(problem.constraints);
        setTestCases(problem.testCases || [{ input: "", expectedOutput: "", isHidden: false }]);
      } else {
        toast.error("Problem not found");
      }
      setIsLoading(false);
    } else if (open) {
      // Reset form for new problem
      form.reset({
        title: "",
        difficulty: "Easy",
        category: "Arrays",
        description: "",
        example: "",
        constraints: ["1 ≤ arr.length ≤ 1000"],
        starterCode: "function solution(input) {\n  // Your code here\n}\n",
        passkey: "",
        testCases: [{ input: "", expectedOutput: "", isHidden: false }]
      });
      
      setConstraints(["1 ≤ arr.length ≤ 1000"]);
      setTestCases([{ input: "", expectedOutput: "", isHidden: false }]);
    }
  }, [problemId, open, form]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "", isHidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    } else {
      toast.error("At least one test case is required");
    }
  };

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: string | boolean) => {
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setTestCases(updatedTestCases);
  };

  const handleAddConstraint = () => {
    if (newConstraint.trim()) {
      setConstraints([...constraints, newConstraint]);
      setNewConstraint("");
    }
  };

  const handleRemoveConstraint = (index: number) => {
    if (constraints.length > 1) {
      setConstraints(constraints.filter((_, i) => i !== index));
    } else {
      toast.error("At least one constraint is required");
    }
  };

  const onSubmit = async (data: ProblemFormValues) => {
    // Validate testCases
    if (testCases.some(tc => !tc.input || !tc.expectedOutput)) {
      toast.error("All test cases must have input and expected output");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the problem data with all required fields
      const problemData: Omit<Problem, "id"> = {
        title: data.title,
        difficulty: data.difficulty,
        category: data.category,
        description: data.description,
        example: data.example,
        constraints: constraints,
        starterCode: data.starterCode,
        // Default passkey to difficulty if not provided
        passkey: data.passkey || data.difficulty.toLowerCase(),
        testCases: testCases
      };

      console.log("Saving problem data:", problemData);

      if (problemId) {
        // Update existing problem
        const updated = await updateProblem(problemId, problemData);
        if (updated) {
          toast.success(`Problem "${data.title}" updated successfully`);
        }
      } else {
        // Add new problem
        const added = await addProblem(problemData);
        if (added) {
          toast.success(`Problem "${data.title}" added successfully`);
        }
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving problem:", error);
      toast.error("Failed to save problem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{problemId ? "Edit Problem" : "Add New Problem"}</DialogTitle>
          <DialogDescription>
            {problemId 
              ? "Update the details of this coding problem" 
              : "Create a new coding challenge for students"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problem Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Two Sum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passkey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passkey</FormLabel>
                      <FormControl>
                        <Input placeholder="easy, medium, hard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Arrays, Strings, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the problem in detail..." 
                      className="min-h-24"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Example</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Input: [1, 2, 3]\nOutput: [3, 2, 1]" 
                      className="min-h-16 font-mono"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Constraints</FormLabel>
              <div className="space-y-2 mt-2">
                {constraints.map((constraint, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={constraint}
                      onChange={(e) => {
                        const newConstraints = [...constraints];
                        newConstraints[index] = e.target.value;
                        setConstraints(newConstraints);
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveConstraint(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Add a new constraint"
                    value={newConstraint}
                    onChange={(e) => setNewConstraint(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddConstraint}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="starterCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starter Code</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="function solution(input) {\n  // Write your code here\n}" 
                      className="min-h-32 font-mono"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <FormLabel>Test Cases</FormLabel>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddTestCase}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Test Case
                </Button>
              </div>
              
              <div className="space-y-4">
                {testCases.map((testCase, index) => (
                  <Card key={index}>
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">Test Case {index + 1}</CardTitle>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleRemoveTestCase(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 space-y-3">
                      <div>
                        <FormLabel className="text-xs">Input</FormLabel>
                        <Textarea 
                          className="font-mono min-h-12"
                          placeholder="[1, 2, 3]"
                          value={testCase.input}
                          onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        />
                      </div>
                      <div>
                        <FormLabel className="text-xs">Expected Output</FormLabel>
                        <Textarea 
                          className="font-mono min-h-12"
                          placeholder="[3, 2, 1]"
                          value={testCase.expectedOutput}
                          onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`hidden-${index}`}
                          checked={testCase.isHidden}
                          onChange={(e) => handleTestCaseChange(index, "isHidden", e.target.checked)}
                        />
                        <label htmlFor={`hidden-${index}`} className="text-xs">Hidden test case (not shown to students)</label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {problemId ? "Update Problem" : "Create Problem"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemEditor;
