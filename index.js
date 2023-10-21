#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const resolve = require("path").resolve;
const ChalkHelper = require("./Utils/ChalkHelper");
const npmVersionCommand = require("./Commands/npmVersion");
const fastServeCommand = require("./Commands/fastServe");

const program = new Command();

program
  .version("0.0.1")
  .description("An example CLI for managing a directory")
  .option("-p, --path <value>", "path")
  .option("-nv, --npm-version", "NPM version")
  .option("-fs, --fast-serve", "Fast Serve")
  .parse(process.argv);

const options = program.opts();
console.log("options");
console.log(options);

let path;
if (options.path) {
  path = options.path.replace('"', "");
} else {
  path = process.cwd();
}

if (!fs.existsSync(resolve(path, "gulpfile.js"))) {
  ChalkHelper.ChalkError(
    "path not found or does not contain gulpfile.js, exiting with code 1"
  );
  process.exit(1);
}
ChalkHelper.ChalkSuccess("SPFx folder path with gulpfile.js");
ChalkHelper.ChalkMessage(path);

if (options.npmVersion) {
  console.log("options.npmVersion");

  const pathWithGulpFileJS = resolve(path, "gulpfile.js");
  console.log(pathWithGulpFileJS);
  npmVersionCommand(pathWithGulpFileJS);
}

if (options.fastServe) {
  console.log("options.fastServe");
  fastServeCommand(path);
}
