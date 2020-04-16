// BEGIN-SNIPPET simple-usage-actions
import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class SimpleUsageController extends Controller {
  @action
  checkoutToken(/*token, args*/) {}
}
// END-SNIPPET
