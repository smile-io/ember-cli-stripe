/* global StripeCheckout */
import Service from '@ember/service';
import { cached } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import { loadScript } from '../utils/load-script.js';
import { compactOptions } from '../utils/configuration-options.js';

const STRIPE_CHECKOUT_SCRIPT_URL = 'https://checkout.stripe.com/checkout.js';
let stripeCheckoutScript;

export default class StripeService extends Service {
  @cached
  get stripeConfig() {
    return (
      compactOptions(
        getOwner(this).resolveRegistration('config:environment').stripe,
      ) || {}
    );
  }

  async open(config = {}) {
    if (!stripeCheckoutScript) {
      stripeCheckoutScript = loadScript(STRIPE_CHECKOUT_SCRIPT_URL);
      await stripeCheckoutScript;
    }

    const fullConfig = this.#fullConfig(config);
    StripeCheckout.open(fullConfig);
  }

  /**
   * Final Stripe config options with env configs merged with the ones provided explicltly on checkout open.
   */
  #fullConfig(config) {
    return Object.assign(
      {
        token: config.onToken,
        opened: () => config.onOpened?.(),
        closed: () => config.onClosed?.(),
      },
      this.stripeConfig,
      compactOptions(config),
    );
  }
}
