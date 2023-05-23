import Stripe from 'stripe';
// Defines the StripePayment class
export default class StripePayment {
  constructor({ ServerConfig }) {
    this.serverConfig = ServerConfig;
    this.stripe = Stripe(this.serverConfig.STRIPE_SECRET_KEY);
  }

  // Creates a payment intent at Stripe
  createPaymentIntent = async (data) => {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(data);
      return paymentIntent;
    } catch (error) {
      throw error;
    }
  };
}
