
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SpinningGearLogo } from "@/components/ui/SpinningGearLogo";

type UserRole = "student" | "professional" | "other";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !age) {
      return toast({
        title: "Missing information",
        description: "Please fill in the required fields.",
        variant: "destructive"
      });
    }

    // Store user profile data
    await updateUserProfile({
      name,
      phoneNumber,
      age: parseInt(age),
      role
    });

    // Move to plan selection
    setStep(2);
  };

  const selectFreePlan = async () => {
    // Mark onboarding as completed
    await updateUserProfile({
      onboardingCompleted: true,
      packageSelected: true,
      isPremium: false
    });

    toast({
      title: "Free Plan Selected",
      description: "Welcome to GRIND OS! You can upgrade to Premium anytime.",
    });

    // Navigate to home
    navigate("/");
  };

  const selectPremiumPlan = async () => {
    // Mark package as selected
    await updateUserProfile({
      packageSelected: true
    });

    // In a real app, this would redirect to a Stripe checkout
    navigate("/premium-checkout");
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <SpinningGearLogo size={64} className="text-grindos-purple" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent">Welcome to GRIND OS</h1>
            <p className="text-muted-foreground">Let's set up your profile</p>
          </div>

          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Tell us a bit about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    min="13"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>What best describes you? <span className="text-red-500">*</span></Label>
                  <RadioGroup defaultValue="student" value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student">Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="professional" id="professional" />
                      <Label htmlFor="professional">Professional</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-grindos-purple hover:bg-grindos-purple/90">Continue</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SpinningGearLogo size={64} className="text-grindos-purple" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent">Choose Your Plan</h1>
          <p className="text-muted-foreground">Select the plan that works best for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border hover:border-primary hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Great for getting started</CardDescription>
              <div className="mt-2 text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="h-64">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Basic task management
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Simple journal entries
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Limited search capabilities
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Community support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={selectFreePlan}
                variant="outline"
                className="w-full"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-primary bg-primary/5 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Premium</CardTitle>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">RECOMMENDED</span>
              </div>
              <CardDescription>For optimal productivity</CardDescription>
              <div className="mt-2 text-3xl font-bold">$2.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="h-64">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Advanced</strong> task management
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Enhanced</strong> journal with templates
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Unlimited</strong> search capabilities
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Priority support
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <strong>Advanced</strong> analytics and insights
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  Custom themes and features
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={selectPremiumPlan}
                className="w-full bg-grindos-purple hover:bg-grindos-purple/90"
              >
                Upgrade to Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
