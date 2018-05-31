import Ember from 'ember';
import { moduleFor } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import config from '../../../config/environment';
import StripeService from 'ember-cli-stripe/services/stripe';
import sinon from 'sinon';

const {
  guidFor
} = Ember;

const stripeComponent = Ember.Object.create({
  name: 'Best product',
});

let service;

moduleFor('service:stripe', 'Unit | Service | stripe', {
  unit: true,

  beforeEach() {
    const { stripe } = config;

    service = StripeService.create({
      stripeConfig: stripe,
      _scriptLoading: true,
      _stripeScriptPromise: new Ember.RSVP.Promise((resolve) => resolve()),
    });
  },

  afterEach() {
    Ember.run(() => service.destroy());
    service = null;
  }
});

test('registerComponent() registers the component', function(assert) {
  assert.deepEqual(
    service._alive,
    {},
    '_alive is empty'
  );

  service.registerComponent(stripeComponent);

  assert.deepEqual(
    service._alive[guidFor(stripeComponent)]['component'],
    stripeComponent,
    'component is saved in the _alive object'
  );
});

test('unregisterComponent() unregisters the component', function(assert) {
  const componentGuid = guidFor(stripeComponent);
  service._alive[componentGuid] = { component: stripeComponent };

  service.unregisterComponent(stripeComponent);

  assert.deepEqual(service._alive, {}, 'removes the component from _alive');
});

test('open() opens Stripe Checkout with correct config options', function(assert) {
  window.StripeCheckout = {
    configure() {},
    open() {},
    close() {},
  };
  const openCheckoutSpy = this.spy();
  const configureCheckoutStub = this.stub(window.StripeCheckout, 'configure');
  configureCheckoutStub.returns({
    open: openCheckoutSpy
  });

  const componentGuid = guidFor(stripeComponent);
  service._alive[componentGuid] = {
    component: stripeComponent,
  };

  service.open(stripeComponent).then(() => {
    let handlerOptions = {
      key: config.stripe.key,
      token: sinon.match.func,
      opened: sinon.match.func,
      closed: sinon.match.func,
    };
    sinon.assert.calledWith(configureCheckoutStub, sinon.match.object);
    sinon.assert.calledWith(configureCheckoutStub, sinon.match(handlerOptions));

    const stripeOptions = {
      key: config.stripe.key,
      name: stripeComponent.get('name'),
    };
    assert.ok(openCheckoutSpy.calledWith(stripeOptions), 'opens Stripe checkout with correct config options');
  });
});

test('close() closes Stripe Checkout', function(assert) {
  window.StripeCheckout = {
    configure() {},
    open() {},
    close() {},
  };
  const closeCheckoutSpy = this.spy();
  const configureCheckoutStub = this.stub(window.StripeCheckout, 'configure');
  configureCheckoutStub.returns({
    close: closeCheckoutSpy
  });

  const componentGuid = guidFor(stripeComponent);
  service._alive[componentGuid] = {
    component: stripeComponent,
    handler: configureCheckoutStub(),
  };

  service.close(stripeComponent);

  assert.ok(closeCheckoutSpy.calledOnce, 'closes Stripe checkout when it is opened');
});

test('close() does nothing if StripeCheckout is not yet loaded', function(assert) {
  const componentGuid = guidFor(stripeComponent);
  service._alive[componentGuid] = {
    component: stripeComponent,
  };
  assert.equal(null, service.close(stripeComponent), 'does not attempt to access StripeCheckout when it is not defined');
});
