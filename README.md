# Stripe checkout for Ember [![Build Status](https://travis-ci.org/sweettooth/ember-cli-stripe.svg?branch=master)](http://travis-ci.org/sweettooth/ember-cli-stripe)


![Preview](https://www.sweettoothrewards.com/wp-content/uploads/stripe-checkout.png)

## Description
This Ember CLI addon provides a component for adding Stripe checkout functionality to your app. See https://stripe.com/docs/checkout

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
};
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

## Notes for ember-cli pre v0.1.2
If you're ember-cli version is pre v0.1.2 add the following script tag to your `index.html`. This script tag is added automatically by the addon for later ember-cli versions.
```html
<script src="https://checkout.stripe.com/checkout.js"></script>
```

## Contributing
PRs welcome!
