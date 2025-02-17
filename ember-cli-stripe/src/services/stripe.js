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
  get config() {
    return (
      compactOptions(
        getOwner(this).resolveRegistration('config:environment').stripe,
      ) || {}
    );
  }

  async open(config = {}, onScriptLoad, onScriptError) {
    await this.loadStripeCheckout(onScriptLoad, onScriptError);

    const fullConfig = this.#fullConfig(config);
    if (!('key' in fullConfig)) {
      throw new Error('[ember-cli-stripe] Missing required `key` param!');
    }

    StripeCheckout.open(fullConfig);
  }

  loadStripeCheckout(onScriptLoad, onScriptError) {
    if (stripeCheckoutScript) {
      return stripeCheckoutScript;
    }

    stripeCheckoutScript = loadScript(STRIPE_CHECKOUT_SCRIPT_URL, {
      onLoad: onScriptLoad,
      onError: onScriptError,
    });
    return stripeCheckoutScript;
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
      this.config,
      compactOptions(config),
    );
  }
}
