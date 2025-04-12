import { toast } from "sonner";
import { Problem, TestCase } from "../data/problems";

// Mock data for demonstration purposes
// In a real app, this would be replaced with actual backend calls

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  score?: number;
  rounds?: {[key: string]: number}; // Track scores for different rounds
  problemsSolved?: number; // Track number of problems solved
  lastSubmission?: string; // Timestamp of last submission
  submissions?: Submission[]; // Track all submissions
}

interface Submission {
  problemId: number;
  timestamp: string;
  passed: boolean;
  score: number;
}

// Mock users database
const USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "Nexus_admin",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    score: 85,
    rounds: {
      "1": 85,
      "2": 70,
      "3": 0,
    },
    problemsSolved: 3,
    lastSubmission: "2025-04-10T14:30:00Z",
    submissions: []
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    score: 92,
    rounds: {
      "1": 92,
      "2": 85,
      "3": 0,
    },
    problemsSolved: 4,
    lastSubmission: "2025-04-11T10:15:00Z",
    submissions: []
  },
  {
    id: "4",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "student",
    score: 78,
    rounds: {
      "1": 78,
      "2": 65,
      "3": 0,
    },
    problemsSolved: 2,
    lastSubmission: "2025-04-09T16:45:00Z",
    submissions: []
  }
];

// Store the current logged in user
let currentUser: User | null = null;

// Store custom problems created by admin
let CUSTOM_PROBLEMS: Problem[] = [];

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Special case for admin
      if (email === "Nexus_admin" && password === 'Z*N!E3X"U7#') {
        const adminUser = USERS.find(u => u.email === email);
        if (adminUser) {
          currentUser = adminUser;
          localStorage.setItem("nexus_user", JSON.stringify(adminUser));
          resolve(adminUser);
          return;
        }
      }
      
      // Regular user login
      const user = USERS.find(u => u.email === email);
      
      // For demo purposes, any password works for regular users
      if (user) {
        currentUser = user;
        localStorage.setItem("nexus_user", JSON.stringify(user));
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 800);
  });
};

export const register = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Check if user already exists
      if (USERS.some(u => u.email === email)) {
        reject(new Error("User with this email already exists"));
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: String(USERS.length + 1),
        name,
        email,
        role: "student",
        score: 0,
        rounds: {
          "1": 0,
          "2": 0,
          "3": 0
        }
      };
      
      USERS.push(newUser);
      currentUser = newUser;
      localStorage.setItem("nexus_user", JSON.stringify(newUser));
      resolve(newUser);
    }, 800);
  });
};

export const logout = (): void => {
  currentUser = null;
  localStorage.removeItem("nexus_user");
};

export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;
  
  const storedUser = localStorage.getItem("nexus_user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  
  return null;
};

export const getAllUsers = (): User[] => {
  return USERS;
};

export const getUsersByRound = (round: string): User[] => {
  return USERS.filter(u => u.role === "student");
};

export const updateUserScore = (userId: string, score: number, round: string = "1", problemId?: number): void => {
  const user = USERS.find(u => u.id === userId);
  if (user) {
    // Update overall score
    user.score = score;
    
    // Update round-specific score
    if (!user.rounds) {
      user.rounds = {};
    }
    user.rounds[round] = score;
    
    // Update problemsSolved count and lastSubmission
    if (problemId) {
      if (!user.problemsSolved) {
        user.problemsSolved = 1;
      } else {
        user.problemsSolved += 1;
      }
      
      user.lastSubmission = new Date().toISOString();
      
      // Add submission record
      if (!user.submissions) {
        user.submissions = [];
      }
      
      user.submissions.push({
        problemId,
        timestamp: user.lastSubmission,
        passed: true,
        score: score - (user.score || 0) // Calculate points gained from this submission
      });
    }
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      currentUser.score = score;
      if (!currentUser.rounds) {
        currentUser.rounds = {};
      }
      currentUser.rounds[round] = score;
      
      if (problemId) {
        if (!currentUser.problemsSolved) {
          currentUser.problemsSolved = 1;
        } else {
          currentUser.problemsSolved += 1;
        }
        
        currentUser.lastSubmission = user.lastSubmission;
        currentUser.submissions = user.submissions;
      }
      
      localStorage.setItem("nexus_user", JSON.stringify(currentUser));
    }
  }
};

