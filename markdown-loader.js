const {marked} = require('marked')
// console.log(marked)
module.exports = source => {
 
  //将markdown 转为html字符串
  const html = marked(source)
  // 将html字符串，拼接为一段导出字符串的js代码
  const code = `module.exports= ${JSON.stringify(html)}`
  return code

}