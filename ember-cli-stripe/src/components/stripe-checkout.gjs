import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import {on} from '@ember/modifier';
import stripeConfigOptions from '../utils/configuration-options';

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
export default class StripeCheckout extends Component {
  @service stripe;

  /**
   * Stripe checkout button text.
   */
  get label() {
    return this.args.label ?? 'Pay with card';
  }

  /**
   * When true, the Stripe checkout button is disabled.
   */
  get isDisabled() {
    return this.args.isDisabled ?? false;
  }

  /**
   * Controls opening the Stripe Checkout modal dynamically.
   * Will open the mcheckout modal when true.
   */
  showCheckout = false;

  /**
   * Opens the Stripe modal for payment.
   */
  openCheckout = () => {
    this.stripe.open(this);
  };

  closeCheckout = () => {
    this.stripe.close(this);
  };

  stripeConfig = () => {
    return Object.fromEntries(
      stripeConfigOptions.map((key) => [key, this.args[key]])
    );
  };

  constructor() {
    super(...arguments);
    this.stripe.registerComponent(this, this.stripeConfig);
  }

  willDestroy() {
    super.willDestroy(...arguments);

    this.closeCheckout();
    this.stripe.unregisterComponent(this);
  }

  <template>
    <button
  class="stripe-checkout {{if @isDisabled 'disabled'}}"
  type="button"
  {{on "click" this.openCheckout}}
>
  {{#if (has-block)}}
    {{yield}}
  {{else}}
    {{this.label}}
  {{/if}}
</button>
  </template>
}
