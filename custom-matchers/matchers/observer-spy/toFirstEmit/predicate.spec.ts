import predicate from './predicate';
import { of } from 'rxjs';
import { deepClone } from '../../../../../../src/common/utils';

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
  [[{ buffer: Buffer.of(1, 2, 3) }, {}, { b: 'b' }, { c: 'c' }]],
];

describe('.toFirstEmit Predicate', () => {
  describe('[true, <first-item>]', () => {
    it.each(getObservableValue().map((obsValues) => [obsValues[0][0], ...obsValues]))(
      'should return [true, %s] when given an observable (with values %p) and his first emit',
      (firstValue, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act
        const predicateResult = predicate(obs, deepClone(firstValue));

        // Assert
        expect(predicateResult).toEqual([true, deepClone(firstValue)]);
      },
    );
  });

  describe('[false, <first-item>]', () => {
    it.each([
      // Start With Falsy
      [0, [0, 1, 2]],
      // Start with Truthy
      [1, [1, 2, 3]],

      // Start With Falsy
      ['', ['', 'hello', 'so', 'cool']],
      // Start With Truthy
      ['hello', ['hello', 'so', 'cool']],

      // Start with false
      [false, [false, true, true]],
      // Start with true
      [true, [true, false, true]],

      [{}, [{}, { a: 'a' }, { b: 'b' }, { c: 'c' }]],
      [{ a: 'a' }, [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }]],

      [[], [[], ['I'], ['am'], ['an'], ['Array']]],
      [['I'], [['I'], [], ['am'], ['an'], ['Array']]],
      [{ buffer: Buffer.of(1, 2, 3) }, [{ buffer: Buffer.of(1, 2, 3) }, {}, { b: 'b' }, { c: 'c' }]],
    ])(
      'should return [false, %s] when given an observable (with values %p) and his first emit',
      (theRealFirstValue, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act
        const predicateResult = predicate(obs, observableValues[1]);

        // Assert
        expect(predicateResult).toEqual([false, deepClone(theRealFirstValue)]);

        // For us in case we change the test data and it wrong
        expect(theRealFirstValue).toEqual(observableValues[0]);
        expect(theRealFirstValue).not.toEqual(observableValues[1]);
      },
    );
  });
});
