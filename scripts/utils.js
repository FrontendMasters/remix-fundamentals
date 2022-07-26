const fs = require("fs");
const cp = require("child_process");
const { matchSorter } = require("match-sorter");
const glob = require("glob");

const dirExists = async (dir) =>
  Boolean(await fs.promises.stat(dir).catch(() => false));

function resolvePath(search) {
  const appDirs = getAppDirs();
  if (search.startsWith("./")) {
    search = search.slice(2);
  }

  return matchSorter(appDirs, search)?.[0];
}

function getAppDirs() {
  const pkg = require("../package.json");
  return pkg.workspaces.flatMap((w) => glob.sync(w));
}

function runInDirs(script, dirs = []) {
  if (!dirs.length) {
    dirs = getAppDirs();
  }
  console.log(`🏎  "${script}":\n- ${dirs.join("\n- ")}\n`);

  for (const dir of dirs) {
    console.log(`🏎  ${script} in ${dir}`);
    cp.execSync(script, { cwd: dir, stdio: "inherit" });
  }
}

module.exports = {
  getAppDirs,
  runInDirs,
  resolvePath,
  dirExists,
};
