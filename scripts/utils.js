const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const dirExists = async (dir) =>
  Boolean(await fs.promises.stat(dir).catch(() => false));

function resolvePath(p) {
  if (/\d+\.\d+/.test(p)) {
    const { prefix, exerciseNumber, extraCreditNumber } =
      p.match(
        /(?<prefix>.*?)(?<exerciseNumber>\d+).*\.(?<extraCreditNumber>\d+)/
      )?.groups ?? {};
    return [...getExerciseDirs(), ...getFinalDirs()].find((dir) => {
      const dirname = path.basename(dir);
      return (
        path.resolve(dir).startsWith(path.resolve(prefix)) &&
        dirname.startsWith(exerciseNumber.padStart(2, "0")) &&
        dirname.includes(`.extra-${extraCreditNumber.padStart(2, "0")}`)
      );
    });
  } else {
    return [...getExerciseDirs(), ...getFinalDirs()].find((dir) => {
      return path.resolve(dir).startsWith(path.resolve(p));
    });
  }
}

function getExerciseDirs() {
  return fs.readdirSync("./exercise").map((dir) => `./exercise/${dir}`);
}

function getFinalDirs() {
  return fs.readdirSync("./final").map((dir) => `./final/${dir}`);
}

function runInDirs(script, dirs = []) {
  if (!dirs.length) {
    dirs = [...getExerciseDirs(), ...getFinalDirs()];
  }
  console.log(`🏎  "${script}":\n- ${dirs.join("\n- ")}\n`);

  for (const dir of dirs) {
    console.log(`🏎  ${script} in ${dir}`);
    cp.execSync(script, { cwd: dir, stdio: "inherit" });
  }
}

module.exports = {
  getExerciseDirs,
  getFinalDirs,
  runInDirs,
  resolvePath,
  dirExists,
};
