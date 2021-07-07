const RPC = require("./rpc");

module.exports = function (
  protobufferRequestSchema,
  protobufferResponseScheme
) {
  return new RPC({
    decodeRequest(buffer) {
      const seq = buffer.readInt32BE();
      const result = protobufferRequestSchema.decode(buffer.slice(8));
      return { seq, result };
    },
    encodeResponse(data, seq) {
      const body = protobufferResponseScheme.encode(data);
      const header = Buffer.alloc(8);
      header.writeInt32BE(seq);
      header.writeInt32BE(body.length, 4);
      return Buffer.concat([header, body]);
    },
    isCompleteRequest(buffer) {
      if (buffer.length < 8) return 0;
      if (buffer.length >= buffer.readInt32BE(4) + 8) {
        return buffer.readInt32BE(4) + 8;
      } else {
        return 0;
      }
    },
  });
};
