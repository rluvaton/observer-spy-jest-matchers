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
  [[{ buffer: Buffer.of(1, 2, 3) }, {}, { b: 'b' }, { c: 'c' }]],

  [[[], ['I'], ['am'], ['an'], ['Array']]],
  [[['I'], [], ['am'], ['an'], ['Array']]],
];

describe('.toEmitSameValues Predicate', () => {
  describe('[true, actual-items>]', () => {
    it.each(getObservableValue())(
      'should return [true, %j] when given an observable with the values that in the 2nd index in the result',
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act
        const predicateResult = predicate(obs, deepClone(observableValues));

        // Assert
        await expect(predicateResult).resolves.toEqual([true, observableValues]);
      },
    );
  });

  describe('[false, <actual-items>]', () => {
    it.each([
      [
        [0, 1, 2],
        [0, 2, 1],
      ],

      [
        ['hello', 'so', 'cool'],
        ['so', 'cool', 'hello'],
      ],
      [
        ['hello', 'so', 'cool'],
        ['hello', 'so', 'cool', 'not'],
      ],
      [['hello', 'so', 'cool'], ['hello']],
      [
        ['hello', 'so', 'cool'],
        ['not', 'the', 'same', 'values'],
      ],

      [
        [true, false, true],
        [false, true, true],
      ],

      [
        [{}, { a: 'a' }, { b: 'b' }, { c: 'c' }],
        [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }],
      ],
      [
        [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }],
        [{ d: 'd' }, { c: 'c' }],
      ],
      [
        [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }],
        [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }, { d: 'd' }],
      ],

      [
        [[], ['I'], ['am'], ['an'], ['Array']],
        [['I'], [], ['am'], ['an'], ['Array']],
      ],
      [
        [[], ['I'], ['am'], ['an'], ['Array']],
        [[], ['I'], ['am'], ['an'], ['Array'], ['not matching']],
      ],
      [
        [[], ['I'], ['am'], ['an'], ['Array']],
        [[], ['I'], ['am'], ['Iron Man']],
      ],
    ])(
      'should return [false, %j] when given an observable and these wrong expected values %j',
      async (observableValues, expectedValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act
        const predicateResult = predicate(obs, deepClone(expectedValues));

        // Assert
        await expect(predicateResult).resolves.toEqual([false, observableValues]);
      },
    );
  });
});
