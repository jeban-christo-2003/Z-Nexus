
import { toast } from "sonner";

// Mock data for demonstration purposes
// In a real app, this would be replaced with actual backend calls

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  score?: number;
}

// Mock users database
const USERS: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@nexus.com",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    score: 85,
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    score: 92,
  },
  {
    id: "4",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "student",
    score: 78,
  }
];

// Store the current logged in user
let currentUser: User | null = null;

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      const user = USERS.find(u => u.email === email);
      
      // For demo purposes, any password works
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

export const updateUserScore = (userId: string, score: number): void => {
  const user = USERS.find(u => u.id === userId);
  if (user) {
    user.score = score;
    // Update current user if it's the same user
    if (currentUser && currentUser.id === userId) {
      currentUser.score = score;
      localStorage.setItem("nexus_user", JSON.stringify(currentUser));
    }
  }
};
