import config from '../config/environment';
import Stripe from 'ember-cli-stripe/services/stripe';

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { stripe } = config || {};

  application.register('service:stripe', Stripe);
  application.register('config:stripe', stripe, { instantiate: false });
  application.inject('service:stripe', 'stripeConfig', 'config:stripe');
}

export default {
  name: 'stripe',
  initialize
};
