
import { toast } from "sonner";

// Mock data for demonstration purposes
// In a real app, this would be replaced with actual backend calls

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  score?: number;
  rounds?: {[key: string]: number}; // Track scores for different rounds
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
    }
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
    }
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
    }
  }
];

// Store the current logged in user
let currentUser: User | null = null;

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

export const updateUserScore = (userId: string, score: number, round: string = "1"): void => {
  const user = USERS.find(u => u.id === userId);
  if (user) {
    // Update overall score
    user.score = score;
    
    // Update round-specific score
    if (!user.rounds) {
      user.rounds = {};
    }
    user.rounds[round] = score;
    
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      currentUser.score = score;
      if (!currentUser.rounds) {
        currentUser.rounds = {};
      }
      currentUser.rounds[round] = score;
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
