
const {getAst, getDeps, getCode} = require('./parser')
const fs = require('fs')
const path = require('path')
class Compiler {
  constructor (options ={}) {
    // webpack 配置对象
    this.options = options
    // 所有依赖容器
    this.modules = []
  }
  // 启动webpack打包
  run () {
    // 1.读取入口文件内容
    // 入口文件路径
    const filePath = this.options.entry
    // 第一次构建,得到入口文件的信息
    const fileInfo = this.build(filePath)
    this.modules.push(fileInfo)
    // 递归收集依赖
    // 遍历所有的依赖
    this.modules.forEach( fileInfo => {
      // deps: {
      //   './add': '/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/add',
      //   './count': '/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/count'
      // }
      // 取出当前文件的所有依赖
      const deps = fileInfo.deps
      // 遍历
      for(const relativePath in deps) {
        // 依赖文件的绝对路径
        const absoulatePath = deps[relativePath]
        // 对依赖文件进行处理
        const fileInfo = this.build(absoulatePath)
        // 将处理后的结果添加到modules中,后面遍历就回对fileInfo
        this.modules.push(fileInfo)
      }
    })
    // 整理成关系依赖图
    const depsGraph = this.modules.reduce((graph, module) => {
      return {
        ...graph,
        [module.filePath]: {
          code:module.code,
          deps:module.deps
        }
      }
    }, {})

    this.generate(depsGraph)
  }
  // 开始构建
  build (filePath) {
    // 1.获取抽象语法树ast
    const ast = getAst(filePath)
    // 2.// 收集依赖
    const deps = getDeps(ast, filePath)
    // 3.将ast解析成code
    const code = getCode(ast)  

    return {
      filePath,
      deps,
      code
    }
  }

  /*
    '"use strict";\n' +
      '\n' +
      'var _add = _interopRequireDefault(require("./add.js"));\n' +
      '\n' +
      'var _count = _interopRequireDefault(require("./count.js"));\n' +
      '\n' +
      'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n' +
      '\n' +
      'console.log((0, _add["default"])(1, 2));\n' +
      'console.log((0, _count["default"])(3, 1));',
      deps: {
      './add.js': '/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/add.js',
      './count.js': '/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/count.js'
    }
  */
  // 生成输出资源。--js文件
  generate(depsGraph) {
    const bundle = `
      (function (depsGraph) {
        // require函数： 为了加载入口文件
        function require(module) {
          // 定义模块内部的require函数--引入模块内容
          function localRequire (relativePath) {
            // 为了找到要引入模块的绝对路径,通过require加载
            return require(depsGraph[module].deps[relativePath])
          };
          // 定义暴露对象,（将来要暴露的内容）
          var exports = {};

          (function (require, exports, code){
            eval(code)
          })(localRequire, exports, depsGraph[module].code);

          // 作为require的返回值,返回出去
          // 为了后面的require函数能得到暴露的内容
          return exports;
        }
        // 加载入口文件
        require(${JSON.stringify(this.options.entry)});
      })(${JSON.stringify(depsGraph)});
    `
    // 生成文件的绝对路径
    const filePath = path.resolve(this.options.output.path, this.options.output.filename);
    // 写入文件
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }
}

module.exports = Compiler