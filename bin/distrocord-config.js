#!/usr/bin/env node

const prompt        = require('prompt');
const util          = require("util");
const validate      = require('class-validator').validateSync;
const chalk         = require('chalk');
const Configuration = require('../build/Config/Configuration').default;

console.log(chalk.cyan(`

 _____  _     _              _____              _
|  __ \\(_)   | |            / ____|            | |
| |  | |_ ___| |_ _ __ ___ | |     ___  _ __ __| |
| |  | | / __| __| '__/ _ \\| |    / _ \\| '__/ _\` |
| |__| | \\__ \\ |_| | | (_) | |___| (_) | | | (_| |
|_____/|_|___/\\__|_|  \\___/ \\_____\\___/|_|  \\__,_|
             Configuration Generator
`));

console.log("");
console.log(chalk.red("A couple parameters will be requested below. Please fill them out.\n\n"));

prompt.message = chalk.yellow('Question');

let options = {
    properties: {
        token:            {
            pattern:  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
            message:  'Must pass a valid token',
            required: true
        },
        mongoGuildsUrl:   {
            pattern:  /^(mongodb:\/{2})((\w+):(\w+)@)?(\w+?):?(\d+)?\/(\w+)?/,
            message:  'Must pass a valid mongo DSN (mongodb://username:password@url:port/',
            required: true
        },
        mongoChannelsUrl: {
            pattern:  /^(mongodb:\/{2})((\w+):(\w+)@)?(\w+?):?(\d+)?\/(\w+)?/,
            message:  'Must pass a valid mongo DSN (mongodb://username:password@url:port/',
            required: true
        },
        mongoUsersUrl:    {
            pattern:  /^(mongodb:\/{2})((\w+):(\w+)@)?(\w+?):?(\d+)?\/(\w+)?/,
            message:  'Must pass a valid mongo DSN (mongodb://username:password@url:port/',
            required: true
        },
        logLevel:         {
            pattern: /^error|warn|info|verbose|debug|silly$/,
            message: "Must pass a valid log level (\"error\", \"warn\", \"info\", \"verbose\", \"debug\", \"silly\")"
        },
        autoReconnect:    {
            type:    'boolean',
            message: 'Must pass a valid boolean'
        }
    }
};

prompt.start();
prompt.get(options, (err, result) => {
    if (!err) {
        fs.writeFile('config.json', JSON.stringify(result, null, 4), () => {
        });
    }
});

//console.log(Distrocord);

//prompt.start();
//prompt.get
