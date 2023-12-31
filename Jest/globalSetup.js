const fs = require("fs");
const execSync = require("child_process").execSync;
const parentFolderPath = require("../Utils/folderPaths").parentFolderPath();
const wpFolderPath = require("../Utils/folderPaths").wpFolderPath();

module.exports = function () {
  // save current working dir in to revert to it in teardown
  process.env.initialPath = process.cwd();
  execSync("npm link", {
    stdio: []
  });

  fs.mkdirSync(parentFolderPath, { recursive: true });

  let packagesToInstallGlobally = [
    "prettier",
    "sort-package-json",
    "gulp-cli",
    "yo@4.3.1",
  ];

  console.log();
  console.log(process.version);
  if (process.version.startsWith("v16")) {
    packagesToInstallGlobally.push("@microsoft/generator-sharepoint@1.17.4");
  } else if (process.version.startsWith("v18")) {
    packagesToInstallGlobally.push("@microsoft/generator-sharepoint@1.18");
  }

  packagesToInstallGlobally.forEach((package_name) => {
    console.log(`Validating package: ${package_name}`);
    execSync(
      `npm list -g ${package_name} || npm install -g ${package_name} --silent`
    );
  });

  process.chdir(parentFolderPath);

  execSync(
    `yo @microsoft/sharepoint --solution-name "VanillaSolution" --framework "react"` +
      ` --component-type "webpart" --component-name "WebPart1" --skip-install --environment "spo" `,
    { stdio: [] }
  );

  process.chdir(wpFolderPath);
};
