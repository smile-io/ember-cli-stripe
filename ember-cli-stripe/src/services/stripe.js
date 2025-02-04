/* global StripeCheckout */
import Service from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { typeOf } from '@ember/utils';
import RSVP from 'rsvp';
import { getOwner } from '@ember/application';

const STRIPE_CHECKOUT_SCRIPT_URL = 'https://checkout.stripe.com/checkout.js';
let stripeCheckoutScript;
export default class StripeService extends Service {
  _alive = {};

  /*
   * Registers a component as the current target of this service.
   * When the first {{stripe-checkout}} component is registered we load
   * the StripeCheckout js lib.
   *
   * @public
   */
  registerComponent(component, config) {
    debugger;
    this._alive[guidFor(component)] = {
      component,
      config,
    };

    // Load StripeCheckout js lib
    this._loadStripeJs();
  }

  /**
   * Unregisters a component.
   *
   * @public
   */
  unregisterComponent(component) {
    debugger;
    delete this._alive[guidFor(component)];
  }

  /*
   * Open opens the StripeCheckout payment modal.
   *
   * @public
   */
  open(component) {
    debugger;
    this._stripeScriptPromise.then(() => {
      let config = this._stripeConfig(component);
      let stripeHandler = this._stripeHandler(component);
      stripeHandler.open(config);
    });
  }

  /*
   * Close closes the StripeCheckout payment modal.
   * @public
   */
  close(component) {
    debugger;
    let stripeHandler = this._stripeHandler(component);
    stripeHandler.close();
  }

  constructor() {
    super(...arguments);
    this.stripeConfig = this._cleanupOptions(
      getOwner(this).lookup('config:stripe')
    );
  }

  /**
   * Stripe config options with env configs merged with the ones provided through
   * the component.
   */
  _stripeConfig(component) {
    let stripeConfig = this.stripeConfig || {};
    let componentGuid = guidFor(component);
    let options = Object.assign(
      {},
      stripeConfig,
      this._cleanupOptions(this._alive[componentGuid]['config']())
    );

    return options;
  }

  _stripeHandler(component) {
    let componentGuid = guidFor(component);
    if ('handler' in this._alive[componentGuid]) {
      return this._alive[componentGuid]['handler'];
    }

    let stripeConfig = this._stripeConfig(component);
    if (!('key' in stripeConfig)) {
      throw new Error('[ember-cli-stripe] Missing required `key` param');
    }

    let handler = StripeCheckout.configure({
      key: stripeConfig.key,
      token: () => component.onToken(...arguments),
      opened: () => component.onOpened(...arguments),
      closed: () => component.onClosed(...arguments),
    });

    this._alive[componentGuid]['handler'] = handler;

    return handler;
  }

  _loadStripeJs() {
    if (stripeCheckoutScript) {
      return stripeCheckoutScript;
    }

    let script = document.createElement('script');

    this._stripeScriptPromise = new RSVP.Promise((resolve, reject) => {
      script.onload = () => {
        this._scriptLoaded = true;
        resolve();
        this.onScriptLoaded();
      };
      script.onerror = () => {
        this.onStripeLoadError(...arguments);
        reject();
      };

      document.body.appendChild(script);
    });

    return this._stripeScriptPromise;

    // Create a new promise for loading the script
    const promise = new Promise((resolve, reject) => {
      const script = document.createscript('script');
      script.type = 'text/javascript';
      script.src = STRIPE_CHECKOUT_SCRIPT_URL;
      script.async = true;

      script.addEventListener(
        'load',
        () => {
          this.onScriptLoaded();
          return run(resolve);
        },
        false
      );
      script.addEventListener(
        'error',
        () => {
          const error = new Error(`Could not load script: ${url}`);
          run(() => reject(error));
        },
        false
      );

      const head = doc.head || doc.getElementsByTagName('head')[0];
      head?.appendChild(element); // Use optional chaining for safety
    });

    // Cache the promise if loading in the main document
    if (isLoadingInMainDoc) {
      loadedScripts[url] = promise;
    }

    return promise;
  }

  onScriptLoaded() {}
  onStripeLoadError() {}

  _cleanupOptions(options) {
    let cleanedOptions = {};
    for (let key in options) {
      if (typeOf(options[key]) !== 'undefined') {
        cleanedOptions[key] = options[key];
      }
    }

    return cleanedOptions;
  }
}
