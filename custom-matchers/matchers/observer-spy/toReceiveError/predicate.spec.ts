import predicate from './predicate';
import { concat, EMPTY, of, throwError } from 'rxjs';

describe('toReceiveError', () => {
  // We aren't using a constants because if in some case the values changed (which it shouldn't)
  // we don't want it to effect other tests.
  const getObservableValue = (): any[][] => [
    // Start With Falsy
    [[0, 1, 2, 4, 5]],
    // Start with Truthy
    [[1, 2, 3, 4, 5]],

    // Start With Falsy
    [['', 'hello', 'this', 'is', 'so', 'cool']],
    // Start With Truthy
    [['hello', 'this', 'is', 'so', 'cool']],

    // Start with true
    [[true, false, true, false, true]],
    // Start with false
    [[false, true, true, false, false]],

    [[{}, { a: 'a' }, { b: 'b' }, { c: 'c' }]],
    [[{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }]],

    [[[], ['I'], ['am'], ['an'], ['Array']]],
    [[['I'], [], ['am'], ['an'], ['Array']]],
  ];

  describe('true', () => {
    describe('without error matching', () => {
      it('should return true if a given observable is only throwing error', async () => {
        // Arrange
        const obs = throwError(new Error('I dont care what the error is'));

        // Act
        const predicatePrResult = predicate(obs);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(true);
      });

      it('should return true if a given observable is throwing `undefined`', async () => {
        // Arrange
        const obs = throwError(undefined);

        // Act
        const predicatePrResult = predicate(obs);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(true);
      });

      it('should return true if the error that was thrown from the observable is the same type as Error', async () => {
        // Arrange
        const obs = throwError(new Error('I dont care what the error is'));

        // Act
        const predicatePrResult = predicate(obs, Error);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(true);
      });

      it('should return true if the error that was thrown from the observable is an inherent class from the passed error type', async () => {
        // Arrange
        class SubError extends Error {}

        const obs = throwError(new SubError('I dont care what the error is'));

        // Act
        const predicatePrResult = predicate(obs, Error);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(true);
      });

      it('should return true if a given observable is only throwing error that match the error type', async () => {
        // Arrange
        const obs = throwError(new Error('I dont care what the error is'));

        // Act
        const predicatePrResult = predicate(obs, Error);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(true);
      });

      describe('throw at the start', () => {
        it.each(getObservableValue())(
          'should return true when an observable throw and then emit these values - %j',
          async (observableValues) => {
            // Arrange
            const obs = concat(throwError(new Error('Last error')), of(...observableValues));

            // Act
            const predicatePrResult = predicate(obs);

            // Assert
            await expect(predicatePrResult).resolves.toEqual(true);
          },
        );
      });

      describe('throw in the middle', () => {
        it.each(getObservableValue())(
          'should return true when an observable throw in the middle of emitting - %j',
          async (observableValues) => {
            // Arrange
            const firstSection = observableValues.slice(0, 2);
            const secondSection = observableValues.slice(2);

            const obs = concat(of(...firstSection), throwError(new Error('Last error')), of(...secondSection));

            // Act
            const predicatePrResult = predicate(obs);

            // Assert
            await expect(predicatePrResult).resolves.toEqual(true);
          },
        );
      });

      describe('throw at the end', () => {
        it.each(getObservableValue())(
          'should return true when an observable emit these values - %j and then throw in the end',
          async (observableValues) => {
            // Arrange
            const obs = concat(of(...observableValues), throwError(new Error('Last error')));

            // Act
            const predicatePrResult = predicate(obs);

            // Assert
            await expect(predicatePrResult).resolves.toEqual(true);
          },
        );
      });
    });
  });

  describe('false', () => {
    it('should return false if a given observable is empty', async () => {
      // Arrange
      const obs = EMPTY;

      // Act
      const predicatePrResult = predicate(obs);

      // Assert
      await expect(predicatePrResult).resolves.toEqual(false);
    });

    it(`should return false when an observable throw with the wrong error type`, async () => {
      // Arrange
      class SomeClass {}

      const obs = throwError(new Error('I dont care what the error is'));

      // Act
      const predicatePrResult = predicate(obs, SomeClass);

      // Assert
      await expect(predicatePrResult).resolves.toEqual(false);
    });

    it.each(getObservableValue())(
      `should return false when an observable don't throw and only emit these values - %j`,
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act
        const predicatePrResult = predicate(obs);

        // Assert
        await expect(predicatePrResult).resolves.toEqual(false);
      },
    );
  });
});
