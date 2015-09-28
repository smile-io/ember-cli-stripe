import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('stripe-checkout', 'Integration | Component | stripe checkout', {
  integration: true
});

test('show the default labewl', function(assert) {
  assert.expect(1);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{stripe-checkout}}`);

  assert.equal(this.$().text().trim(), 'Pay with card');

});

test('it yields the block', function(assert) {
  assert.expect(1);
  // Template block usage:
  this.render(hbs`
    {{#stripe-checkout}}
      A Label!
    {{/stripe-checkout}}
  `);

  assert.equal(this.$().text().trim(), 'A Label!');
});
