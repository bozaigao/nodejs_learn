const EasySock = require("easy_sock");
const protocolBuffers = require("protocol-buffers");
const fs = require("fs");
const schemas = protocolBuffers(fs.readFileSync(__dirname + "/detail.proto"));
const easySock = new EasySock({
  ip: "127.0.0.1",
  port: 4000,
  timeout: 500,
  keepAlive: true,
});

easySock.encode = function (data, seq) {
  const buffer = Buffer.alloc(8);
  const body = schemas.ColumnRequest.encode(data);
  buffer.writeInt32BE(seq);
  buffer.writeInt32BE(body.length, 4);
  const buffers = Buffer.concat([buffer, body]);
  return buffers;
};
easySock.decode = function (buffer) {
  const seq = buffer.readInt32BE();
  const body = schemas.ColumnResponse.decode(buffer.slice(8));
  return {
    result: body,
    seq,
  };
};
easySock.isReceiveComplete = function (buffer) {
  if (buffer.length < 8) {
    return 0;
  }
  const bodyLength = buffer.readInt32BE(4);

  if (buffer.length >= bodyLength + 8) {
    return bodyLength + 8;
  } else {
    return 0;
  }
};

module.exports = easySock;
