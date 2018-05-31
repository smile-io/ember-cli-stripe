/* global StripeCheckout */
import Ember from 'ember';
import stripeConfigOptions from '../utils/configuration-options';
import { invokeAction } from 'ember-invoke-action';

const {
  Service,
  getWithDefault,
  copy,
  typeOf,
  RSVP,
  guidFor,
  isBlank,
  deprecate,
} = Ember;

export default Service.extend({

  /*
   * Registers a component as the current target of this service.
   * When the first {{stripe-checkout}} component is registered we load
   * the StripeCheckout js lib.
   *
   * @public
   */
  registerComponent(component) {
    this._alive[guidFor(component)] = {
      component,
    };

    // Load StripeCheckout js lib
    this._loadStripeJs();
  },

  /**
   * Unregisters a component.
   *
   * @public
   */
  unregisterComponent(component) {
    delete this._alive[guidFor(component)];
  },

  /*
   * Open opens the StripeCheckout payment modal.
   *
   * @public
   */
  open(component) {
    return this._stripeScriptPromise.then(() => {
      let config = this._stripeConfig(component);
      let stripeHandler = this._stripeHandler(component) || this._registerNewStripeHandler(component);
      stripeHandler.open(config);
    });
  },

  /*
   * Close closes the StripeCheckout payment modal.
   * @public
   */
  close(component) {
    let stripeHandler = this._stripeHandler(component);

    if (stripeHandler) {
      stripeHandler.close();
    }
  },

  init() {
    this._super(...arguments);

    this._alive = {};
    this._scriptLoaded = false;
    this._scriptLoading = false;
  },

  /**
   * Looks for any Stripe config options on the component.
   */
  _componentStripeConfig(component) {
    let componentOptions = component.getProperties(stripeConfigOptions);
    return this._cleanupOptions(componentOptions);
  },

  /**
   * Stripe config options with env configs merged with the ones provided through
   * the component.
   */
  _stripeConfig(component) {
    let stripeConfig = getWithDefault(this, 'stripeConfig', {});
    let options = copy(stripeConfig);
    // Support for Ember <= 2.4 (when assign was introduced)
    let assign = Ember.assign || Ember.merge;
    assign(options, this._componentStripeConfig(component));

    return this._cleanupOptions(options);
  },

  _stripeHandler(component) {
    let componentGuid = guidFor(component);
    if ('handler' in this._alive[componentGuid]) {
      return this._alive[componentGuid]['handler'];
    }
  },

  _registerNewStripeHandler(component) {
    let componentGuid = guidFor(component);

    let stripeConfig = this._stripeConfig(component);
    if (!('key' in stripeConfig)) {
      throw new Error('[ember-cli-stripe] Missing required `key` param');
    }

    let handler = StripeCheckout.configure({
      key: stripeConfig.key,
      token() {
        invokeAction(component, 'onToken', ...arguments);

        // Add deprecation for previous `action` callback
        if (!isBlank(component.attrs.action)) {
          deprecate('Using `action` callback is deprecated and will be removed in future versions. Please use `onToken` with a closure action instead',
            false,
            { id: 'ember-cli-stripe.action-callback', until: '1.1.0' }
          );

          invokeAction(component, 'action', ...arguments);
        }
      },
      opened() {
        invokeAction(component, 'onOpened');
      },
      closed() {
        invokeAction(component, 'onClosed');
      }
    });

    this._alive[componentGuid]['handler'] = handler;

    return handler;
  },

  _loadStripeJs() {
    if (this._scriptLoaded || this._scriptLoading) {
      return this._stripeScriptPromise;
    }

    this._scriptLoading = true;

    let script = document.createElement('script');
    script.src = 'https://checkout.stripe.com/checkout.js';
    script.async = true;
    script.type = 'text/javascript';

    this._stripeScriptPromise = new RSVP.Promise((resolve, reject) => {
      script.onload = () => {
        this._scriptLoaded = true;
        resolve();
        this.onScriptLoaded();
      };
      script.onerror = () => {
        this._invokeAction('onStripeLoadError', ...arguments);
        reject();
      };

      document.body.appendChild(script);
    });

    return this._stripeScriptPromise;
  },

  onScriptLoaded() {
  },

  onStripeLoadError() {
  },

  _cleanupOptions(options) {
    let cleanedOptions = {};
    for (let key in options) {
      if (typeOf(options[key]) !== 'undefined') {
        cleanedOptions[key] = options[key];
      }
    }

    return cleanedOptions;
  },
});
