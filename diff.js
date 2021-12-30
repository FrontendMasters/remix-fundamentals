const fs = require("fs/promises");
const cp = require("child_process");
const { 2: first, 3: second } = process.argv;

const dirExists = async (dir) => Boolean(await fs.stat(dir).catch(() => false));

async function go() {
  if (!(await dirExists(first))) {
    console.log(`${first} does not exist`);
    return;
  }
  if (!(await dirExists(second))) {
    console.log(`${second} does not exist`);
    return;
  }

  cp.spawnSync(`git diff --no-index ./${first}/app ./${second}/app`, {
    shell: true,
    stdio: "inherit",
  });
}

go();
