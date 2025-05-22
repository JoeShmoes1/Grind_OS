import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PackageSelection = () => {
  const [selectedPackage, setSelectedPackage] = useState<"free" | "premium" | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectPackage, user } = useAuth();
  
  const handleContinue = async () => {
    if (!selectedPackage) {
      toast({
        title: "Please select a package",
        description: "You need to select either the Free or Premium package to continue.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await selectPackage(selectedPackage === "premium");
      
      if (selectedPackage === "premium") {
        // Navigate to payment page for premium users
        navigate("/premium-checkout");
      } else {
        // Navigate to dashboard for free users
        toast({
          title: "Welcome to GRIND OS!",
          description: "You're all set with the Free package. Enjoy the app!"
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error selecting your package. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">Choose Your Package</h1>
        <p className="text-muted-foreground text-center mb-8">
          Select the package that best fits your needs
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Package */}
          <Card 
            className={`border-2 cursor-pointer transition-all ${
              selectedPackage === "free" 
                ? "border-grindos-purple bg-grindos-purple/5" 
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => setSelectedPackage("free")}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Free Package</span>
                <span className="text-xl font-bold">$0</span>
              </CardTitle>
              <CardDescription>Basic productivity tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Access to GM, Task, and Journal rooms</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Basic AI assistant features</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Limited storage for notes and journals</span>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Advanced productivity rooms</span>
                </div>
                <div className="flex items-start">
                  <X className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Premium templates and features</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPackage === "free" ? "default" : "outline"} 
                className={`w-full ${selectedPackage === "free" ? "bg-grindos-purple hover:bg-grindos-purple/90" : ""}`}
                onClick={() => setSelectedPackage("free")}
              >
                Select Free Package
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Package */}
          <Card 
            className={`border-2 cursor-pointer transition-all ${
              selectedPackage === "premium" 
                ? "border-grindos-purple bg-grindos-purple/5" 
                : "hover:border-muted-foreground/50"
            }`}
            onClick={() => setSelectedPackage("premium")}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <span>Premium Package</span>
                  <div className="ml-2 bg-grindos-purple text-white text-xs px-2 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                </CardTitle>
                <span className="text-xl font-bold">$2.99<span className="text-sm font-normal">/month</span></span>
              </div>
              <CardDescription>Full productivity suite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Access to <strong>all rooms</strong> including premium ones</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Advanced AI assistant with unlimited usage</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Unlimited storage for all your content</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Premium templates and productivity tools</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Priority support and early access to new features</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedPackage === "premium" ? "default" : "outline"} 
                className={`w-full ${selectedPackage === "premium" ? "bg-grindos-purple hover:bg-grindos-purple/90" : ""}`}
                onClick={() => setSelectedPackage("premium")}
              >
                <Zap className="mr-2 h-4 w-4" />
                Select Premium Package
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            className="bg-grindos-purple hover:bg-grindos-purple/90 px-8"
            onClick={handleContinue}
            disabled={!selectedPackage}
          >
            Continue with {selectedPackage ? (selectedPackage === "free" ? "Free Package" : "Premium Package") : "Selected Package"}
          </Button>
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-4">
          You can upgrade or downgrade your package at any time from the settings.
        </p>
      </div>
    </div>
  );
};

export default PackageSelection;
