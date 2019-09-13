#!/usr/bin/env node

// dependencies:
const figlet = require('figlet');
const inquirer = require('inquirer');
const shell = require('shelljs');
const clc = require("cli-color");
const yaml = require('js-yaml');
const fs = require('fs');
const writeJsonFile = require('write-json-file');

//
const config = yaml.load(fs.readFileSync('.t3.sync.yaml', 'utf8'));
const availableServers = [];

var myChoises = [
    new inquirer.Separator('-- Cache'),
    'cache:flush',
    'cache:flush --force',
    new inquirer.Separator('-- Database'),
    'database:updateschema',
    {
        name: 'database:export',
        value: 'database:export > backup.sql'
    },
    new inquirer.Separator('-- Install'),
    'install:fixfolderstructure',
    'install:extensionsetupifpossible',
    new inquirer.Separator('-- Language'),
    'language:update',
    new inquirer.Separator('-- Sync'),
    new inquirer.Separator('-- Exit'),
    'exit'
];

var myJson = {
    "name": "typo3-console-helper",
    "version": "0.1.2",
    "description": "TYPO3 Console Helper",
    "author": "Boris Schauer",
    "license": "GPL-3.0-or-later",
    "scripts": {
        "test": "bo"
    }
};

// console.log(myJson);

console.log(myJson.scripts);

Object.keys(config).forEach(function (key) {
    if (key !== 'local') {
        myChoises.push(key);
        let obj = {['sync' + key]: key};
        console.log(obj);
        Object.assign(myJson.scripts, obj)
    }
});


writeJsonFile('foo.json', myJson);


// console.log(myJson);

// console.log(availableServers);
// console.log(config);

var myArgs = process.argv.slice(2);

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
            choices: myChoises,
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
    shell.exec(command, {silent: true}, function (code, stdout) {
        if (code === 0) {
            console.log(clc.greenBright(stdout));
        } else if (code === 1) {
            console.log(clc.redBright(stdout));
        }
        // consoleCommands();
    });
};


const runAll = function () {
    welcomeText();
    if (myArgs.length > 0) {
        const t3cmd = 'php typo3cms ' + myArgs[0];
        runCmd(t3cmd);
    } else {
        // consoleCommands();
    }
};

runAll();
