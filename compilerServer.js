const fs = require("fs");
const { generateFile } = require("./generateFile");
const { executePy } = require("./executePy");
const { executeNode } = require("./executeNode");

const compile = async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  const filepath = await generateFile(language, code);
  let output;
  if (language === "py") {
    output = await executePy(filepath);
  } else if (language === "js") {
    output = await executeNode(filepath);
  }

  const deleteFile = filepath;
  if (fs.existsSync(deleteFile)) {
    fs.unlink(deleteFile, (err) => {
      if (err) {
        console.log(err);
      }
      console.log("deleted code file");
    });
  }
  return res.json({ filepath, output });
};

module.exports = {
  compile,
};
