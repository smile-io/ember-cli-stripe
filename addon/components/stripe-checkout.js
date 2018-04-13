import Ember from 'ember';
import layout from '../templates/components/stripe-checkout';

const {
  computed: { bool },
  Component,
  inject: { service },
} = Ember;

/**
 * Stripe checkout component for accepting payments with
 * an embedded form.
 *
 * Stripe docs: https://stripe.com/docs/tutorials/checkout
 * List of possible Stripe options: https://stripe.com/docs/checkout#integration-simple-options
 *
 * Usage:
 * {{stripe-checkout
 *   description=billingPlan.description
 *   amount=billingPlan.amount
 * }}
 *
 */
export default Component.extend({
  classNames: ['stripe-checkout'],
  attributeBindings: ['isDisabled:disabled'],
  tagName: 'button',
  layout,

  stripe: service(),


  /**
   * Stripe checkout button text.
   */
  label: 'Pay with card',

  /**
   * When true, the Stripe checkout button is disabled.
   */
  isDisabled: false,

  /**
   * Controls opening the Stripe Checkout modal dynamically.
   * Will open the mcheckout modal when true.
   */
  showCheckout: false,

  hasBlock: bool('template').readOnly(),

  /**
   * Kick up the modal if we're clicked.
   */
  click(e) {
    e.preventDefault();
    this.openCheckout();
  },

  /**
   * Opens the Stripe modal for payment.
   */
  openCheckout() {
    this.get('stripe').open(this);
  },

  closeCheckout() {
    this.get('stripe').close(this);
  },

  willInsertElement() {
    this._super(...arguments);
    this.get('stripe').registerComponent(this);
  },

  didReceiveAttrs() {
    if (this.get('showCheckout')) {
      this.openCheckout();
    }
  },

  willDestroyElement() {
    this._super(...arguments);

    this.closeCheckout();
    this.get('stripe').unregisterComponent(this);
  },
});
