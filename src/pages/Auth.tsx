
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SpinningGearLogo } from "@/components/ui/SpinningGearLogo";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(30);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, signup, isAuthenticated, hasCompletedOnboarding, hasSelectedPackage, checkEmailExists } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      if (!hasCompletedOnboarding) {
        navigate("/onboarding");
      } else if (!hasSelectedPackage) {
        // Redirect to package selection if user hasn't selected a package
        navigate("/package-selection");
      } else {
        navigate(from);
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, hasSelectedPackage, navigate, location]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Sign in failed",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    try {
      await login(email, password, rememberMe);
      toast({
        title: "Signed in successfully",
        description: "Welcome back to GRIND OS!"
      });
      // Redirect handled by useEffect
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive"
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Sign up failed",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if email is already registered
    if (checkEmailExists(email)) {
      toast({
        title: "Sign up failed",
        description: "This email is already registered. Please sign in instead.",
        variant: "destructive"
      });
      return;
    }

    try {
      await signup(name, email, password, age, phoneNumber, rememberMe);
      toast({
        title: "Account created successfully",
        description: "Welcome to GRIND OS!"
      });
      // Redirect handled by useEffect
    } catch (error) {
      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Please check your information",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SpinningGearLogo size={64} className="text-grindos-purple" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent">GRIND OS</h1>
          <p className="text-muted-foreground">The personal operating system for peak performance</p>
        </div>

        <Card className="border-border">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signin-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signin-password" className="text-sm font-medium">Password</label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                      Keep me logged in
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-grindos-purple hover:bg-grindos-purple/90">Sign In</Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Enter your details to create your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-name" className="text-sm font-medium">Name</label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-age" className="text-sm font-medium">Age</label>
                    <Input
                      id="signup-age"
                      type="number"
                      placeholder="30"
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-phone" className="text-sm font-medium">Phone Number (Optional)</label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="signup-remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label htmlFor="signup-remember-me" className="text-sm text-muted-foreground">
                      Keep me logged in
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-grindos-purple hover:bg-grindos-purple/90">Create Account</Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
