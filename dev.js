const fs = require("fs/promises");
const { 2: appDir } = process.argv;

const cp = require("child_process");

async function go() {
  // warn if the directory deosn't exist
  const stat = await fs.stat(appDir).catch(() => false);
  if (!stat) {
    console.log(`${appDir} does not exist`);
    return;
  }

  const [category, numberName] = appDir.split("/");
  const [number] = numberName.split("-");
  const PORT =
    {
      exercise: 4000,
      final: 5000,
    }[category] + Number(number);

  // won't have to set the DEV_SERVER_PORT when
  // https://github.com/remix-run/remix/issues/1277 is done
  const {
    devServerPort: DEV_SERVER_PORT,
  } = require(`./${appDir}/remix.config.js`);

  cp.spawn(`npm run dev`, {
    cwd: appDir,
    shell: true,
    stdio: "inherit",
    env: { PORT, DEV_SERVER_PORT, ...process.env },
  });
}

go();
