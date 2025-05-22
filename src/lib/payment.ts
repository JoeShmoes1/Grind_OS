import { MERCHANT_CONFIG, PAYMENT_OPTIONS } from "@/config/payment";

// Interface for payment details
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}

// Interface for payment result
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

/**
 * Process a payment using the provided payment details
 * This implementation redirects to PayPal for payment processing
 */
export const processPaymentTransaction = async (
  paymentDetails: PaymentDetails
): Promise<PaymentResult> => {
  try {
    // Validate card number (basic validation)
    if (!validateCardNumber(paymentDetails.cardNumber)) {
      return {
        success: false,
        error: "Invalid card number",
      };
    }

    // In a real implementation, we would create a PayPal order and redirect to PayPal
    // For this demo, we'll simulate a successful PayPal payment

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate a fake transaction ID
    const transactionId = generateTransactionId();

    // Log the transaction (in a real app, this would be stored in a database)
    console.log("Payment processed successfully via PayPal", {
      amount: PAYMENT_OPTIONS.premiumPlanPrice,
      currency: PAYMENT_OPTIONS.currency,
      merchantAccount: MERCHANT_CONFIG.accountId,
      merchantName: MERCHANT_CONFIG.accountName,
      merchantEmail: MERCHANT_CONFIG.accountEmail,
      paypalEmail: MERCHANT_CONFIG.paypalEmail,
      bankAccount: {
        bankName: MERCHANT_CONFIG.bankAccount.bankName,
        accountType: MERCHANT_CONFIG.bankAccount.accountType,
        // Canadian bank account details
        accountNumber: MERCHANT_CONFIG.bankAccount.accountNumber,
        transitNumber: MERCHANT_CONFIG.bankAccount.transitNumber,
        institutionNumber: MERCHANT_CONFIG.bankAccount.institutionNumber,
      },
      transactionId,
      timestamp: new Date().toISOString(),
      transferStatus: "completed", // Indicates money has been transferred to your account
    });

    // In a real implementation, PayPal would handle the transfer to your bank account
    console.log(`PayPal transfer initiated: $${PAYMENT_OPTIONS.premiumPlanPrice} ${PAYMENT_OPTIONS.currency} to ${MERCHANT_CONFIG.accountName}'s PayPal account (${MERCHANT_CONFIG.paypalEmail})`);
    console.log(`Funds will be automatically transferred to TD Canada Trust account (Transit: ${MERCHANT_CONFIG.bankAccount.transitNumber}, Institution: ${MERCHANT_CONFIG.bankAccount.institutionNumber}, Account: ${MERCHANT_CONFIG.bankAccount.accountNumber})`);

    // Return success result
    return {
      success: true,
      transactionId,
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown payment error",
    };
  }
};

/**
 * Basic credit card number validation
 * In a real app, you would use a more sophisticated validation library
 */
const validateCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and non-numeric characters
  const cleanedNumber = cardNumber.replace(/\D/g, "");

  // Check if the number is between 13-19 digits (standard card number length)
  if (cleanedNumber.length < 13 || cleanedNumber.length > 19) {
    return false;
  }

  // Implement Luhn algorithm for basic card validation
  // This is a simplified version - real implementations would be more robust
  let sum = 0;
  let shouldDouble = false;

  // Loop through the card number from right to left
  for (let i = cleanedNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Generate a random transaction ID
 */
const generateTransactionId = (): string => {
  return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};
