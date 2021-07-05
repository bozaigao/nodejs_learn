const fs = require("fs");
const vm = require("vm");

const context = vm.createContext({});

const templateCache = {};

function createTemplate(path) {
  if (templateCache[path]) return templateCache[path];
  templateCache[path] = vm.runInContext(
    `(function generateTem(data){
        with(data){
            return \`${fs.readFileSync(path, "utf-8")} \`;
        }
    })`,
    context
  );

  return templateCache[path];
}

module.exports = createTemplate;
