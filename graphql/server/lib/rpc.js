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
        if (bufferOld) {
          buffer = Buffer.concat([bufferOld, buffer]);
        }
        let packageLength = 0;
        while ((packageLength = this.isReceiveComplete(buffer))) {
          const packageBuffer = buffer.slice(0, packageLength);

          const bodyLength = packageBuffer.readInt32BE(4);
          buffer = buffer.slice(bodyLength + 8);
          const request = this.decodeRequest(packageBuffer);
          callback(
            { body: request.result, socket },
            {
              end: (data) => {
                const buffer = this.encodeResponse(data, request.seq);
                socket.write(buffer);
              },
            }
          );
        }

        bufferOld = buffer;
      });
    });

    return {
      listen() {
        tcpServer.listen.apply(tcpServer, arguments);
      },
    };
  }
};
