import isEqual from 'lodash.isequal';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable } from 'rxjs';

/**
 * toFirstEmit
 * @param received The Observable to test
 * @param expectedFirstValue the expected first value
 * @return An array with the 1st item to be the result and the 2nd to be the real first value
 */
export default <T>(received: Observable<T>, expectedFirstValue: T): [boolean, T] => {
  const subscriberSpy = subscribeSpyTo(received, { expectErrors: true });

  const firstValue = subscriberSpy.getFirstValue();

  // TODO - this won't work for error objects
  return [isEqual(firstValue, expectedFirstValue), firstValue];
};
