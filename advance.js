const fsExtra = require("fs-extra");
const path = require("path");
const { resolvePath } = require("./scripts/utils");

let { 2: appDir } = process.argv;

async function go() {
  const appDirPath = resolvePath(appDir);
  const workspaceDirPath = path.resolve("./workspace");
  await fsExtra.copy(path.resolve(appDirPath), workspaceDirPath, {
    filter(src, dest) {
      return !dest.includes("node_modules");
    },
  });
  require("./scripts/fix-pkg-names");
  console.log(`Workspace is now at ${appDirPath}`);
}

go();
