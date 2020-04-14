import process from 'process';
import path from 'path';

// 配置nodejs的外部扩展
function nodeExternals(externals) {
  const result = {};

  for (const item of externals) {
    result[item] = `globalThis.require('${ item }')`;
  }

  return result;
}

const isDev = process.env.NODE_ENV === 'development';

export default function(info) {
  const plugins = [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ['import-components-style', {
      components: {
        'antd-schema-form/es/SchemaForm': '~antd-schema-form/style/antd-schema-form.css'
      }
    }]
  ];

  if (!isDev) {
    plugins.unshift(['transform-react-remove-prop-types', { mode: 'remove', removeImport: true }]);
  }

  return {
    frame: 'react',
    dll: [
      'react',
      'prop-types',
      'react-router',
      'react-router-dom',
      'redux',
      'react-redux',
      'redux-actions',
      'redux-thunk',
      'immutable',
      'reselect'
    ],
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    externals: nodeExternals([
      'electron',
      'got',
      'url'
    ]),
    resolve: {
      alias: Object.assign({
        axios: 'axios/dist/axios.js'
      }, isDev ? {
        'react-dom': '@hot-loader/react-dom'
      } : undefined)
    },
    js: {
      plugins,
      ecmascript: true,
      exclude: /node_modules[\\/](?!antd-schema-form)/
    },
    sass: {
      include: /src/
    },
    css: {
      modifyVars: {
        // https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
        '@primary-color': '#eb2f96'
      },
      modules: false,
      include: /node_modules[\\/]antd(-schema-form)?/
    },
    html: [
      { template: path.join(__dirname, 'src/index.pug') }
    ]
  };
}