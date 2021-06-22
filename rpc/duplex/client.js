const net = require('net')
const socket = new net.Socket();
const LESSON_IDS = [
    "136797",
    "136798",
    "136799",
    "136800",
    "136801",
    "136803",
    "136804",
    "136806",
    "136807",
    "136808",
    "136809",
    "141994",
    "143517",
    "143557",
    "143564",
    "143644",
    "146470",
    "146569",
    "146582"
];

socket.connect({
    host:'127.0.0.1',
    port:3000
})

let olderBuffer = null;
socket.on('data',function(buffer){
    if(olderBuffer){
        buffer = Buffer.concat([olderBuffer,buffer]);
    }
    let packageLength = 0;
    while(packageLength = checkCompletePackage(buffer)){
        const package = buffer.slice(0,packageLength);
        buffer = buffer.slice(packageLength);
       const data =  decode(package);
       console.log('从服务端返回数据',data.seq,data.body);
    }

    olderBuffer = buffer;
})

function checkCompletePackage(buffer){
    if(buffer.length<6){
        return 0;
    }

    const bodyLength = buffer.readInt32BE(2);
    return bodyLength+6;
}

let seq = 0;
function encode(data){
    const header = Buffer.alloc(6);
    header.writeInt16BE(seq);
    const body = Buffer.from(LESSON_IDS[data.id]);
    header.writeInt32BE(body.length,2);
    console.log('请求',seq, LESSON_IDS[data.id]);
    seq++;
    const buffer = Buffer.concat([header,body]);
    return buffer;
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

for(let i=0; i<100; i++){
    socket.write(encode({id:Math.floor(Math.random()*LESSON_IDS.length)}))
}


