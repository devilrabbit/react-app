/** @type {import('prettier').Options} */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: "all",
  overrides: [
    {
      files: "*.{md,yml}",
      options: {
        printWidth: 80,
        singleQuote: false,
        trailingComma: "none"
      }
    }
  ]
};