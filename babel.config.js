const customMinifyCSS = require('./utils/custom-minify-css.js');

module.exports = api => {
  api.cache(true);

  return {
    plugins: [
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      [
        'template-html-minifier',
        {
          modules: {
            'lit-html': ['html'],
            'lit-element': ['html', { name: 'css', encapsulation: 'style' }],
          },
          htmlMinifier: {
            collapseWhitespace: true,
            removeComments: true,
            caseSensitive: true,
            minifyCSS: customMinifyCSS,
          },
        },
      ],
      ['bundled-import-meta', { importStyle: 'baseURI' }],
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: ['@babel/plugin-transform-template-literals'],
          useBuiltIns: false,
          modules: false,
        },
      ],
    ],
  };
};
