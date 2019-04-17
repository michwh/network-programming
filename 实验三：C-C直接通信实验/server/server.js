const net = require('net')

//用于存放客户端的数组
let client = []

//用于存放不同客户端空闲端口号的字典
let clientDict = {}

const server = net.createServer(socket => {
  client.push(socket)

  server.getConnections((err,count) => {
    console.log(`客户端连接数：${count}`)   
  })

  /*发送数据*/
  let message = "hello clinet! I'm server"
  socket.write(message,() => {
    console.log(`服务端发送消息：${message} `)
  })

  /*监听data事件*/
  socket.on('data',(data) => {
    const msg = data.toString().split(':')
    console.log(`服务端接收消息：${data.toString()}`)
    clientDict[msg[0]] = msg[1]
    setTimeout(() => {
      for(let i in client) {
        client[i].write(JSON.stringify(clientDict),() => {
          console.log(`服务端群发出端口字典：${JSON.stringify(clientDict)}`)
        })
      }
    },1000)
  })
})

/*设置连接关闭时的回调函数*/
server.on('close', () => {
  console.log('连接关闭')
})

/*设置监听端口*/
server.listen(8082, () => {
  console.log('create server on http://127.0.0.1:8082/')
})