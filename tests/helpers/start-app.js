import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

export default function startApp(attrs) {
  var application;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  application.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"
  return application;
}
