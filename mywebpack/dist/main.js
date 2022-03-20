
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
        require("./src/index.js");
      })({"./src/index.js":{"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _count = _interopRequireDefault(require(\"./count.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _add[\"default\"])(1, 2));\nconsole.log((0, _count[\"default\"])(3, 1));","deps":{"./add.js":"/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/add.js","./count.js":"/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/count.js"}},"/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/add.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nfunction add(x, y) {\n  return x + y;\n}\n\nvar _default = add;\nexports[\"default\"] = _default;","deps":{}},"/Users/qwr/Desktop/demo/webpack-demo/mywebpack/src/count.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nfunction count(x, y) {\n  return x - y;\n}\n\nvar _default = count;\nexports[\"default\"] = _default;","deps":{}}});
    