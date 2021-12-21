import toEmitSameValues from './toEmitSameValues';
import toFirstEmit from './toFirstEmit';
import toReceiveError from './toReceiveError';

const imports = [toFirstEmit, toEmitSameValues, toReceiveError];

export default imports.reduce((acc, matcher) => ({ ...acc, ...matcher }), {});
