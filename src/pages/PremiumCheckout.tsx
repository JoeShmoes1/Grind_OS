
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { processPaymentTransaction, PaymentDetails } from "@/lib/payment";
import { MERCHANT_CONFIG, PAYMENT_OPTIONS, PAYPAL_CONFIG } from "@/config/payment";
import { PaymentReceipt } from "@/components/payment/PaymentReceipt";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard } from "lucide-react";

const formSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().length(3, "CVV must be 3 digits"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

const PremiumCheckout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();

  // Function to handle PayPal payment
  const handlePayPalPayment = () => {
    setIsProcessing(true);

    // In a real implementation, we would redirect to PayPal here
    // For this demo, we'll simulate a successful PayPal payment after a delay
    setTimeout(() => {
      // Generate a transaction ID
      const paypalTransactionId = `paypal_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      // Update user profile to premium
      localStorage.setItem("isPremium", "true");
      updateUserProfile({ isPremium: true });

      // Show receipt
      setTransactionId(paypalTransactionId);
      setShowReceipt(true);
      setIsProcessing(false);

      toast({
        title: "PayPal Payment Successful!",
        description: `Welcome to GRIND OS Premium! Transaction ID: ${paypalTransactionId}`,
      });
    }, 2000);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      name: user?.name || "",
    },
  });

  const processPayment = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true);

    try {
      // Convert form values to payment details
      const paymentDetails: PaymentDetails = {
        cardNumber: values.cardNumber,
        expiryDate: values.expiryDate,
        cvv: values.cvv,
        name: values.name,
      };

      // Process the payment
      const result = await processPaymentTransaction(paymentDetails);

      if (result.success) {
        // Payment successful
        toast({
          title: "Payment Successful!",
          description: `Welcome to GRIND OS Premium! Transaction ID: ${result.transactionId}`,
        });

        // Log the successful payment to merchant account
        console.log(`Payment of $${PAYMENT_OPTIONS.premiumPlanPrice} successfully transferred to account: ${MERCHANT_CONFIG.accountId} (${MERCHANT_CONFIG.accountName})`);

        // Save premium status to localStorage and update user profile
        localStorage.setItem("isPremium", "true");

        // Update the user profile to reflect premium status
        await updateUserProfile({ isPremium: true });

        // Show receipt instead of navigating away
        setTransactionId(result.transactionId || "");
        setShowReceipt(true);
      } else {
        // Payment failed
        toast({
          title: "Payment Failed",
          description: result.error || "There was an error processing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle unexpected errors
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-grindos-purple to-grindos-blue bg-clip-text text-transparent">Upgrade to Premium</h1>
          <p className="text-muted-foreground">$2.99/month - Cancel anytime</p>
        </div>

        {showReceipt ? (
          <PaymentReceipt
            transactionId={transactionId}
            date={new Date().toLocaleDateString()}
            amount={PAYMENT_OPTIONS.premiumPlanPrice}
            currency={PAYMENT_OPTIONS.currency}
            customerName={form.getValues().name}
            onClose={() => {
              // Mark onboarding as completed
              updateUserProfile({
                onboardingCompleted: true,
                packageSelected: true,
                isPremium: true
              }).then(() => {
                // Navigate to home
                navigate("/");
              });
            }}
          />
        ) : (
          <>
            <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setPaymentMethod(value as "card" | "paypal")}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </TabsTrigger>
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.067 7.301C20.067 10.041 18.167 12.301 15.367 12.301H13.347C13.107 12.301 12.907 12.461 12.867 12.701L12.087 17.041C12.047 17.221 11.887 17.341 11.707 17.341H8.86701C8.66701 17.341 8.50701 17.181 8.54701 16.981L10.527 5.281C10.567 5.101 10.727 4.981 10.907 4.981H17.347C18.887 4.981 20.067 6.001 20.067 7.301Z" fill="currentColor"/>
                    <path d="M6.30701 17.341H3.46701C3.26701 17.341 3.10701 17.181 3.14701 16.981L5.12701 5.281C5.16701 5.101 5.32701 4.981 5.50701 4.981H8.34701C8.54701 4.981 8.70701 5.141 8.66701 5.341L6.68701 17.041C6.64701 17.221 6.48701 17.341 6.30701 17.341Z" fill="currentColor"/>
                    <path d="M17.347 4.981H10.907C10.727 4.981 10.567 5.101 10.527 5.281L8.54701 16.981C8.50701 17.181 8.66701 17.341 8.86701 17.341H11.707C11.887 17.341 12.047 17.221 12.087 17.041L12.867 12.701C12.907 12.461 13.107 12.301 13.347 12.301H15.367C18.167 12.301 20.067 10.041 20.067 7.301C20.067 6.001 18.887 4.981 17.347 4.981Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
                    <path d="M6.30701 17.341H3.46701C3.26701 17.341 3.10701 17.181 3.14701 16.981L5.12701 5.281C5.16701 5.101 5.32701 4.981 5.50701 4.981H8.34701C8.54701 4.981 8.70701 5.141 8.66701 5.341L6.68701 17.041C6.64701 17.221 6.48701 17.341 6.30701 17.341Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
                  </svg>
                  <span>PayPal</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card">
                <Card>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(processPayment)}>
                      <CardHeader>
                        <CardTitle>Credit Card Payment</CardTitle>
                        <CardDescription>Enter your card details securely</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="1234 5678 9012 3456"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="MM/YY"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    type="password"
                                    maxLength={3}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="pt-4">
                          <div className="flex justify-between mb-2">
                            <span>Premium Plan</span>
                            <span>${PAYMENT_OPTIONS.premiumPlanPrice}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>${PAYMENT_OPTIONS.premiumPlanPrice}/month</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="w-full bg-grindos-purple hover:bg-grindos-purple/90"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : `Pay $${PAYMENT_OPTIONS.premiumPlanPrice} with Card`}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>

              <TabsContent value="paypal">
                <Card>
                  <CardHeader>
                    <CardTitle>PayPal Payment</CardTitle>
                    <CardDescription>Pay securely using your PayPal account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center py-6">
                      <svg className="h-16 w-16 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.067 7.301C20.067 10.041 18.167 12.301 15.367 12.301H13.347C13.107 12.301 12.907 12.461 12.867 12.701L12.087 17.041C12.047 17.221 11.887 17.341 11.707 17.341H8.86701C8.66701 17.341 8.50701 17.181 8.54701 16.981L10.527 5.281C10.567 5.101 10.727 4.981 10.907 4.981H17.347C18.887 4.981 20.067 6.001 20.067 7.301Z" fill="currentColor"/>
                        <path d="M6.30701 17.341H3.46701C3.26701 17.341 3.10701 17.181 3.14701 16.981L5.12701 5.281C5.16701 5.101 5.32701 4.981 5.50701 4.981H8.34701C8.54701 4.981 8.70701 5.141 8.66701 5.341L6.68701 17.041C6.64701 17.221 6.48701 17.341 6.30701 17.341Z" fill="currentColor"/>
                        <path d="M17.347 4.981H10.907C10.727 4.981 10.567 5.101 10.527 5.281L8.54701 16.981C8.50701 17.181 8.66701 17.341 8.86701 17.341H11.707C11.887 17.341 12.047 17.221 12.087 17.041L12.867 12.701C12.907 12.461 13.107 12.301 13.347 12.301H15.367C18.167 12.301 20.067 10.041 20.067 7.301C20.067 6.001 18.887 4.981 17.347 4.981Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
                        <path d="M6.30701 17.341H3.46701C3.26701 17.341 3.10701 17.181 3.14701 16.981L5.12701 5.281C5.16701 5.101 5.32701 4.981 5.50701 4.981H8.34701C8.54701 4.981 8.70701 5.141 8.66701 5.341L6.68701 17.041C6.64701 17.221 6.48701 17.341 6.30701 17.341Z" stroke="currentColor" strokeWidth="0.5" strokeMiterlimit="10"/>
                      </svg>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        You'll be redirected to PayPal to complete your payment securely.
                      </p>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Premium Plan</span>
                        <span>${PAYMENT_OPTIONS.premiumPlanPrice}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${PAYMENT_OPTIONS.premiumPlanPrice}/month</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handlePayPalPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay $${PAYMENT_OPTIONS.premiumPlanPrice} with PayPal`}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Your payment information is processed securely.</p>
              <p className="mt-1">By upgrading, you agree to our Terms of Service.</p>
              <p className="mt-4 text-xs">Payments will be transferred to: {MERCHANT_CONFIG.accountName}'s TD Canada Trust account</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumCheckout;
