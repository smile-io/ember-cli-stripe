import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// Stub Stripe service
class StripeStub extends Service {
  registerComponent() {}
  unregisterComponent() {}
  open() {}
  close() {}
}

module('Integration | Component | stripe checkout', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:stripe', StripeStub);
    this.stripe = this.owner.lookup('service:stripe');
  });

  test('it renders', async function (assert) {
    assert.expect(3);

    await render(hbs`<StripeCheckout />`);

    assert.dom('*').hasText('Pay with card', 'renders default button text');

    await render(hbs`<StripeCheckout @label='Pay now' />`);

    assert.dom('*').hasText('Pay now', 'renders passed button label text');

    await render(hbs`
      <StripeCheckout>
        Pay dude!
      </StripeCheckout>
    `);

    assert.dom('*').hasText('Pay dude!', 'renders using block-form');
  });

  test('it opens Stripe Checkout when button is clicked', async function (assert) {
    assert.expect(1);

    this.stripe.set('open', () => {
      assert.ok('calls Stripe service with _self as param');
    });

    await render(hbs`<StripeCheckout />`);
    await click('button');
  });

  test('it opens Stripe Checkout when `showCheckout` is true', async function (assert) {
    assert.expect(1);

    this.stripe.set('open', () => {
      assert.ok('calls Stripe service with _self as param');
    });

    this.set('showCheckout', false);
    await render(hbs`<StripeCheckout  @showCheckout={{this.showCheckout}} />`);

    this.set('showCheckout', true);
  });
});
