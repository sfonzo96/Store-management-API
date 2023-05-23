// Defines PaymentService class
export default class PaymentService {
  constructor({ ServerConfig, StripePayment, PurchaseService }) {
    this.serverConfig = ServerConfig;
    this.stripePayment = StripePayment;
    this.purchaseService = PurchaseService;
  }

  // Creates a payment intent
  createPaymentIntent = async (id) => {
    try {
      // Checks if the purchase has been registered
      const purchase = await this.purchaseService.getPurchaseById(id);

      // Constitutes the payment data objetc
      const paymentData = {
        amount: purchase.subtotal * 100, // Stripe works with cents, so the amount is multiplied by 100
        currency: 'usd',
        metadata: {
          purchaseID: purchase._id.toString(), // Stores the purchase ID in the metadata to be identify the purchase payment in Stripe
        },
      };

      // Creates the payment intent
      const paymentIntent = await this.stripePayment.createPaymentIntent(
        paymentData
      );

      // If not successful, throws an error
      if (!paymentIntent) {
        throw new CustomError('Payment intent could not be created', 500);
      }

      // If successful then updates the purchase status to true to indicate that the purchase has been paid
      await this.purchaseService.setPurchaseStatus(purchase._id, true);
      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };
}
