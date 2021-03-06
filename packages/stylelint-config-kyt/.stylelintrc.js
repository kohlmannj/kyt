modules.exports = {
  extends: 'stylelint-config-standard',

  rules: {
    'declaration-no-important': true,
    'string-quotes': 'single',
    'selector-max-id': 0,
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['export', 'import', 'global', 'local'],
      },
    ],
    'function-url-scheme-blacklist': 'never',
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'selector-class-pattern': [
      '^[a-zA-Z0-9_]+$',
      {
        message: 'Selector should be alhpanumeric, without hyphens [stylelint-config-kyt]',
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extend', 'include', 'mixin', 'if', 'else', 'for'],
      },
    ],
  },
};
