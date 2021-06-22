const { head } = require('lodash');
const server = require('net');



// 假数据
const LESSON_DATA = {
    136797: "01 | 课程介绍",
    136798: "02 | 内容综述",
    136799: "03 | Node.js是什么？",
    136800: "04 | Node.js可以用来做什么？",
    136801: "05 | 课程实战项目介绍",
    136803: "06 | 什么是技术预研？",
    136804: "07 | Node.js开发环境安装",
    136806: "08 | 第一个Node.js程序：石头剪刀布游戏",
    136807: "09 | 模块：CommonJS规范",
    136808: "10 | 模块：使用模块规范改造石头剪刀布游戏",
    136809: "11 | 模块：npm",
    141994: "12 | 模块：Node.js内置模块",
    143517: "13 | 异步：非阻塞I/O",
    143557: "14 | 异步：异步编程之callback",
    143564: "15 | 异步：事件循环",
    143644: "16 | 异步：异步编程之Promise",
    146470: "17 | 异步：异步编程之async/await",
    146569: "18 | HTTP：什么是HTTP服务器？",
    146582: "19 | HTTP：简单实现一个HTTP服务器"
}

let olderBuffer = null;
server.createServer(function(socket){
    socket.on('data',function(buffer){
        if(olderBuffer){
            buffer = Buffer.concat([olderBuffer,buffer]);
        }
        let packageLength = 0;
        while(packageLength = checkCompletePackage(buffer)){
            const package = buffer.slice(0,packageLength);
            buffer = buffer.slice(packageLength);
           const data =  decode(package);
           setTimeout(()=>{
            socket.write(encode(data))
           },1000);
        }
        olderBuffer = buffer;
    });
}).listen(3000);

function checkCompletePackage(buffer){
    if(buffer.length<6){
        return 0;
    }

    const bodyLength = buffer.readInt32BE(2);
    return bodyLength+6;
}

function encode(data){
    const header = Buffer.alloc(6);
    console.log('数据',data);
    header.writeInt16BE(data.seq);
    const body = Buffer.from(LESSON_DATA[data.body]);

    header.writeInt32BE(body.length,2);

    return Buffer.concat([header,body]);
}

function decode(buffer){
    const header = buffer.slice(0,6);
    const body = buffer.slice(6);
    const seq = header.readInt16BE();
    return {
        seq,
        body:body.toString()
    }
}