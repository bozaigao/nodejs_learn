const net = require("net");

module.exports = class RPC {
  constructor({ encodeResponse, decodeRequest, isCompleteRequest }) {
    this.decodeRequest = decodeRequest;
    this.encodeResponse = encodeResponse;
    this.isReceiveComplete = isCompleteRequest;
  }

  createServer(callback) {
    const tcpServer = net.createServer((socket) => {
      let bufferOld = null;
      socket.on("data", (buffer) => {
        console.log("收到数据了1", buffer);
        if (bufferOld) {
          buffer = Buffer.concat([bufferOld, buffer]);
        }
        let packageLength = 0;

        while ((packageLength = this.isReceiveComplete(buffer))) {
          const packageBuffer = buffer.slice(0, packageLength);
          const bodyLength = packageBuffer.readInt32BE(4);
          const requestBuffer = packageBuffer.slice(8);
          bufferOld = buffer.slice(bodyLength);
          const request = this.decodeRequest(requestBuffer);
          console.log("收到数据了", request);
          callback(
            { body: request.result, socket },
            {
              end(data) {
                const buffer = this.encodeResponse(data);
                socket.write(buffer);
              },
            }
          );
        }
      });
    });

    return {
      listen() {
        tcpServer.listen.apply(tcpServer, arguments);
      },
    };
  }
};
