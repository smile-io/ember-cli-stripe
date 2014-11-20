import Ember from 'ember';
import config from '../config/environment';

/**
 * Stripe checkout component that displays the pay button
 * and opens stripe modal to accept payment.
 *
 * Usage:
 * {{stripe-checkout description=billingPlan.description amount=billingPlan.amount}}
 * 
 * Docs: https://stripe.com/docs/tutorials/checkout
 */
export default Ember.Component.extend({

  tagName: 'button',
  classNames: ['btn', 'btn-primary'],
  attributeBindings: ['isDisabled:disabled'],

  name: "Sweet Tooth",
  panelLabel: null,
  amount: 1000,
  description: "Small Business ($10.00)",
  key: config['stripe-checkout'].key,
  image: "/images/logo-jar.png",
  isDisabled: false,

  handler: null,
  token: null,

  /**
   * Token looks like this
   * {
   *   "id": "tok_150enDGA2quO03uZPF8Nve2a",
   *   "livemode": false,
   *   "created": 1416427871,
   *   "used": false,
   *   "object": "token",
   *   "type": "card",
   *   "card": {
   *     "id": "card_150enDGA2quO03uZK8AwnT9x",
   *     "object": "card",
   *     "last4": "4242",
   *     "brand": "Visa",
   *     "funding": "credit",
   *     "exp_month": 8,
   *     "exp_year": 2015,
   *     "fingerprint": "AwGY3mROvhSpEvSc",
   *     "country": "US",
   *     "name": null,
   *     "address_line1": null,
   *     "address_line2": null,
   *     "address_city": null,
   *     "address_state": null,
   *     "address_zip": null,
   *     "address_country": null,
   *     "dynamic_last4": null,
   *     "customer": null
   *   }
   * }
   *
   * Source: https://stripe.com/docs/api#tokens
   */
  setupStripe: function() {
    var self = this;

    var handler = StripeCheckout.configure({
      key: this.get('key'),
      image: this.get('image'),
      token: function(token) {
        self.sendAction('action', token);
      }
    });

    this.set('handler', handler);
  }.on('init'),

  click: function(e) {
    this.get('handler').open({
      name: this.get('name'),
      description: this.get('description'),
      amount: this.get('amount'),
      panelLabel: this.get('panelLabel')
    });
    e.preventDefault();
  },

  willDestroy: function() {
    // Close modal if the user navigates away from page
    this.get('handler').close();
  }
});
