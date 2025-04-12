
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passkey: z.string().optional(),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, login, register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [showPasskey, setShowPasskey] = useState(false);

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "register") {
      setActiveTab("register");
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        // For students, don't automatically redirect
        // They'll need to enter a passkey to access problems
      }
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      passkey: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      // Check for admin credentials first
      if (data.email === "Nexus_admin" && data.password === 'Z*N!E3X"U7#') {
        // Admin login - special handling
        await login(data.email, data.password);
        // Admin always goes to admin dashboard
        navigate('/admin');
        return;
      }
      
      // Regular user login
      await login(data.email, data.password);
      
      // After successful login, check if passkey was provided
      if (data.passkey) {
        // Validate passkey
        if (["0000", "easy", "medium", "hard"].includes(data.passkey)) {
          if (data.passkey === "0000") {
            // Admin passkey - redirect to admin dashboard if they used the admin passkey
            navigate('/admin');
          } else {
            // Valid difficulty passkey - redirect to correct problem set
            navigate(`/playground?passkey=${data.passkey}`);
          }
        } else {
          toast.error("Invalid passkey. Please try again.");
        }
      } else {
        // No passkey, show dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      await authRegister(data.name, data.email, data.password);
      setShowPasskey(true);
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold gradient-text">
              BlindCode
            </CardTitle>
            <CardDescription className="text-md">
              Coding Challenges for Programmers
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 mx-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="px-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username or email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="passkey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passkey (Optional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter contest passkey" {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500">
                          Enter a passkey to access specific problem sets
                        </p>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="register" className="px-6">
              {showPasskey ? (
                <div className="text-center py-4">
                  <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-700 mb-2">Registration Successful!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your account has been created. To participate in coding challenges, you'll need a passkey.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigate('/playground?passkey=easy');
                        }}
                        className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                      >
                        Easy Problems
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigate('/playground?passkey=medium');
                        }}
                        className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        Medium Problems
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigate('/playground?passkey=hard');
                        }}
                        className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Hard Problems
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    onClick={() => navigate('/dashboard')}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
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
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={registerForm.formState.isSubmitting}>
                      {registerForm.formState.isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-center text-sm text-gray-500 mt-4">
            <p>
              {activeTab === "login" ? "New to BlindCode? " : "Already have an account? "}
              <button
                type="button"
                className="text-purple-600 hover:underline"
                onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              >
                {activeTab === "login" ? "Create an account" : "Login"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
