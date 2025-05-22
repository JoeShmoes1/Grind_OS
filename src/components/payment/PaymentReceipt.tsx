import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, Printer } from "lucide-react";
import { MERCHANT_CONFIG, PAYMENT_OPTIONS } from "@/config/payment";

interface PaymentReceiptProps {
  transactionId: string;
  date: string;
  amount: number;
  currency: string;
  customerName: string;
  onClose: () => void;
}

export const PaymentReceipt = ({
  transactionId,
  date,
  amount,
  currency,
  customerName,
  onClose,
}: PaymentReceiptProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF receipt
    alert("Receipt download functionality would be implemented here");
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md print:shadow-none">
        <CardHeader className="text-center border-b pb-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Payment Successful</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-medium">{transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {currency === "USD" ? "$" : currency} {amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="font-medium">{customerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Merchant</span>
              <span className="font-medium">{MERCHANT_CONFIG.accountName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Merchant ID</span>
              <span className="font-medium">{MERCHANT_CONFIG.accountId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transfer Status</span>
              <span className="font-medium text-green-600">Completed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transfer To</span>
              <span className="font-medium">{MERCHANT_CONFIG.bankAccount.bankName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account Details</span>
              <span className="font-medium">
                {MERCHANT_CONFIG.bankAccount.transitNumber}-
                {MERCHANT_CONFIG.bankAccount.institutionNumber}-
                {MERCHANT_CONFIG.bankAccount.accountNumber}
              </span>
            </div>

            <div className="pt-4 mt-4 border-t">
              <div className="flex justify-between font-medium">
                <span>Premium Plan</span>
                <span>
                  {currency === "USD" ? "$" : currency} {amount.toFixed(2)}/month
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handlePrint}
            disabled={isPrinting}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            className="w-full sm:w-auto bg-grindos-purple hover:bg-grindos-purple/90"
            onClick={onClose}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
