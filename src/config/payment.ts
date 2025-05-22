// Payment configuration

// Your merchant account details
export const MERCHANT_CONFIG = {
  // Your account details for receiving payments
  accountId: "acct_user123456789", // Your merchant account ID
  accountName: "Grind OS", // Your name or business name
  accountEmail: "payments@grindos.com", // Your email address
  paypalEmail: "payments@grindos.com", // Your PayPal email address

  // Payment processor details
  paymentProcessor: {
    name: "PayPal",
    merchantId: "acct_1234567890",
    processorType: "PayPal",
  },

  // Bank account details for receiving funds
  bankAccount: {
    bankName: "TD Canada Trust",
    accountType: "Business Checking",
    // Canadian bank account details
    institutionNumber: "004", // TD Canada Trust institution number
    transitNumber: "05752", // Branch transit number
    accountNumber: "6529886", // Account number
  },
};

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: "pk_test_TYooMQauvdEDq54NiTphI7jx", // Replace with your actual Stripe publishable key
  apiVersion: "2023-10-16",
};

// PayPal configuration
export const PAYPAL_CONFIG = {
  clientId: "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R", // PayPal sandbox client ID
  currency: "USD",
  intent: "capture", // 'capture' for immediate payment, 'authorize' for authorization only
  returnUrl: "http://localhost:3000/payment-success", // URL to return to after successful payment
  cancelUrl: "http://localhost:3000/premium-checkout", // URL to return to if payment is cancelled
};

// Payment options
export const PAYMENT_OPTIONS = {
  currency: "USD",
  premiumPlanPrice: 2.99,
};
