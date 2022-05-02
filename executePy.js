const { exec } = require("child_process");

const executePy = (filepath) => {
  console.log("Inside execute py");
  return new Promise((resolve, reject) => {
    console.log("filepath", filepath);
    exec(`python ${filepath}`, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  }).catch((e) => e.stderr);
};

module.exports = {
  executePy,
};
