// 导入http模块:
var http = require('http');
var fs = require('fs');

// 创建http server，并传入回调函数
var server = http.createServer(function (request, response) {
  console.log(request.method + ': ' + request.url);
  if (request.method === 'GET') {
    if (request.url === '/') {
      fs.readFile('./login.html', function (err, data) {
        if (!err) {
          response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
          response.end(data)
        } else {
          throw err;
        }
      });
    } else if (request.url === '/index') {
      //如果访问index页面时没有携带cookie，则重定向到login页面
      // 在chrome下调试时记得勾选disable cache
      if (!request.headers.cookie) {
        response.writeHead(301, { 'Location': '/' })
        response.end()
      } else {
        fs.readFile('./index.html', function (err, data) {
          if (!err) {
            response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
            response.end(data)
          } else {
            throw err;
          }
        });
      }
    } else {
      console.log(`未定义 ${request.url} 路径`)
      fs.readFile('./404.html', function (err, data) {
        if (!err) {
          response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });
          response.end(data)
        } else {
          throw err;
        }
      });
    }
  } else if (request.method === 'POST') {
    if (request.url === '/login') {
      let str = ''
      let json = {}

      //有段数据到达就触发（多次）
      request.on('data', data => {
        str = data
      })

      //数据全部到达触发（一次）
      request.on('end', () => {
        json = JSON.parse(str)
        //console.log(json)
        response.writeHead(200, {
          // cookie只能设置当前域名和父域名，同级域名无效
          'Set-Cookie': `name=${json.name}`,
          'Content-Type': 'text/plain',
        })
        response.end()
        //console.log(`登录请求的响应：${response._header}`)
      })
    }
  } else if (request.method === 'HEAD') {
    // 请求资源的头部信息
    // head请求的响应头应该与使用get请求该资源的响应头相同
    if (request.url === '/getHead') {
      response.writeHead(200);
      response.end()
    }
  } else {
    console.log('未定义的请求方法')
  }
});

// 让服务器监听8080端口:
server.listen(8080, '127.0.0.1');

console.log('Server is running at http://127.0.0.1:8080/');