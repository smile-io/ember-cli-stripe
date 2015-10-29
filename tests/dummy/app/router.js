import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('simple-usage', { path: '/' });
  this.route('advanced-usage');
  this.route('multiple-keys-usage');
});

export default Router;
