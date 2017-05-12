# Stripe checkout for Ember [![Build Status](https://travis-ci.org/sweettooth/ember-cli-stripe.svg?branch=master)](http://travis-ci.org/sweettooth/ember-cli-stripe)

![Preview](https://www.sweettoothrewards.com/wp-content/uploads/stripe-checkout.png)

## Description

Simplest way to implement card payments in your Ember app.

This addon integrates Stripe's embedded payment form, Checkout.
See [Stripe Checkout](https://stripe.com/docs/checkout#integration-custom) docs.

The best documentation is the sample application in `tests/dummy`.

## Installation

```sh
ember install ember-cli-stripe 
```

## Usage

```handlebars
{{stripe-checkout
  image="/square-image.png"
  name="Demo Site"
  description="2 widgets ($20.00)"
  amount=2000
  onToken=(action "processStripeToken")
}}
```

## Component properties

Property              | Purpose
--------------------- | -------------
`label`               | Stripe Checkout button text.
`isDisabled`          | When true, the Stripe Checkout button is disabled.
`showCheckout`        | Can be used to open the Stripe Checkout modal dynamically.

Besides the above, all [Stripe Checkout configuration options](https://stripe.com/docs/checkout#integration-custom) 
are supported. If you notice anything missing please open an issue.

### Actions

The primary action of this component, `onToken` is called when the Stripe checkout succeeds. Its main param is a [Stripe Token](https://stripe.com/docs/api#tokens) object.

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    /**
     * Receives a Stripe token after checkout succeeds
     * The token looks like this https://stripe.com/docs/api#tokens
     */
    processStripeToken(token, args) {
      // Send token to the server to associate with account/user/etc
    }
  }
});
```

List of all actions:

Action                | Purpose
--------------------- | -------------
`onToken`             | The callback invoked when the Checkout process is complete.
`onOpened`            | The callback invoked when Checkout is opened.
`onClosed`            | The callback invoked when Checkout is closed.


## Configuration
All Stripe Checkout configuration options can be set in your apps config.

In most cases, you will want to add at least your Stripe **publishable key** to your app's config, but this can be set as a property on the component too. 

```javascript
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    stripe: {
        key: 'pk_test_C0sa3IlkLWBlrB8laH2fbqfh',
        ....
    },
  };

  return ENV;
};
```

**Note:** If Stripe options are set in the *environment.js* file **and** when invoking the component, the later value will win.

Multiple Stripe keys are supported, when passed directly to the component.


## Compatibility

This addon is tested against Ember 1.13+.

For older versions of Ember, use version `0.4.0` and check the [old docs](https://github.com/sweettooth/ember-cli-stripe/blob/v0.4.0/README.md).

**Note:** At your own risk, feel free to try current version, it might still work.


## Contributing

PRs welcome!

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`


For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
