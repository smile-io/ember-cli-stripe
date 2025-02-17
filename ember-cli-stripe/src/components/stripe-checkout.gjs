import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/modifier';
import {
  configurationOptions,
  compactOptions,
} from '../utils/configuration-options.js';
import { modifier } from 'ember-modifier';

/**
 * Stripe checkout component for accepting payments with
 * an embedded form.
 *
 * Stripe docs: https://stripe.com/docs/tutorials/checkout
 * List of possible Stripe options: ../utils/configuration-options.js
 *
 * Usage:
 * <StripeCheckout
 *   @description={{billingPlan.description}}
 *   @amount={{billingPlan.amount}}
 *   @onToken={{this.handleToken}}
 *   @onOpened={{this.handleOpened}}
 *   @onClosed={{this.handleClosed}}
 * />
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

  get stripeConfig() {
    return {
      ...compactOptions(
        Object.fromEntries(
          configurationOptions.map((key) => [key, this.args[key]]),
        ),
      ),
      onToken: this.args.onToken,
      onOpened: this.args.onOpened,
      onClosed: this.args.onClosed,
    };
  }

  handleClick = () => {
    this.stripe.open(this.stripeConfig);
  };

  autoOpenCheckout = modifier((element, [autoOpen]) => {
    if (autoOpen) {
      this.handleClick();
    }
  });

  <template>
    <button
      class="stripe-checkout"
      type="button"
      disabled={{@isDisabled}}
      {{this.autoOpenCheckout @showCheckout}}
      {{on "click" this.handleClick}}
    >
      {{#if (has-block)}}
        {{yield}}
      {{else}}
        {{this.label}}
      {{/if}}
    </button>
  </template>
}
