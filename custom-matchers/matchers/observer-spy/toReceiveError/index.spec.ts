import matcher from './index';
import { concat, EMPTY, of, throwError } from 'rxjs';

expect.extend(matcher);

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

describe('.toReceiveError', () => {
  describe('pass', () => {
    it('should passes when observable is only throwing error', async () => {
      // Arrange
      const obs = throwError(new Error('I dont care what the error is'));

      // Act & Assert
      await expect(obs).toReceiveError();
    });

    it('should passes when passing an error type that is the same as the error that throwen in the observable', async () => {
      // Arrange
      const obs = throwError(new Error('I dont care what the error is'));

      // Act & Assert
      await expect(obs).toReceiveError(Error);
    });

    describe('throw at the start', () => {
      it.each(getObservableValue())(
        'should passes when observable throw and then emit these values - %j',
        async (observableValues) => {
          // Arrange
          const obs = concat(throwError(new Error('Last error')), of(...observableValues));

          // Act & Assert
          await expect(obs).toReceiveError();
        },
      );
    });

    describe('throw in the middle', () => {
      it.each(getObservableValue())(
        'should passes when observable throw in the middle of emitting - %j',
        async (observableValues) => {
          // Arrange
          const firstSection = observableValues.slice(0, 2);
          const secondSection = observableValues.slice(2);

          const obs = concat(of(...firstSection), throwError(new Error('Last error')), of(...secondSection));

          // Act & Assert
          await expect(obs).toReceiveError();
        },
      );
    });

    describe('throw at the end', () => {
      it.each(getObservableValue())(
        'should passes when observable emit these values - %j and then throw in the end',
        async (observableValues) => {
          // Arrange
          const obs = concat(of(...observableValues), throwError(new Error('Last error')));

          // Act & Assert
          await expect(obs).toReceiveError();
        },
      );
    });
  });

  describe('fail', () => {
    it('should fail if a given observable is empty', async () => {
      // Arrange
      const obs = EMPTY;

      // Act & Assert
      await expect(() => expect(obs).toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should fail when passing an error type that is not the same as the error that throwen in the observable', async () => {
      // Arrange
      class SubClass extends Error {}

      const obs = throwError(new Error('I dont care what the error is'));

      // Act & Assert
      await expect(() => expect(obs).toReceiveError(SubClass)).rejects.toThrowErrorMatchingSnapshot();
    });

    it.each(getObservableValue())(
      `should fail when an observable don't throw and only emit these values - %j`,
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        await expect(() => expect(obs).toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
      },
    );
  });
});

describe('.not.toReceiveError', () => {
  describe('fail', () => {
    it('should fail when observable is only throwing error', async () => {
      // Arrange
      const obs = throwError(new Error('I dont care what the error is'));

      // Act & Assert
      await expect(() => expect(obs).not.toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
    });

    describe('throw at the start', () => {
      it.each(getObservableValue())(
        'should fail when observable throw and then emit these values - %j',
        async (observableValues) => {
          // Arrange
          const obs = concat(throwError(new Error('Last error')), of(...observableValues));

          // Act & Assert
          await expect(() => expect(obs).not.toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
        },
      );
    });

    describe('throw in the middle', () => {
      it.each(getObservableValue())(
        'should fail when observable throw in the middle of emitting - %j',
        async (observableValues) => {
          // Arrange
          const firstSection = observableValues.slice(0, 2);
          const secondSection = observableValues.slice(2);

          const obs = concat(of(...firstSection), throwError(new Error('Last error')), of(...secondSection));

          // Act & Assert
          await expect(() => expect(obs).not.toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
        },
      );
    });

    describe('throw at the end', () => {
      it.each(getObservableValue())(
        'should fail when observable emit these values - %j and then throw in the end',
        async (observableValues) => {
          // Arrange
          const obs = concat(of(...observableValues), throwError(new Error('Last error')));

          // Act & Assert
          await expect(() => expect(obs).not.toReceiveError()).rejects.toThrowErrorMatchingSnapshot();
        },
      );
    });
  });

  describe('pass', () => {
    it('should pass if a given observable is empty', async () => {
      // Arrange
      const obs = EMPTY;

      // Act & Assert
      await expect(obs).not.toReceiveError();
    });

    it.each(getObservableValue())(
      `should pass when an observable don't throw and only emit these values - %j`,
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        await expect(obs).not.toReceiveError();
      },
    );
  });
});
