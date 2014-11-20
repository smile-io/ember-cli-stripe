# Stripe checkout for Ember

![Preview](https://www.sweettoothrewards.com/wp-content/uploads/stripe-checkout.png)

## Description
This component is an ember-cli addon which adds Stripe checkout functionality to your app. See https://stripe.com/docs/checkout

## Installation
```sh
npm install ember-cli-stripe --save-dev
```

## Setup
```javascript
// config/environment.js
ENV.stripe = {
  key: "sk_test_BQokikJOvBiI2HlWgH4olfQ2"
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

## Options
All options from https://stripe.com/docs/checkout are supported

## Contributing
PRs welcome!

## TODO
* Add tests
* Implement opened/closed callbacks as actions
* Support default stripe styles
* Fail loudly if no stripe key given
