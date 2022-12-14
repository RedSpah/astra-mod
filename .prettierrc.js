// This is the configuration file for Prettier, the auto-formatter
// https://prettier.io/docs/en/configuration.html
module.exports = {
  // https://prettier.io/docs/en/options.html#trailing-commas
  // The default is "es5" - Trailing commas where valid in ES5 (objects, arrays, etc.)
  // However, always having trailing commas is objectively better
  // The Airbnb style guide agrees:
  // https://github.com/airbnb/javascript#commas--dangling
  // Prettier itself also acknowledges Nik Graf's blog in their official blog:
  // https://prettier.io/blog/2020/03/21/2.0.0.html
  // https://medium.com/@nikgraf/why-you-should-enforce-dangling-commas-for-multiline-statements-d034c98e36f8
  // Prettier will change the default in the future:
  // https://github.com/prettier/prettier/issues/9369
  trailingComma: "none",

  // https://github.com/prettier/plugin-xml#configuration
  // The default is "struct"
  // However, whitespace cannot be reformatted unless this is set to "ignore"
  xmlWhitespaceSensitivity: "ignore",

  // Changed these values from the IsaacScript defaults.
  printWidth: 200
};
