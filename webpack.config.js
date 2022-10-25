var path = require('path');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname),
    filename: 'static/_bundle.js'
  },
  resolve: {
    alias: {
      'vue': './node_modules/vue/dist/vue.esm-browser.js'
    }
  }
};