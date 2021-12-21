import { of } from 'rxjs';
import matcher from './';
import { deepClone } from '../../../../../../src/common/utils';

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
  [[{ buffer: Buffer.of(1, 2, 3) }, {}, { b: 'b' }, { c: 'c' }]],
];

const getNotMatchFirstItemValue = (): [any, any[]][] => [
  // Start With Falsy
  [2, [0, 1, 2]],
  [false, [0, 1, 2]],
  // Start with Truthy
  [0, [1, 2, 3]],
  [true, [1, 2, 3]],

  // Start With Falsy
  ['not here', ['', 'hello', 'so', 'cool']],
  // Start With Truthy
  ['so', ['hello', 'so', 'cool']],

  // Start with false
  [true, [false, true, true]],
  [0, [false, true, true]],
  // Start with true
  [false, [true, false, true]],
  [1, [true, false, true]],

  [{ a: 'a' }, [{}, { a: 'a' }, { b: 'b' }, { c: 'c' }]],
  [{}, [{ a: 'a' }, {}, { b: 'b' }, { c: 'c' }]],

  [['Not here'], [[], ['I'], ['am'], ['an'], ['Array']]],
  [[], [['I'], [], ['am'], ['an'], ['Array']]],
  [[Buffer.of(3, 2, 1)], [[Buffer.of(1, 2, 3)], [], ['am'], ['an'], ['Array']]],
];

describe('.toFirstEmit', () => {
  describe('pass', () => {
    it.each(getObservableValue().map((input) => [input[0][0], ...input]))(
      'should passes when observable first emit a given value (%j) when emitting %j',
      (firstValue, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        expect(obs).toFirstEmit(deepClone(firstValue));
      },
    );
  });

  describe('fail', () => {
    it.each(getNotMatchFirstItemValue())(
      'should fails when the observable does not start with the given value (%j) when emitting %j',
      (expectedFirstItem, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        expect(() => expect(obs).toFirstEmit(expectedFirstItem)).toThrowErrorMatchingSnapshot();
      },
    );
  });
});

describe('.not.toFirstEmit', () => {
  describe('pass', () => {
    it.each(getNotMatchFirstItemValue())(
      'should pass when the observable does not start with the given value (%j) when emitting %j',
      (expectedFirstItem, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Act & Assert
        expect(obs).not.toFirstEmit(expectedFirstItem);
      },
    );
  });

  describe('fail', () => {
    it.each(getObservableValue().map((input) => [input[0][0], ...input]))(
      'should fail when observable first emit a given value (%j) when emitting %j',
      (firstValue, observableValues) => {
        // Arrange
        const obs = of(...observableValues);

        // Assert
        expect(() => expect(obs).not.toFirstEmit(deepClone(observableValues[0]))).toThrowErrorMatchingSnapshot();
      },
    );
  });
});
