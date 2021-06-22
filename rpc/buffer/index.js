/*
 * @Author: 波仔糕
 * @LastModifiedBy: 波仔糕
 */
const fs = require("fs");
const protocolBuf = require("protocol-buffers");
const schemas = protocolBuf(fs.readFileSync(__dirname + "/test.proto"));

const buffer = schemas.User.encode({
  name: "heyanbo",
  city: "成都",
});
let test = Buffer.from(buffer);
console.log(test,test.slice(0, 2).toString());


