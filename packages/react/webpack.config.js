const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      name: 'UplinkProtocolReact',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default'
    },
    globalObject: 'this',
    clean: true
  },  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json'),
              transpileOnly: false,
              compilerOptions: {
                declaration: true,
                declarationDir: './dist',
                outDir: './dist'
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@uplink-protocol/core': path.resolve(__dirname, '../../src')
    }
  },
  externals: {
    '@uplink-protocol/core': '@uplink-protocol/core',
    'react': 'react',
    'react-dom': 'react-dom',
    'react-scripts': 'react-scripts',
  },
  devtool: 'source-map'
};
