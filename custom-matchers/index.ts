import matchers from './matchers';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const jestExpect = global.expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers);
} else {
  console.error(
    "Unable to find Jest's global expect." +
      '\nPlease check you have added the custom matchers correctly to your jest configuration.' +
      '\nSee https://github.com/jest-community/jest-extended#setup for example.',
  );
}
