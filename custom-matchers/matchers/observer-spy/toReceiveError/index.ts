import { matcherHint } from 'jest-matcher-utils';

import predicate from './predicate';
import { Observable } from 'rxjs';

const passMessage = () => () => `${matcherHint('.not.toReceiveError')}\n\nExpected observable to not receive an error`;

const failMessage = () => () => `${matcherHint('.toReceiveError')}\n\nExpected observable to receive an error`;

export default {
  // We want to use function just like in jest-extended that they did it to match the error type
  // eslint-disable-next-line @typescript-eslint/ban-types
  toReceiveError: async <T>(received: Observable<T>, errorType: Function) => {
    const pass = await predicate(received, errorType);

    if (pass) {
      return { pass: true, message: passMessage() };
    }

    return { pass: false, message: failMessage() };
  },
};
