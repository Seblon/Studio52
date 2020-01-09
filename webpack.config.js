const currentTask = process.env.npm_lifecycle_event
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fse = require('fs-extra')

class RunAfterCompile {
   apply(compiler) {
      compiler.hooks.done.tap('Copy images', function () {
         fse.copySync('./app/assets/img', './docs/assets/img')
      })
   }
}

const postCSSPlugins = [
   require('postcss-import'),
   require('postcss-mixins'),
   require('postcss-simple-vars'),
   require('postcss-nested'),
   require('autoprefixer')
]

let cssConfig = {
   test: /\.css$/i,
   use: ['css-loader?url=false', { loader: 'postcss-loader', options: { plugins: postCSSPlugins } }]
}

let pages = fse.readdirSync('./app').filter(function (file) {
   return file.endsWith('.html')
}).map(function (page) {
   return new HtmlWebpackPlugin({
      filename: page,
      template: `./app/${page}`
   })
})

let config = {
   entry: './app/assets/scripts/App.js',
   plugins: pages,
   module: {
      rules: [
         cssConfig
      ]
   }
}

if (currentTask == 'dev') {
   cssConfig.use.unshift('style-loader')
   config.output = {
      filename: 'bundeled.js',
      path: path.resolve(__dirname, 'app')
   }
   config.devServer = {
      before: function (app, server) {
         server._watch('./app/**/*.html')
      },
      contentBase: path.join(__dirname, 'app'),
      hot: true,
      port: 3000,
      host: '0.0.0.0'
      // Localhost för andra enheter: 192.168.72.42:3000
   }
   config.mode = 'development'
}

if (currentTask == 'build') {
   cssConfig.use.unshift(MiniCssExtractPlugin.loader)
   config.output = {
      filename: 'assets/js/[name].js',
      chunkFilename: 'assets/js/[name].js',
      path: path.resolve(__dirname, 'docs')
   }
   config.mode = 'production'
   config.optimization = {
      splitChunks: { chunks: 'all' }
   }
   config.plugins.push(
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({ filename: 'assets/css/styles.css' }),
      new RunAfterCompile()
   )
}

module.exports = config