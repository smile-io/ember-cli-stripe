import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

class StripeStub extends Service {
  openCalls = [];

  async open(config) {
    this.openCalls.push(config);
  }
}

module('Integration | Component | stripe-checkout', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:stripe', StripeStub);
    this.stripe = this.owner.lookup('service:stripe');
  });

  test('renders with default label', async function (assert) {
    await render(hbs`<StripeCheckout />`);
    assert.dom('button').hasText('Pay with card');
  });

  test('renders with custom label', async function (assert) {
    await render(hbs`<StripeCheckout @label="Custom Payment" />`);
    assert.dom('button').hasText('Custom Payment');
  });

  test('renders block content', async function (assert) {
    await render(hbs`
      <StripeCheckout>
        <img src="card.png" alt="card">
        Pay Now
      </StripeCheckout>
    `);
    assert.dom('button').hasText('Pay Now');
    assert.dom('img').exists();
  });

  test('handles disabled state', async function (assert) {
    await render(hbs`<StripeCheckout @isDisabled={{true}} />`);
    assert.dom('button').hasAttribute('disabled');
  });

  test('opens checkout on button click', async function (assert) {
    this.config = {
      key: 'test-key',
      amount: 2000,
      description: 'Test Purchase',
    };

    await render(hbs`
      <StripeCheckout
        @key={{this.config.key}}
        @amount={{this.config.amount}}
        @description={{this.config.description}}
      />`);

    await click('button');

    assert.strictEqual(
      this.stripe.openCalls.length,
      1,
      'stripe.open was called once',
    );
    assert.deepEqual(
      this.stripe.openCalls[0],
      {
        ...this.config,
        onToken: undefined,
        onOpened: undefined,
        onClosed: undefined,
      },
      'called with correct config',
    );
  });

  test('auto-opens checkout when showCheckout is true', async function (assert) {
    await render(hbs`<StripeCheckout @showCheckout={{true}} />`);

    assert.strictEqual(this.stripe.openCalls.length, 1, 'auto-opens checkout');
  });

  test('forwards callbacks to stripe service', async function (assert) {
    this.setProperties({
      onToken: () => assert.step('token'),
      onOpened: () => assert.step('opened'),
      onClosed: () => assert.step('closed'),
    });

    await render(hbs`
      <StripeCheckout
        @onToken={{this.onToken}}
        @onOpened={{this.onOpened}}
        @onClosed={{this.onClosed}}
      />`);

    await click('button');

    const config = this.stripe.openCalls[0];
    config.onToken();
    config.onOpened();
    config.onClosed();

    assert.verifySteps(
      ['token', 'opened', 'closed'],
      'callbacks are forwarded correctly',
    );
  });

  test('forwards all valid stripe configuration options', async function (assert) {
    this.config = {
      key: 'test-key',
      amount: 2000,
      currency: 'EUR',
      name: 'Test Store',
      description: 'Test Purchase',
      image: 'https://test.com/image.png',
      locale: 'auto',
      zipCode: true,
      billingAddress: true,
      shippingAddress: true,
      email: 'test@example.com',
      allowRememberMe: true,
      bitcoin: false,
      alipay: false,
      alipayReusable: false,
    };

    await render(hbs`
      <StripeCheckout
        @key={{this.config.key}}
        @amount={{this.config.amount}}
        @currency={{this.config.currency}}
        @name={{this.config.name}}
        @description={{this.config.description}}
        @image={{this.config.image}}
        @locale={{this.config.locale}}
        @zipCode={{this.config.zipCode}}
        @billingAddress={{this.config.billingAddress}}
        @shippingAddress={{this.config.shippingAddress}}
        @email={{this.config.email}}
        @allowRememberMe={{this.config.allowRememberMe}}
        @bitcoin={{this.config.bitcoin}}
        @alipay={{this.config.alipay}}
        @alipayReusable={{this.config.alipayReusable}}
      />`);

    await click('button');

    assert.deepEqual(
      this.stripe.openCalls[0],
      {
        ...this.config,
        onToken: undefined,
        onOpened: undefined,
        onClosed: undefined,
      },
      'forwards all valid config options',
    );
  });
});
