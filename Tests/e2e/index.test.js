/* eslint-env jest */

const fs = require("fs");
const os = require("os");
const resolve = require("path").resolve;
const execSync = require("child_process").execSync;
const join = require("path").join;
const parentFolderPath_IndexTest =
  require("../../Utils/folderPaths").parentFolderPath_IndexTest();
const wpFolderPath_IndexTest =
  require("../../Utils/folderPaths").wpFolderPath_IndexTest();

beforeEach(() => {
  // save current working dir in to revert to it in teardown
  process.env.initialPath_IndexTest = process.cwd();

  fs.mkdirSync(parentFolderPath_IndexTest, { recursive: true });

  process.chdir(parentFolderPath_IndexTest);
  execSync(
    `yo @microsoft/sharepoint --solution-name "VanillaSolution" --framework "react"` +
      ` --component-type "webpart" --component-name "WebPart1" --skip-install --environment "spo" `,
    { stdio: [] }
  );

  process.chdir(wpFolderPath_IndexTest);

  execSync(`spfx-jack -v -f -g -s -p`);
});

test("indexTest: fast-serve folder created", () => {
  expect(
    fs.existsSync(resolve(wpFolderPath_IndexTest, "fast-serve"))
  ).toBeTruthy();
});

test("npmVersion: version-sync gulp task added", () => {
  const gulpfilePath = join(wpFolderPath_IndexTest, "gulpfile.js");
  const gulpfilePathData = fs.readFileSync(gulpfilePath, "utf8");
  expect(gulpfilePathData).toContain(`gulp.task("version-sync"`);
});

test("gitInit: .git folder created", () => {
  expect(fs.existsSync(resolve(wpFolderPath_IndexTest, ".git"))).toBeTruthy();
});

test("sortPackage: postinstall script added", () => {
  const packageJsonPath = join(wpFolderPath_IndexTest, "package.json");
  const packageJSONData = fs.readFileSync(packageJsonPath, "utf8");
  expect(packageJSONData).toContain(`npx sort-package-json`);
});

afterEach(() => {
  process.chdir(os.homedir());

  fs.rmSync(parentFolderPath_IndexTest, {
    recursive: true,
    force: true
  });

  // revert to initial working dir from setup
  process.chdir(process.env.initialPath_IndexTest);
});
