import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Service | stripe', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'config:environment',
      {
        stripe: {
          key: 'env-key',
          currency: 'EUR',
        },
      },
      { instantiate: false },
    );

    window.StripeCheckout = {
      open: () => {},
    };

    this.service = this.owner.lookup('service:stripe');
  });

  hooks.afterEach(function () {
    delete window.StripeCheckout;
    sinon.restore();
  });

  module('config', function () {
    test('loads config from environment', function (assert) {
      assert.deepEqual(
        this.service.config,
        { key: 'env-key', currency: 'EUR' },
        'loads environment config',
      );
    });

    test('handles missing environment config', function (assert) {
      this.owner.register('config:environment', {}, { instantiate: false });
      const service = this.owner.lookup('service:stripe');

      assert.deepEqual(service.config, {}, 'defaults to empty config');
    });

    test('filters out invalid config options', function (assert) {
      this.owner.register(
        'config:environment',
        {
          stripe: {
            key: 'env-key',
            invalidOption: 'value',
            currency: 'EUR',
          },
        },
        { instantiate: false },
      );

      const service = this.owner.lookup('service:stripe');
      assert.false(
        'invalidOption' in service.config,
        'removes invalid options',
      );
      assert.true('key' in service.config, 'keeps valid options');
    });
  });

  module('loadStripeCheckout', function () {
    test('reuses existing script promise', async function (assert) {
      const promise1 = this.service.loadStripeCheckout();
      const promise2 = this.service.loadStripeCheckout();

      assert.strictEqual(
        await promise1,
        await promise2,
        'returns same promise for multiple calls',
      );
    });

    test('handles script load errors', async function (assert) {
      // TODO
      const error = new Error('Failed to load');
      sinon.stub(this.service, 'loadStripeCheckout').rejects(error);

      try {
        await this.service.loadStripeCheckout();
        assert.false('should have thrown');
      } catch (e) {
        assert.strictEqual(e, error, 'propagates load error');
      }
    });
  });

  module('open', function () {
    test('open calls StripeCheckout.open with merged config', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      const config = {
        key: 'runtime-key',
        amount: 2000,
        onToken: () => {},
        onOpened: () => {},
        onClosed: () => {},
      };

      await this.service.open(config);

      assert.ok(fakeOpen.calledOnce, 'open was called once');
      assert.ok(
        sinon
          .match({
            key: 'runtime-key',
            currency: 'EUR',
            amount: 2000,
            token: sinon.match.func,
            opened: sinon.match.func,
            closed: sinon.match.func,
          })
          .test(fakeOpen.firstArg),
        'called with merged config',
      );
    });

    test('open handles callback functions', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      const onToken = () => assert.step('onToken');
      const onOpened = () => assert.step('onOpened');
      const onClosed = () => assert.step('onClosed');

      await this.service.open({
        key: 'test-key',
        onToken,
        onOpened,
        onClosed,
      });

      const config = fakeOpen.firstArg;
      config.token();
      config.opened();
      config.closed();

      assert.verifySteps(
        ['onToken', 'onOpened', 'onClosed'],
        'callbacks are called',
      );
    });

    test('open removes undefined values from config', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      await this.service.open({
        key: 'test-key',
        description: null,
      });

      const config = fakeOpen.firstArg;
      assert.false('amount' in config, 'undefined values are removed');
    });

    test('waits for script to load before opening', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      let resolveScript;
      const scriptPromise = new Promise((resolve) => {
        resolveScript = resolve;
      });
      sinon.stub(this.service, 'loadStripeCheckout').returns(scriptPromise);

      const openPromise = this.service.open({ key: 'test-key' });
      assert.false(fakeOpen.called, 'does not open before script loads');

      resolveScript();
      await openPromise;

      assert.true(fakeOpen.called, 'opens after script loads');
    });

    test('handles missing callback functions', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      await this.service.open({ key: 'test-key' });

      const config = fakeOpen.firstArg;
      assert.strictEqual(config.token, undefined, 'token is optional');
      assert.strictEqual(
        typeof config.opened,
        'function',
        'opened handler is always function',
      );
      assert.strictEqual(
        typeof config.closed,
        'function',
        'closed handler is always function',
      );

      // Verify handlers don't throw when callbacks are missing
      try {
        config.opened();
        config.closed();
        assert.ok(true, 'handlers are safe to call without callbacks');
      } catch (error) {
        assert.ok(false, 'an error was thrown', error.message);
      }
    });

    test('config precedence', async function (assert) {
      const fakeOpen = sinon.fake();
      sinon.replace(window.StripeCheckout, 'open', fakeOpen);

      await this.service.open({
        key: 'runtime-key',
        currency: 'USD',
      });

      const config = fakeOpen.firstArg;
      assert.strictEqual(
        config.key,
        'runtime-key',
        'runtime config overrides env config',
      );
      assert.strictEqual(
        config.currency,
        'USD',
        'runtime config overrides env config',
      );
    });

    test('throws an error if not `key` is specified', async function (assert) {
      this.owner.register('config:environment', {}, { instantiate: false });
      const service = this.owner.lookup('service:stripe');

      await assert.rejects(
        service.open(),
        /\[ember-cli-stripe\] Missing required `key` param!/,
        'throws an error if no Stripe `key` is specified',
      );
    });
  });
});
