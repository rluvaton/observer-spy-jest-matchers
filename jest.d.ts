/// <reference types="jest" />

import '@hirez_io/observer-spy';

declare global {
  namespace jest {
    // noinspection JSUnusedGlobalSymbols
    interface Matchers<R> {
      /**
       * Use .toFirstEmit when checking if an observable first emit is a given value
       * @param value
       */
      toFirstEmit(value: any): R;

      /**
       * Use .toReceiveError when checking if an observable received an error
       * @param error Error to test
       * @see Same as {@link jest.Matchers#toThrow}
       */
      toReceiveError(error?: string | Constructable | RegExp | Error): Promise<R>;

      /**
       * Use .toEmitSameValues when checking if an observable emit values in the same order as the parameter
       * @param values
       */
      toEmitSameValues(values: any[]): R;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Expect {
      /**
       * Use .toBeOneOf when checking if a value is a member of a given Array.
       * @param value
       */
      toFirstEmit(value: any): any;

      /**
       * Use .toReceiveError when checking if an observable received an error
       * @param error Error to test
       * @see Same as {@link jest.Matchers#toThrow}
       */
      toReceiveError(error?: string | Constructable | RegExp | Error): any;

      /**
       * Use .toEmitSameValues when checking if an observable emit values in the same order as the parameter
       * @param values
       */
      toEmitSameValues(values: any[]): any;
    }
  }
}
