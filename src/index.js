import _ from 'lodash';
import './index.css'
import markdown from './index.md'

console.log(markdown)
function component() {
  const element = document.createElement('div');

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());