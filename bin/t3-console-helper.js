#!/usr/bin/env node

// dependencies:
const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');

// variables:
const executePath = process.cwd();

// helpers:
const logging = function () {
    console.log(executePath);
};

const welcomeText = function () {
    figlet('TYPO3 Console', function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data);
    });
};

const consoleCommands = function () {
    setTimeout(function () {
        inquirer.prompt([{
            name: 't3console',
            type: 'list',
            message: 'Which command do you want to run?',
            choices: [
                new inquirer.Separator('-- Cache --'),
                'cache:flush',
                new inquirer.Separator('-- Database --'),
                'database:updateschema',
                new inquirer.Separator('-- Install --'),
                'install:fixfolderstructure',
                'install:extensionsetupifpossible'],
            default: 0,
        }]).then((answers) => {
            console.log(`\nRun: ${answers.t3console}\n`);
            const t3cmd = 'php typo3cms ' + answers.t3console;
            runCmd(t3cmd);
        });
    }, 200);
};

const runCmd = function (command) {
    shell.exec(command);
};


const runAll = function () {
    welcomeText();
    consoleCommands();
};

runAll();
