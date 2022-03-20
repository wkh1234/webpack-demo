const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist'),
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
  plugins:[]

};