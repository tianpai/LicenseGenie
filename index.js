import fs from "fs/promises";
import path from "path";
import os from "os";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function readConfig(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    if (e.code === "ENOENT") {
      return {};
    } else {
      throw e;
    }
  }
}

// default license
const fallbackLicenses = ["MIT", "Apache 2.0", "GPL 3.0"];
const defaultConfig = await readConfig(path.join(__dirname, "config.json"));
const userConfigPath = path.join(
  os.homedir(),
  ".config",
  "licensegenie",
  "config.json",
);
const userConfig = await readConfig(userConfigPath);

let availableLicenses = [
  ...(defaultConfig.availableLicenses || []),
  ...(userConfig.customLicenses || []),
];

if (availableLicenses.length === 0) {
  availableLicenses = fallbackLicenses;
}

async function generateLicense() {
  try {
    const licenseQuestion = [
      {
        type: "list",
        name: "licenseType",
        message: "Which license do you want to generate?",
        choices: availableLicenses,
      },
    ];

    const licenseAnswer = await inquirer.prompt(licenseQuestion);
    let questions = [];

    if (
      ["MIT", "Apache 2.0"].includes(licenseAnswer.licenseType) ||
      (userConfig.licenseMetadata &&
        userConfig.licenseMetadata[licenseAnswer.licenseType] &&
        userConfig.licenseMetadata[licenseAnswer.licenseType].requiresName)
    ) {
      questions.push({
        type: "input",
        name: "name",
        message: "What is the copyright holder's name?",
        default: "Your Name",
      });
    }

    const additionalAnswers = await inquirer.prompt(questions);
    const answers = { ...licenseAnswer, ...additionalAnswers };

    const year = new Date().getFullYear();
    let licenseFileName = `${answers.licenseType.replace(/\s+/g, "_")}.txt`;

    let licenseDir = __dirname;
    if (
      userConfig.customLicenses &&
      userConfig.customLicenses.includes(answers.licenseType)
    ) {
      licenseDir = userConfig.customLicenseDir;
    }

    const licenseFilePath = path.join(
      licenseDir,
      "license_template",
      licenseFileName,
    );
    let licenseText = await fs.readFile(licenseFilePath, "utf-8");

    licenseText = licenseText.replace(/\[year\]/g, year);
    if (answers.name) {
      licenseText = licenseText.replace(/\[name\]/g, answers.name);
    }

    await fs.writeFile(`LICENSE`, licenseText);

    console.log(
      `The license has been saved to a file named LICENSE in the current directory.`,
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

generateLicense();
