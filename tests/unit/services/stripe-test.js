import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { guidFor } from '@ember/object/internals';
import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import test from 'ember-sinon-qunit/test-support/test';
import config from '../../../config/environment';
import StripeService from 'ember-cli-stripe/services/stripe';
import sinon from 'sinon';

const stripeComponent = EmberObject.create({
  name: 'Best product',
});

let service;

module('Unit | Service | stripe', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const { stripe } = config;

    service = StripeService.create({
      stripeConfig: stripe,
      _scriptLoading: true,
    });
  });

  hooks.afterEach(function() {
    run(() => service.destroy());
    service = null;
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
      open() {}
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

    service.open(stripeComponent);

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

  test('close() closes Stripe Checkout', function(assert) {
    window.StripeCheckout = {
      configure() {},
      open() {}
    };
    const closeCheckoutSpy = this.spy();
    const configureCheckoutStub = this.stub(window.StripeCheckout, 'configure');
    configureCheckoutStub.returns({
      close: closeCheckoutSpy
    });

    const componentGuid = guidFor(stripeComponent);
    service._alive[componentGuid] = {
      component: stripeComponent,
    };


    service.close(stripeComponent);

    assert.ok(closeCheckoutSpy.calledOnce, 'closes Stripe checkout when it is opened');
  });
});
