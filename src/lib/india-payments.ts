/** India payment configuration. Do not enable checkout until Razorpay has approved the merchant account. */
export const INDIA_PAYMENT_PROVIDER = 'razorpay' as const;
export const INDIA_CHECKOUT_ENABLED = false;
export const INDIA_PAYMENT_STATUS = 'pending-merchant-activation' as const;

/**
 * Production integration checklist:
 * 1. Confirm Razorpay KYC/merchant activation and settlement details.
 * 2. Configure server-only key ID/secret and webhook secret in the India deployment.
 * 3. Create orders on the server using a trusted, accepted invoice amount in paise.
 * 4. Verify Razorpay signatures and webhook authenticity server-side; make fulfillment idempotent.
 * 5. Reconcile captured payments, refunds and GST invoices with accounting records.
 * Never accept a price, invoice ID or payment-success flag solely from the browser.
 */
