#!/usr/bin/env node

// dependencies:
const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');
const clc = require("cli-color");

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
            pageSize: 20,
            choices: [
                new inquirer.Separator('-- Cache --'),
                'cache:flush',
                'cache:flush --force',
                new inquirer.Separator('-- Database --'),
                'database:updateschema',
                {
                    name: 'database:export',
                    value: 'database:export > backup.sql'
                },
                new inquirer.Separator('-- Install --'),
                'install:fixfolderstructure',
                'install:extensionsetupifpossible',
                new inquirer.Separator('-- Language --'),
                'language:update',
                new inquirer.Separator('-- Exit --'),
                'exit'
            ],

            default: 0,
        }]).then((answers) => {
            if (answers.t3console == 'exit') {
                process.exit();
            }
            console.log(`\nRun: php typo3cms ${answers.t3console}\n`);
            const t3cmd = 'php typo3cms ' + answers.t3console;
            runCmd(t3cmd);
        });
    }, 200);
};

const runCmd = function (command) {
    shell.exec(command, {silent:true}, function (code, stdout) {
        if (code === 0) {
            console.log(clc.greenBright(stdout));
        } else if (code === 1) {
            console.log(clc.redBright(stdout));
        }
        consoleCommands();
    });
};


const runAll = function () {
    welcomeText();
    consoleCommands();
};

runAll();
