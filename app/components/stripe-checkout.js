import Ember from 'ember';
import config from '../config/environment';

/**
 * Stripe checkout component for accepting payments with
 * an embedded form.
 *
 * Stripe docs: https://stripe.com/docs/tutorials/checkout
 *
 * Usage:
 * {{stripe-checkout
 *   description=billingPlan.description
 *   amount=billingPlan.amount
 * }}
 */
export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['stripe-checkout'],
  attributeBindings: ['isDisabled:disabled'],

  /**********************************
   * Required attributes
   **********************************/

  /**
   * Your publishable key (test or live).
   */
  key: config.stripe.key,

  /**********************************
   * Highly recommended attributes
   **********************************/

  /**
   * A relative URL pointing to a square image of your brand or
   * product. The recommended minimum size is 128x128px.
   * Eg. "/square-image.png"
   */
  image: null,

  /**
   * The name of your company or website.
   */
  name: "Demo Site",

  /**
   * A description of the product or service being purchased.
   */
  description: "2 widgets ($20.00)",

  /**
   * The amount (in cents) that's shown to the user. Note that you
   * will still have to explicitly include it when you create a
   * charge using the Stripe API.
   */
  amount: 2000,

  /**********************************
   * Optional attributes
   **********************************/

  /**
   * Accept Bitcoin payments.
   */
  bitcoin: false,

  /**
   * The currency of the amount (3-letter ISO code). The default is USD.
   */
  currency: "USD",

  /**
   * The label of the payment button in the Checkout form (e.g. “Subscribe”,
   * “Pay {{amount}}”, etc.). If you include {{amount}}, it will be replaced
   * by the provided amount. Otherwise, the amount will be appended to the
   * end of your label.
   */
  panelLabel: null,

  /**
   * Specify whether Checkout should validate the billing ZIP code
   * (true or false). The default is false.
   */
  zipCode: false,

  /**
   * Specify whether Checkout should collect the customer's billing address
   * (true or false). The default is false.
   */
  address: false,

  /**
   * If you already know the email address of your user, you can provide
   * it to Checkout to be pre-filled.
   */
  email: null,

  /**
   * The text to be shown on the default blue button.
   */
  label: "Pay with card",

  /**
   * Specify whether to include the option to "Remember Me" for future
   * purchases (true or false). The default is true.
   */
  allowRememberMe: true,

  /**
   * Specify whether to include the option to use alipay to
   * checkout (true or false or auto). The default is false.
   */
  alipay: false,

  /**
   * Specify whether to reuse alipay information to
   * checkout (true or false). The default is false.
   */
  'alipay-reusable': false,

  /**
   * Specify language preference.
   */
  locale: config.stripe.locale,

  /**********************************
   * Extras
   **********************************/

  /**
   * Bind to this attribute to disable the stripe
   * button until the user completes prior requirements
   * (like choosing a plan)
   */
  isDisabled: false,

  /**
   * Stripe handler
   */
  handler: null,

  /**
   * By default we add stripe button classes.
   * Set to false to disable Stripe styles
   *
   * TODO: Need to load stripe styles in order for this to apply
   */
  useStripeStyles: true,

  /**
   * Sets up Stripe and sends component action
   * with the Stripe token when checkout succeeds.
   *
   * The token looks like this
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
  setupStripe: Ember.on('init', function() {
    var self = this;

    if (Ember.isNone(this.get('key'))) {
      throw [
        "Your Stripe key must be set to use the stripe-checkout component. ",
        "Set the key in your environment.js file (ENV.stripe.key) or set the ",
        "key property on the component when instantiating it in your hbs template. ",
        "Find your Stripe publishable key at https://dashboard.stripe.com/account/apikeys"
      ].join('\n');
    }

    var handler = StripeCheckout.configure({
      key: this.get('key'),
      locale: this.get('locale'),
      token: function(token) {
        self.sendAction('action', token);
      },
      opened: function() {
        self.sendAction('opened');
      },
      closed: function() {
        self.sendAction('closed');
      }
    });
    this.set('handler', handler);
  }),

  /**
   * Kick up the modal if we're clicked
   */
  click: function(e) {
    this.openModal();
    e.preventDefault();
  },

  /**
   * Opens the Stripe modal for payment
   */
  openModal: function() {
    var options = this.getProperties([
      'image',
      'name',
      'description',
      'amount',
      'bitcoin',
      'currency',
      'panelLabel',
      'zipCode',
      'address',
      'email',
      'label',
      'allowRememberMe',
      'alipay',
      'alipay-reusable'
    ]);
    this.get('handler').open(options);
  },

  closeOnDestroy: Ember.on('willDestroyElement', function() {
    // Close modal if the user navigates away from page
    this.get('handler').close();
  })
});
