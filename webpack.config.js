const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  watch: true,
  output: {
    filename: 'editorjs-codeblock.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Codeblock',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js']
  },
};