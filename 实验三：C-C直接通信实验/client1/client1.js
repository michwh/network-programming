const net = require("net")

/**
 * 客户端
 */
const client = net.Socket()

//各个客户端的空闲端口
let clientDict = {}

client.connect(8082,'127.0.0.1',() => {
  console.log('连接到服务端')

  client.write('client1:8083')
})

/*监听服务器传来的data数据*/
client.on('data',(data) => {
  console.log(`客户端client1接收消息：${data.toString()}`)
  const reg = new RegExp(/\{(.+?)\}/g)
  if(reg.test(data.toString())) {
    clientDict = JSON.parse(data.toString())
    //断开与服务端的连接
    if(Object.keys(clientDict).length === 2) {
      client.destroy()
    }
  }
})

/* 监听end事件 */
client.on("end",() => {
  console.log("data end")
})

/**
 * 服务端
 */
const server = net.createServer(socket => {
  console.log('someone connects')

  /*发送数据*/
  let message = "我是服务端client1"
  socket.write(message,() => {
    console.log(`服务端client1发送消息：${message} `)
  })

  /*接收消息 */
  socket.on('data',(data) => {
    console.log(`服务端client1接收消息：${data.toString()}`)
  })
})

server.listen(8083,() => {
  console.log('create server on http://127.0.0.1:8083/')
})