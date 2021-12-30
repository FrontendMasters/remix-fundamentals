const cp = require("child_process");
const { getExerciseDirs, getFinalDirs } = require("./utils");

const dirs = [...getExerciseDirs(), ...getFinalDirs()];
console.log(`🔩 Building:\n- ${dirs.join("\n- ")}\n`);

for (const dir of [...getExerciseDirs(), ...getFinalDirs()]) {
  console.log(`🔩 Building ${dir}`);
  const child = cp.execSync(`cd ${dir} && npm run build`);
  console.log(child.toString());
}
