const fs = require("fs/promises");
const { getAppDirs } = require("./utils");

async function go() {
  for (const dir of getAppDirs()) {
    console.log(`💥 deleting ${dir}/node_modules and lockfile`);
    await fs.rm(`${dir}/node_modules`, { recursive: true }).catch(() => {});
    await fs
      .rm(`${dir}/package-lock.json`, { recursive: true })
      .catch(() => {});
  }
}

go();
