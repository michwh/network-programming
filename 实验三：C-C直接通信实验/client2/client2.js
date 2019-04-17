const net = require("net")

//连接服务端的client
const client1 = net.Socket()

//连接client1的client
const client2 = net.Socket()

//各个客户端的空闲端口
let clientDict = {}

client1.connect(8082,'127.0.0.1',() => {
  console.log('连接到服务端')

  client1.write('client2:8084')
})

/*监听服务器传来的data数据*/
client1.on('data',(data) => {
  console.log(`客户端client2接收消息：${data.toString()}`)
  const reg = new RegExp(/\{(.+?)\}/g)
  if(reg.test(data.toString())) {
    clientDict = JSON.parse(data.toString())
    if(Object.keys(clientDict).length === 2) {
      client1.destroy()
    }
    //当clientDict中包含client1的端口时，client2与client1建立连接
    if('client1' in clientDict) {
      setTimeout(() => {
        client2.connect(clientDict.client1,'127.0.0.1',() => {
          console.log('客户端client2连接到服务端client1')
          client2.write('我是客户端client2')
        })
        client2.on('data',(data) => {
          console.log(`客户端client2接收消息：${data.toString()}`)
        })
      },10000)
    }
  }
})

/* 监听end事件 */
client1.on("end",() => {
  console.log("data end");
})