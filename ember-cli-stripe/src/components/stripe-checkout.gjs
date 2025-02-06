import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { configurationOptions } from '../utils/configuration-options.js';
import AttachStripeCheckout from '../modifiers/attach-stripe-checkout.js';

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

  @tracked isOpen = false;

  /**
   * Stripe checkout button text.
   */
  get label() {
    return this.args.label ?? 'Pay with card';
  }

  get stripeConfig() {
    return Object.fromEntries(
      configurationOptions.map((key) => [key, this.args[key]]),
    );
  }

  toggleCheckout = () => {
    this.isOpen = !this.isOpen;
  };

  handleClosed = () => {
    this.toggleCheckout();
    this.args.onClosed?.();
  };

  <template>
    <button
      {{AttachStripeCheckout
        @showCheckout
        onToken=@onToken
        onOpened=@onOpened
        onClosed=this.handleClosed
        onScriptLoad=@onScriptLoad
        onScriptLoadError=@onScriptLoadError
      }}
      class="stripe-checkout"
      type="button"
      disabled={{@isDisabled}}
      {{on "click" @onClick}}
    >
      {{#if (has-block)}}
        {{yield}}
      {{else}}
        {{this.label}}
      {{/if}}
    </button>
  </template>
}
