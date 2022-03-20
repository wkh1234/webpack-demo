const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const RemoveCommentsPlugin = require('./remove-comments-plugin.js');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module:{
    rules:[
        {
            test:/\.css$/, //正则表达式，匹配文件类型
            use:['style-loader','css-loader'] //申明使用什么loader进行处理
        },
        {
          test:/\.md$/, //正则表达式，匹配文件类型
          use:['html-loader','./markdown-loader'] //申明使用什么loader进行处理
        }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
      {
        title: 'webpack title',
        template: './src/index.html'
      }
    ),
    new HtmlWebpackPlugin( // 生成额外的html
      
      {
        filename: 'other.html',
      }
    ),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'public' },
        ]
      }
    ),
    new RemoveCommentsPlugin()
  ]

};