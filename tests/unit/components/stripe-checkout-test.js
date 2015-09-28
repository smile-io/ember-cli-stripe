import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('stripe-checkout', 'StripeCheckoutComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  assert.equal(component._state, 'inDOM');
});

test('it renders with the default text', function(assert) {
  assert.expect(1);

  this.subject();
  this.append();

  assert.equal(this.$().text().trim(), "Pay with card");
});

/**
 * These tests are stubbed out until I'm able to learn how to test Ember
 * addons properly - documentation is sparse right now and I'm quite new
 * to qunit.
 * At the very least, these test stubs should help describe expected behaviour
 */
test('it sends the opened action when the Stripe modal opens', function(assert) {
  assert.expect(0);
  // TODO
});

test('it sends the closed action when the Stripe modal closes', function(assert) {
  assert.expect(0);
  // TODO
});

test('it sends the primary action when a Stripe checkout completes', function(assert) {
  assert.expect(0);
  // TODO
});

test('it displays the configured values in the Stripe modal', function(assert) {
  assert.expect(0);
  // TODO: Use all component configurations and validate they display in the Stripe modal
});

test('it throws an exception if ENV.stripe.key is not defined in the app config', function(assert) {
  assert.expect(0);
  // TODO
});
