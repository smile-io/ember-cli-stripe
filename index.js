'use strict';

module.exports = {
  name: 'ember-cli-stripe',

  contentFor: function(type) {
    if (type === 'body') {
      return '<script src="https://checkout.stripe.com/checkout.js"></script>';
    }
  },

  /* Necessary Hack until Ember CLI supports nested addons. */
  included: function(app) {
    this.addons.forEach(function(addon){
      if (addon.name === "ember-version-is") {
        addon.included.apply(addon, [app]);
      }
    });
  }
};
