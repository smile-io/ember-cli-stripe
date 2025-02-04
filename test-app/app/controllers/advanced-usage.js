// BEGIN-SNIPPET advanced-usage-actions
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class AdvancedUsageController extends Controller {
  @action
  checkoutToken(/*amount, token, args*/) {}

  @action
  checkoutOpened() {}

  @action
  checkoutClosed() {}
}
// END-SNIPPET
