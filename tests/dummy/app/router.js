import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('simple-usage', { path: '/' });
  this.route('advanced-usage');
  this.route('multiple-keys-usage');
});

export default Router;
