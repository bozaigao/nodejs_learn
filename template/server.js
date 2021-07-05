const server = require("net");
const columData = require("./column");
const fs = require("fs");
const protocolBuffers = require("protocol-buffers");
const echemas = protocolBuffers(fs.readFileSync(__dirname + "/detail.proto"));

let olderBuffer = null;
server
  .createServer(function (socket) {
    socket.on("data", function (buffer) {
      console.log("来数据了");
      if (olderBuffer) {
        buffer = Buffer.concat([olderBuffer, buffer]);
      }
      let packageLength = 0;
      while ((packageLength = checkCompletePackage(buffer))) {
        const package = buffer.slice(0, packageLength);
        buffer = buffer.slice(packageLength);
        const data = decode(package);
        socket.write(encode(data));
      }
      olderBuffer = buffer;
    });
  })
  .listen(4000);

function checkCompletePackage(buffer) {
  if (buffer.length < 8) {
    return 0;
  }

  const bodyLength = buffer.readInt32BE(4);
  return bodyLength + 8;
}

function encode(data) {
  const header = Buffer.alloc(8);
  header.writeInt32BE(data.seq);
  const body = echemas.ColumnResponse.encode({
    column: columData[0],
    recommendColumns: [columData[1], columData[2]],
  });

  header.writeInt32BE(body.length, 4);
  console.log("数据encode",body);

  return Buffer.concat([header, body]);
}

function decode(buffer) {
  const header = buffer.slice(0, 8);
  const seq = header.readInt32BE();
  const body = echemas.ColumnRequest.decode(buffer.slice(8));
  console.log("数据decode",body);
  return {
    seq,
    body,
  };
}
