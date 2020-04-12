module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 11
          },
          bugfixes: true,
          modules: 'commonjs'
        }
      ]
    ]
  };
};