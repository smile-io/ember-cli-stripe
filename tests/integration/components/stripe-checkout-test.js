import Service from '@ember/service';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

// Stub Stripe service
const stripeStub = Service.extend({
  registerComponent() {},
  unregisterComponent() {},
  open() {},
  close() {},
});

moduleForComponent('stripe-checkout', 'Integration | Component | stripe checkout', {
  integration: true,

  beforeEach: function() {
    this.register('service:stripe', stripeStub);
    this.inject.service('stripe');
  },
});

test('it renders', function(assert) {
  assert.expect(3);

  this.render(hbs`{{stripe-checkout}}`);

  assert.equal(this.$().text().trim(), 'Pay with card', 'renders default button text');

  this.render(hbs`{{stripe-checkout label='Pay now'}}`);

  assert.equal(this.$().text().trim(), 'Pay now', 'renders passed button label text');

  this.render(hbs`
    {{#stripe-checkout}}
      Pay dude!
    {{/stripe-checkout}}
  `);

  assert.equal(this.$().text().trim(), 'Pay dude!', 'renders using block-form');
});

test('it opens Stripe Checkout when button is clicked', function(assert) {
  assert.expect(1);

  this.get('stripe').set('open', () => {
    assert.ok('calls Stripe service with _self as param');
  });

  this.render(hbs`{{stripe-checkout}}`);
  this.$('button').click();
});

test('it opens Stripe Checkout when `showCheckout` is true', function(assert) {
  assert.expect(1);

  this.get('stripe').set('open', () => {
    assert.ok('calls Stripe service with _self as param');
  });

  this.set('showCheckout', false);
  this.render(hbs`{{stripe-checkout showCheckout=showCheckout}}`);

  this.set('showCheckout', true);
});
