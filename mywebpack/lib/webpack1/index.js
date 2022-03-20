
const fs = require('fs')
const path = require('path')

const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

function webpack(config) {
  return new Compiler(config)
}

class Compiler {
  constructor (options ={}) {
    this.options = options
  }
  // 启动webpack打包
  run () {
    // 1.读取入口文件内容
    // 入口文件路劲
    const filePath = this.options.entry
    const file = fs.readFileSync(filePath, 'utf-8')
    // 2. 将其解析成ast 抽象语法树
    const ast = babelParser.parse(file, {
      sourceType: 'module' // 解析文件的模块化方案是 ES Module
    })
    console.log(ast)
    // 获取文件文件夹路径
    const dirname = path.dirname(filePath)
    // 存储依赖
    const deps = {}
    // 收集依赖
    traverse(ast, {
      // 内部会遍历ast 中的program.dody, 判断里面的语句类型
      // 如果type："ImportDeclaration" 就会触发当前函数
      ImportDeclaration ({node}) {
        // 文件相对路径 './add.js'
        const relativePath = node.source.value
        // 生成基于入口文件的绝对路径
        const absoulatePath = path.resolve(dirname, relativePath)
        console.log(node)
        // 添加依赖
        deps[relativePath] = absoulatePath
      }
    })

    console.log(deps)

    // 编译代码：将代码中浏览器不能识别的语法进行编译
    const { code } = transformFromAst (ast, null, {
      presets: ['@babel/preset-env']
    })
    console.log(code)
    
  }
}

module.exports = webpack