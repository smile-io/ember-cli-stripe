// BEGIN-SNIPPET advanced-usage-actions
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdvancedUsageController extends Controller {
  @action
  handleToken(/*amount, token, args*/) {
    console.log(...arguments);
  }

  @action
  checkoutOpened() {}

  @action
  checkoutClosed() {}
}
// END-SNIPPET
