/**
 * All the configuration options supported by Stripe Checkout.
 * Docs: https://stripe.com/docs/checkout#integration-custom
 * @type {Array}
 */
const configurationOptions = [
// Required
'key',
// Highly recommended

/**
 * A relative or absolute URL pointing to a square image of your brand or
 * product. The recommended minimum size is 128x128px. The supported image
 * types are: .gif, .jpeg, and .png.
 */
'image',
/**
 * The name of your company or website.
 */
'name',
/**
 * A description of the product or service being purchased.
 */
'description',
/**
 * The amount (in cents) that's shown to the user. Note that you will still
 * have to explicitly include the amount when you create a charge using
 * the API.
 */
'amount',
/**
 * Specify auto to display Checkout in the user's preferred language,
 * if available. English will be used by default.
 */
'locale',
/**
 * Specify whether Checkout should validate the billing postal code
 * (true or false). The default is false, but we highly recommend
 * setting to true.
 */
'zipCode',
/**
 * Specify whether Checkout should collect the user's billing address
 * (true or false). The default is false.
 */
'billingAddress',
// Optional

/**
 * The currency of the amount (3-letter ISO code). The default is USD.
 */
'currency',
/**
 * The label of the payment button in the Checkout form (e.g. Subscribe,
 * Pay {{amount}}, etc.). If you include {{amount}} in the label value,
 * it will be replaced by a localized version of data-amount. Otherwise,
 * a localized data-amount will be appended to the end of your label.
 * Checkout does not translate custom labels to the user's preferred
 * language.
 */
'panelLabel',
/**
 * Specify whether Checkout should collect the user's shipping address
 * (true or false). The default is false.
 */
'shippingAddress',
/**
 * If you already know the email address of your user, you can provide it
 * to Checkout to be prefilled.
 */
'email',
/**
 * Specify whether to include the option to "Remember Me" for future
 * purchases (true or false). The default is true.
 */
'allowRememberMe',
/**
 * Specify whether to accept Bitcoin (true or false). The default is false.
 */
'bitcoin',
/**
 * Specify whether to accept Alipay ("auto", true, or false). The
 * default is false.
 */
'alipay',
/**
 * Specify if you need reusable access to the customer's Alipay account
 * (true or false). The default is false.
 */
'alipayReusable'];
const compactOptions = options => {
  let cleanedOptions = {};
  for (let key in options) {
    if (configurationOptions.includes(key) && typeof options[key] !== 'undefined') {
      cleanedOptions[key] = options[key];
    }
  }
  return cleanedOptions;
};

export { compactOptions, configurationOptions };
//# sourceMappingURL=configuration-options.js.map
