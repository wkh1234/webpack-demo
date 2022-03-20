const fs = require('fs')
const path = require('path')

const babelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')


const parser = {
  getAst(filePath) { // 获取抽象语法树ast
    // 读取入口文件内容
    const file = fs.readFileSync(filePath, 'utf-8')
    // 将其解析成ast 抽象语法树
    const ast = babelParser.parse(file, {
      sourceType: 'module' // 解析文件的模块化方案是 ES Module
    })
    return ast
  },
  // 获取依赖
  getDeps (ast, filePath) {
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
        // 添加依赖
        deps[relativePath] = absoulatePath
      }
    })
    return deps
  },

  // 将ast解析成code
  getCode (ast) {
     // 编译代码：将代码中浏览器不能识别的语法进行编译
     const { code } = transformFromAst (ast, null, {
      presets: ['@babel/preset-env']
    })
    return code
  }
}

module.exports = parser