// BEGIN-SNIPPET simple-usage-actions
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class SimpleUsageController extends Controller {
  @tracked showCheckout = true;
  amount = 1000;

  handleClick = () => {
    this.showCheckout = !this.showCheckout;
  };

  handleToken = (token) => {
    console.log('StripeCheckout TOKEN', token);
  };

  handleOpened = () => {
    console.log('StripeCheckout opened');
  };

  handleClosed = () => {
    console.log('StripeCheckout closed');
    this.showCheckout = false;
  };
}
// END-SNIPPET
