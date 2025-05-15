const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { execSync } = require('child_process');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  
  // Common configuration for all output formats
  const baseConfig = {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? false : 'source-map',
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      })],
    },
  };  // Config for generating main UMD build
  const umdConfig = {
    ...baseConfig,
    entry: './src/index.ts',
    output:{
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: {
        name: 'UplinkProtocol',
        type: 'umd',
      },
      umdNamedDefine: true,
      globalObject: 'this',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer'),
                  ],
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'components.bundle.css',
      }),
    ],
    externals: {
      lit: {
        commonjs: 'lit',
        commonjs2: 'lit',
        amd: 'lit',
        root: 'lit',
      },
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM',
      },
    },
  };  // Config for the zero-configuration auto-init bundle
  const autoInitConfig = {
    ...baseConfig,
    entry: './src/uplink-auto-init.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'uplink-auto-init.js',
      library: {
        name: 'UplinkAutoInit',
        type: 'umd',
      },
      umdNamedDefine: true,
      globalObject: 'this',
    },
    module: umdConfig.module,
    resolve: umdConfig.resolve,
    plugins: [
      ...umdConfig.plugins,
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('GenerateTypeDeclarations', () => {
            console.log('Generating TypeScript declarations for UMD build...');
            try {
              execSync('tsc -p tsconfig.declarations.json', { stdio: 'inherit' });
              console.log('TypeScript declarations generated successfully.');
            } catch (error) {
              console.error('Error generating TypeScript declarations:', error);
            }
          });
        },
      }
    ],
    externals: umdConfig.externals
  };
  
  return [umdConfig, autoInitConfig];
};