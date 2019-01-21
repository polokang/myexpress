# myexpress

nodejs webspider by cheerio

1. use cheerio module to parse html
2.

src
|
middlewares
NOTFOUND.js
errorHandler.js
|
models
package.js(解析返回的 html ,返回 自定义的 package 对象)
|
routes
fastgo.js（抓取 fastgo 网站的查询结果）
ark.js
et.js
|
controller
controller.js （解析输入的快递单号，判断是用哪一个 route 去取数据。例如：FG0369234AU ，是 FG 开头，即选择 route/fastgo.js
index.js
route.js
