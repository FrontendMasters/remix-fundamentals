const cp = require("child_process");
const { resolvePath, dirExists } = require("./scripts/utils");

let { 2: first, 3: second } = process.argv;

if (/^\d+$/.test(first)) {
  first = `./exercise/${first.padStart(2, "0")}`;
}

if (/^\d+$/.test(second)) {
  second = `./final/${second.padStart(2, "0")}`;
}

if (!second) {
  second = first.replace("exercise", "final");
}

async function go() {
  first = resolvePath(first);
  if (!(await dirExists(first))) {
    console.error(`${process.argv[2]} (${first}) does not exist`);
    return;
  }
  second = resolvePath(second);
  if (!(await dirExists(second))) {
    console.error(`${process.argv[3]} (${second}) does not exist`);
    return;
  }

  console.log(`Showing diff between ${first}/app and ${second}/app`);

  cp.spawnSync(`git diff --no-index ./${first}/app ./${second}/app`, {
    shell: true,
    stdio: "inherit",
  });
}

go();
