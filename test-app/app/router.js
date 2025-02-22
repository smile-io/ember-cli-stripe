import EmberRouter from '@ember/routing/router';
import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('simple-usage', { path: '/' });
  this.route('advanced-usage');
  this.route('multiple-keys-usage');
});
