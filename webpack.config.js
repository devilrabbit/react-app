const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "index.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ],
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      "@src": path.resolve(__dirname, 'src'),
    },
  },
  target: ["web", "es5"],
  plugins: [
    new HtmlWebpackPlugin({
      title: 'hello react',
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 8080,
    contentBase: 'dist',
    open: true,
    hot: true,
    historyApiFallback: true,
  },
};