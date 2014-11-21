# Stripe checkout for Ember

![Preview](https://www.sweettoothrewards.com/wp-content/uploads/stripe-checkout.png)

## Description
This component is an ember-cli addon which adds Stripe checkout functionality to your app. See https://stripe.com/docs/checkout

## Installation
```sh
npm install ember-cli-stripe --save-dev
```

## Setup
Add your Stripe **publishable key** to your app's config

```javascript
// config/environment.js
ENV.stripe = {
  key: "pk_test_C0sa3IlkLWBlrB8laH2fbqfh"
}
```

## Usage

### Basic Usage
```handlebars
{{stripe-checkout
  image="/square-image.png"
  name="Demo Site"
  description="2 widgets ($20.00)"
  amount=2000
  action="processStripeToken"
}}
```

### Heavier Usage
```handlebars
{{stripe-checkout
  class="btn btn-primary"
  image="/images/logo.png"
  name="Sweet Tooth"
  description=selectedPlan.name
  amount=selectedPlan.price_cents
  label="Subscribe now" 
  panelLabel="Subscribe for {{amount}}/mo"
  isDisabled=payButtonDisabled
  action="processStripeToken"
}}
```

## Actions

The primary `action` of this component is called when the Stripe checkout succeeds. Its only param is a [Stripe Token](https://stripe.com/docs/api#tokens) object.

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    /**
     * Receives a Stripe token after checkout succeeds
     * The token looks like this https://stripe.com/docs/api#tokens
     */
    processStripeToken: function(token) {
      // Send token to the server to associate with account/user/etc
    }
  }
});
```

## Options
All options from https://stripe.com/docs/checkout are supported

## Contributing
PRs welcome!

## TODO
* Add tests
* Implement opened/closed callbacks as actions
* Support default stripe styles
* Fail loudly if no stripe key given
