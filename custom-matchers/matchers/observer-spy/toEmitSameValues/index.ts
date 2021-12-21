import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

import predicate from './predicate';
import { Observable } from 'rxjs';

const passMessage = (actual, expected) => () =>
  `${matcherHint('.not.toEmitSameValues')}\n\nExpected observable emitted values not to be: ${printExpected(
    expected,
  )}\nReceived: ${printReceived(actual)}`;

const failMessage = (actual, expected) => () =>
  `${matcherHint('.toEmitSameValues')}\n\nExpected observable emitted values to be: ${printExpected(
    expected,
  )}\nReceived: ${printReceived(actual)}`;

export default {
  toEmitSameValues: async <T>(received: Observable<T>, expectedValues: T[]) => {
    // Act
    const [pass, actualValues] = await predicate(received, expectedValues);

    if (pass) {
      return { pass: true, message: passMessage(actualValues, expectedValues) };
    }

    return { pass: false, message: failMessage(actualValues, expectedValues) };
  },
};
