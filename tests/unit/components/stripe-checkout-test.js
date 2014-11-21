import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('stripe-checkout', 'StripeCheckoutComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('it renders default text', function() {
  expect(1);
  
  var component = this.subject();
  this.append();

  equal($.trim($('.stripe-checkout').text()), "Pay with card");
});
