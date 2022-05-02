const { exec } = require("child_process");

const executeNode = (filepath) => {
  console.log("Inside execute node");
  return new Promise((resolve, reject) => {
    console.log("filepath", filepath);
    exec(`node ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  }).catch((e) => e.stderr);
};

module.exports = {
  executeNode,
};
