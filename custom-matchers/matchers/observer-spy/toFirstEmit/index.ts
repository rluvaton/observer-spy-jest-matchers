import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';

import predicate from './predicate';
import { Observable } from 'rxjs';

const passMessage = (actual, expected) => () =>
  `${matcherHint('.not.toFirstEmit')}\n\nExpected observable first emit not to be: ${printExpected(
    expected,
  )}\nReceived: ${printReceived(actual)}`;

const failMessage = (actual, expected) => () =>
  `${matcherHint('.toFirstEmit')}\n\nExpected observable first emit to be: ${printExpected(
    expected,
  )}\nReceived: ${printReceived(actual)}`;

export default {
  toFirstEmit: <T>(received: Observable<T>, expectedFirstItem: T) => {
    // Act
    const [pass, actualFirstValue] = predicate(received, expectedFirstItem);

    if (pass) {
      return { pass: true, message: passMessage(actualFirstValue, expectedFirstItem) };
    }

    return { pass: false, message: failMessage(actualFirstValue, expectedFirstItem) };
  },
};
