const fs = require("fs");

module.exports = {
  getExerciseDirs() {
    return fs.readdirSync("./exercise").map((dir) => `./exercise/${dir}`);
  },
  getFinalDirs() {
    return fs.readdirSync("./final").map((dir) => `./final/${dir}`);
  },
};