export const addParticipant = (name: string, email: string, password: string = "password123"): User | null => {
  // Check if user already exists
  if (USERS.some(u => u.email === email)) {
    toast.error("User with this email already exists");
    return null;
  }
  
  // Create new user
  const newUser: User = {
    id: String(USERS.length + 1),
    name,
    email,
    role: "student",
    score: 0,
    rounds: {
      "1": 0,
      "2": 0,
      "3": 0
    }
  };
  
  USERS.push(newUser);
  toast.success(`${name} added as a participant`);
  return newUser;
};

export const removeParticipant = (userId: string): boolean => {
  const index = USERS.findIndex(u => u.id === userId);
  if (index !== -1) {
    const userName = USERS[index].name;
    USERS.splice(index, 1);
    toast.success(`${userName} removed from participants`);
    return true;
  }
  return false;
};

// New functions for problem management
export const addProblem = (problem: Omit<Problem, "id">): Problem => {
  const newId = CUSTOM_PROBLEMS.length > 0 
    ? Math.max(...CUSTOM_PROBLEMS.map(p => p.id)) + 1 
    : 100; // Start custom problems from ID 100
    
  const newProblem: Problem = {
    ...problem,
    id: newId
  };
  
  CUSTOM_PROBLEMS.push(newProblem);
  toast.success(`Problem "${problem.title}" added successfully`);
  return newProblem;
};

export const updateProblem = (id: number, updatedProblem: Partial<Problem>): Problem | null => {
  const index = CUSTOM_PROBLEMS.findIndex(p => p.id === id);
  if (index !== -1) {
    CUSTOM_PROBLEMS[index] = { ...CUSTOM_PROBLEMS[index], ...updatedProblem };
    toast.success(`Problem "${CUSTOM_PROBLEMS[index].title}" updated successfully`);
    return CUSTOM_PROBLEMS[index];
  }
  
  return null;
};

export const deleteProblem = (id: number): boolean => {
  const index = CUSTOM_PROBLEMS.findIndex(p => p.id === id);
  if (index !== -1) {
    const problemTitle = CUSTOM_PROBLEMS[index].title;
    CUSTOM_PROBLEMS.splice(index, 1);
    toast.success(`Problem "${problemTitle}" deleted successfully`);
    return true;
  }
  
  return false;
};

export const getAllProblems = (): Problem[] => {
  return [...CUSTOM_PROBLEMS];
};

export const getProblemById = (id: number): Problem | null => {
  return CUSTOM_PROBLEMS.find(p => p.id === id) || null;
};

export const validateCode = (code: string, problemId: number): { passed: boolean, results: { input: string, expected: string, actual: string, passed: boolean }[] } => {
  // Find the problem
  const problem = getProblemById(problemId);
  if (!problem || !problem.testCases) {
    return { passed: false, results: [] };
  }
  
  // Simulate code validation against test cases
  // In a real app, this would execute the code against test cases
  
  // For demo purposes, we'll simulate a random outcome for each test case
  const results = problem.testCases.map(testCase => {
    const passed = Math.random() > 0.3; // 70% chance of passing a test
    
    return {
      input: testCase.input,
      expected: testCase.expectedOutput,
      actual: passed ? testCase.expectedOutput : "Failed result", // Simulate output
      passed
    };
  });
  
  // Only pass if all test cases pass
  const allPassed = results.every(r => r.passed);
  
  return {
    passed: allPassed,
    results
  };
};
