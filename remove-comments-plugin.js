class RemoveCommentsPlugin {
  apply (compiler) { // 这个方法会在启动的时候被调用
    // compiler 包含此次构建的所有配置信息
    // compiler 对象的hooks属性访问到emit钩子，这个钩子会在webpack即将向输出目录输出文件时执行
    
    // 再通过tap方法注册一个钩子函数，tap 方法接受两个参数。插件名称 和 要挂载到这个钩子上的函数
    compiler.hooks.emit.tap('RemoveCommentsPlugin', compilation => {
      // compilation可以理解为此次打包的上下文
      for(const name in compilation.assets) {
        // console.log(name) // 输出文件名称
        // console.log(compilation.assets[name].source()) // 输出文件名称
        if (name.endsWith('.js')) { // js文件
          const contents = compilation.assets[name].source()
          const noComments = contents.replace(/\/\*{2,}\/\s?/g, '')
          compilation.assets[name] = {
            source: () => noComments,
            size:() => noComments.length
          }

        }
      }
    })

    console.log('RemoveCommentsPlugin')
  }

}

module.exports=RemoveCommentsPlugin;
