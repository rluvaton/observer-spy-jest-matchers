import observerSpyMatchers from './observer-spy';

const imports = [observerSpyMatchers];

export default imports.reduce((acc, matcher) => ({ ...acc, ...matcher }), {});
