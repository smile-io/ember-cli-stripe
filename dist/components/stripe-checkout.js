import Component from '@glimmer/component';
import { inject } from '@ember/service';
import { on } from '@ember/modifier';
import { compactOptions, configurationOptions } from '../utils/configuration-options.js';
import { modifier } from 'ember-modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { g, i } from 'decorator-transforms/runtime';

class StripeCheckout extends Component {
  static {
    g(this.prototype, "stripe", [inject]);
  }
  #stripe = (i(this, "stripe"), void 0);
  /**
  * Stripe checkout button text.
  */
  get label() {
    return this.args.label ?? 'Pay with card';
  }
  get stripeConfig() {
    return {
      ...compactOptions(Object.fromEntries(configurationOptions.map(key => [key, this.args[key]]))),
      onToken: this.args.onToken,
      onOpened: this.args.onOpened,
      onClosed: this.args.onClosed
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
  static {
    setComponentTemplate(precompileTemplate("\n    <button class=\"stripe-checkout\" type=\"button\" disabled={{@isDisabled}} {{this.autoOpenCheckout @showCheckout}} {{on \"click\" this.handleClick}}>\n      {{#if (has-block)}}\n        {{yield}}\n      {{else}}\n        {{this.label}}\n      {{/if}}\n    </button>\n  ", {
      strictMode: true,
      scope: () => ({
        on
      })
    }), this);
  }
}

export { StripeCheckout as default };
//# sourceMappingURL=stripe-checkout.js.map
