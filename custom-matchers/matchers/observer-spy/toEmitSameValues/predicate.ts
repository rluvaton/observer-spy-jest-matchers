import isEqual from 'lodash.isequal';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable } from 'rxjs';
import { waitToFinish } from '../../../../../../src/common/rxjs-utils';

/**
 * toEmitSameValues
 * @param received The Observable to test
 * @param expectedValues the expected values to match
 * @return An array with the 1st item to be the result and the 2nd to be the real first value
 */
export default async <T>(received: Observable<T>, expectedValues: T[]): Promise<[boolean, T[]]> => {
  const subscriberSpy = subscribeSpyTo(received, { expectErrors: true });

  await waitToFinish(received);
  const values = subscriberSpy.getValues();

  // TODO - this won't work for error objects
  return [isEqual(values, expectedValues), values];
};
