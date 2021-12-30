const cp = require("child_process");
const { getExerciseDirs, getFinalDirs } = require("./utils");

const dirs = [...getExerciseDirs(), ...getFinalDirs()];
console.log(`🏎 Installing deps for:\n- ${dirs.join("\n- ")}\n`);

for (const dir of [...getExerciseDirs(), ...getFinalDirs()]) {
  console.log(`⬇️ Installing dependencies for ${dir}`);
  const child = cp.execSync(`cd ${dir} && npm install`);
  console.log(child.toString());
}
