import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// Stub Stripe service
const stripeStub = Service.extend({
  registerComponent() {},
  unregisterComponent() {},
  open() {},
  close() {},
});

module('Integration | Component | stripe checkout', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:stripe', stripeStub);
    this.stripe = this.owner.lookup('service:stripe');
  });

  test('it renders', async function(assert) {
    assert.expect(3);

    await render(hbs`{{stripe-checkout}}`);

    assert.dom('*').hasText('Pay with card', 'renders default button text');

    await render(hbs`{{stripe-checkout label='Pay now'}}`);

    assert.dom('*').hasText('Pay now', 'renders passed button label text');

    await render(hbs`
      {{#stripe-checkout}}
        Pay dude!
      {{/stripe-checkout}}
    `);

    assert.dom('*').hasText('Pay dude!', 'renders using block-form');
  });

  test('it opens Stripe Checkout when button is clicked', async function(assert) {
    assert.expect(1);

    this.get('stripe').set('open', () => {
      assert.ok('calls Stripe service with _self as param');
    });

    await render(hbs`{{stripe-checkout}}`);
    await click('button');
  });

  test('it opens Stripe Checkout when `showCheckout` is true', async function(assert) {
    assert.expect(1);

    this.get('stripe').set('open', () => {
      assert.ok('calls Stripe service with _self as param');
    });

    this.set('showCheckout', false);
    await render(hbs`{{stripe-checkout showCheckout=showCheckout}}`);

    this.set('showCheckout', true);
  });
});
