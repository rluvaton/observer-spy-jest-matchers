import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable } from 'rxjs';
import { waitToFinish } from '../../../../../../src/common/rxjs-utils';

// We want to use function just like in jest-extended that they did it to match the error type
// eslint-disable-next-line @typescript-eslint/ban-types
export default async <T>(received: Observable<T>, errorType?: Function): Promise<boolean> => {
  const subscriberSpy = subscribeSpyTo(received, { expectErrors: true });
  await waitToFinish(received);

  const isGotError = subscriberSpy.receivedError() === true;
  if (!isGotError) {
    return false;
  }

  return errorType === undefined || subscriberSpy.getError() instanceof errorType;
};
