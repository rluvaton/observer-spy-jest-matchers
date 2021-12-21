import { of } from 'rxjs';
import matcher from './';
import { deepClone } from '../../../../../../src/common/utils';

expect.extend(matcher);

// We aren't using a constants because if in some case the values changed (which it shouldn't)
// we don't want it to effect other tests.
const getObservableValue = (): any[][] => [
  [[0, 1, 2, 4, 5]],
  [['', 'hello', 'this', 'is', 'so', 'cool']],
  [[true, false, true, false, true]],
  [[{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }]],
  [[[], ['I'], ['am'], ['an'], ['Array']]],
  [[{ buffer: Buffer.of(1, 2, 3) }, {}, { b: 'b' }, { c: 'c' }]],
];

const getObservableValuesThatDontMatch = (): any[][] => [
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
];

describe('.toEmitSameValues', () => {
  describe('pass', () => {
    it.each(getObservableValue())(
      'should passes when observable emit %j, the same as the values that provided',
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        await expect(obs).toEmitSameValues(deepClone(observableValues));
      },
    );
  });

  describe('fail', () => {
    it.each(getObservableValuesThatDontMatch())(
      'should fails when the observable does not emit the given values (%j) when emitting %j',
      async (observableValues, expectedValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        await expect(() =>
          expect(obs).toEmitSameValues(deepClone(expectedValues)),
        ).rejects.toThrowErrorMatchingSnapshot();
      },
    );
  });
});

describe('.not.toEmitSameValues', () => {
  describe('pass', () => {
    it.each(getObservableValuesThatDontMatch())(
      'should pass when the observable does not start with the given value (%j) when emitting %j',
      async (observableValues, expectedValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        await expect(obs).not.toEmitSameValues(deepClone(expectedValues));
      },
    );
  });

  describe('fail', () => {
    it.each(getObservableValue())(
      'should fail when observable first emit a given value (%j) when emitting %j',
      async (observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Assert
        await expect(() =>
          expect(obs).not.toEmitSameValues(deepClone(observableValues)),
        ).rejects.toThrowErrorMatchingSnapshot();
      },
    );
  });
});
