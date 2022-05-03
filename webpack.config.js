const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/js/script.js'),
  output: {
    filename: 'Modal.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Modal',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(.js)$/,
        use: ['babel-loader']
      }
    ]
  },
  mode: 'production',
}
